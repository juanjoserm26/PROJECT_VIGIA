# main.py - VERSION 2.7
# Cambios respecto a V2.6:
#   1. BUG CRÍTICO CORREGIDO: ai_worker_thread ya no analiza el mismo frame
#      repetidamente. Ahora respeta correctamente new_frame_ready.
#   2. AI_FRAME_INTERVAL aumentado a 4 (más fluidez visual)
#   3. Reset limpio del shared state al cambiar video (evita frame fantasma)

import asyncio
import cv2
import base64
import json
import os
import queue
import time
import threading
from typing import Set

from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from starlette.websockets import WebSocketDisconnect
from detector import analyze_frame, reset_video_state
import twilio_sender
import alarm

app = FastAPI()
_cors_origins = os.environ.get(
    "VIGIA_CORS_ORIGINS",
    "http://localhost:3000,http://127.0.0.1:3000",
).split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in _cors_origins if o.strip()],
    allow_methods=["*"],
    allow_headers=["*"],
)

connected_clients: list[WebSocket] = []
VIDEOS_FOLDER = "videos"

playback = {
    "paused":    False,
    "speed":     1.0,
    "skip":      False,
    "jump_secs": 0,   # +10 adelantar, -10 retroceder
    "video_index": 0,  # índice en video_files (modo web headless)
}

# Web demo: último frame JPEG en base64 para /ws/demo-stream
STREAM_FRAME: dict = {"b64": None, "lock": threading.Lock()}
command_queue: "queue.Queue[dict]" = queue.Queue()
demo_ws_clients: Set[WebSocket] = set()

# Shared state entre hilo de display y hilo de IA
shared = {
    "raw_frame":       None,    # Frame crudo para que la IA analice
    "annotated_frame": None,    # Frame ya anotado por la IA
    "lock":            threading.Lock(),
    "new_frame_ready": False,   # Señal: hay frame nuevo pendiente
    "events":          [],
}

alert_queue      = []
alert_queue_lock = threading.Lock()


def _configure_alarm_for_web() -> None:
    """Sin sonido ni hilos de alarma cuando la IA corre solo para la web."""
    alarm.start_alarm = lambda *args, **kwargs: None  # noqa: ARG005
    alarm.stop_alarm = lambda *args, **kwargs: None  # noqa: ARG005


def _drain_commands() -> None:
    """Órdenes desde la página (WebSocket) para cambiar vídeo / pausa."""
    while True:
        try:
            cmd = command_queue.get_nowait()
        except queue.Empty:
            break
        c = cmd.get("cmd")
        if c == "set_video":
            playback["video_index"] = max(0, int(cmd.get("index", 0)))
            playback["skip"] = True
        elif c == "pause":
            playback["paused"] = True
        elif c == "resume":
            playback["paused"] = False
        elif c == "seek":
            playback["jump_secs"] = float(cmd.get("seconds", 0))


# ─────────────────────────────────────────────────────────────────────────────

def get_video_files():
    if not os.path.exists(VIDEOS_FOLDER):
        os.makedirs(VIDEOS_FOLDER)
        return []
    exts = (".mp4", ".avi", ".mov", ".mkv")
    videos = [
        os.path.join(VIDEOS_FOLDER, f)
        for f in sorted(os.listdir(VIDEOS_FOLDER))
        if f.lower().endswith(exts)
    ]
    if videos:
        print(f"📹 {len(videos)} videos encontrados:")
        for v in videos:
            print(f"   → {os.path.basename(v)}")
    else:
        print("⚠️  Sin videos en 'videos/'. Usando cámara en vivo.")
    return videos


def draw_controls_bar(frame, speed, paused):
    h, w = frame.shape[:2]
    overlay = frame.copy()
    cv2.rectangle(overlay, (0, h-30), (w, h), (15, 15, 15), -1)
    cv2.addWeighted(overlay, 0.80, frame, 0.20, 0, frame)
    estado = "PAUSADO" if paused else f"x{speed}"
    txt = (f" {estado} | ESPACIO=pausa  F=x2  S=x0.5  N=normal"
           f"  ,=retroceder 10s  .=adelantar 10s  Q=siguiente")
    cv2.putText(frame, txt, (8, h-9),
                cv2.FONT_HERSHEY_SIMPLEX, 0.40, (200, 200, 200), 1)


# ─────────────────────────────────────────────────────────────────────────────
# Hilo de IA (BUG CORREGIDO respecto a V2.6)
# ─────────────────────────────────────────────────────────────────────────────

def ai_worker_thread():
    """
    Lee frames del shared state SOLO cuando hay uno nuevo disponible
    (new_frame_ready == True). Esto evita el bug de V2.6 donde se analizaba
    el mismo frame cientos de veces desperdiciando CPU.
    """
    print("🤖 Hilo de IA iniciado")
    while True:
        frame_to_analyze = None

        with shared["lock"]:
            if shared["new_frame_ready"] and shared["raw_frame"] is not None:
                frame_to_analyze          = shared["raw_frame"].copy()
                shared["new_frame_ready"] = False   # ← marcar como consumido

        if frame_to_analyze is None:
            time.sleep(0.005)
            continue

        try:
            events, annotated = analyze_frame(frame_to_analyze)
        except Exception as e:
            print(f"Error IA: {e}")
            time.sleep(0.01)
            continue

        with shared["lock"]:
            shared["annotated_frame"] = annotated
            if events:
                shared["events"].extend(events)

        if events:
            _, buf = cv2.imencode(".jpg", annotated, [cv2.IMWRITE_JPEG_QUALITY, 60])
            fb64 = base64.b64encode(buf).decode("utf-8")
            with alert_queue_lock:
                for ev in events:
                    alert_queue.append({"event": ev, "frame": fb64})


# ─────────────────────────────────────────────────────────────────────────────
# Hilo de video
# ─────────────────────────────────────────────────────────────────────────────

def video_thread_func(video_files, headless: bool = False):
    if headless:
        print("\n🌐 Modo WEB (sin ventana OpenCV): frames con YOLO → WebSocket /ws/demo-stream")
        print("   La página Next.js debe tener NEXT_PUBLIC_VIGIA_WS_URL apuntando a este servidor.\n")
    else:
        print("\n🎮 Controles (haz clic sobre la ventana del video primero):")
        print("   ESPACIO   → Pausar / Reanudar")
        print("   F         → Velocidad x2")
        print("   S         → Velocidad x0.5")
        print("   N         → Velocidad normal")
        print("   , (coma)  → Retroceder 10 segundos")
        print("   . (punto) → Adelantar 10 segundos")
        print("   Q         → Siguiente video\n")

    # Lanzar hilo de IA
    ai_thread = threading.Thread(target=ai_worker_thread, daemon=True)
    ai_thread.start()

    # Analizamos 1 de cada 4 frames → display más fluido
    AI_FRAME_INTERVAL = 4

    while True:
        if headless and video_files:
            idx = playback["video_index"] % len(video_files)
            sources = [video_files[idx]]
        else:
            sources = video_files if video_files else [0]

        for source in sources:
            # Reset de controles
            playback["skip"]      = False
            playback["speed"]     = 1.0
            playback["paused"]    = False
            playback["jump_secs"] = 0

            # Limpiar estado del video anterior
            reset_video_state()
            with shared["lock"]:
                shared["annotated_frame"]  = None
                shared["raw_frame"]        = None
                shared["new_frame_ready"]  = False

            name = os.path.basename(str(source)) if source != 0 else "Camara en vivo"
            print(f"\n▶️  Reproduciendo: {name}")

            cap = cv2.VideoCapture(source)
            if not cap.isOpened():
                print(f"❌ No se pudo abrir: {name}")
                continue

            fps = cap.get(cv2.CAP_PROP_FPS)
            if fps <= 0 or fps > 120:
                fps = 25
            total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
            base_delay   = 1.0 / fps
            current_pos  = 0
            frame_counter = 0

            print(f"✅ FPS: {fps:.0f} | Frames totales: {total_frames} | Duración: {total_frames/fps:.1f}s")

            while True:
                if playback["skip"]:
                    alarm.stop_alarm()
                    break

                # Salto de tiempo (coma/punto)
                if playback["jump_secs"] != 0:
                    jump_frames = int(playback["jump_secs"] * fps)
                    current_pos = max(0, min(current_pos + jump_frames, total_frames - 1))
                    cap.set(cv2.CAP_PROP_POS_FRAMES, current_pos)
                    print(f"⏩ Posición: {current_pos/fps:.1f}s")
                    playback["jump_secs"] = 0

                # Pausa
                if playback["paused"]:
                    if headless:
                        _drain_commands()
                        time.sleep(0.04)
                    else:
                        key = cv2.waitKey(50) & 0xFF
                        if key == ord(' '):
                            playback["paused"] = False
                        elif key == ord('q'):
                            playback["skip"] = True
                        elif key == ord(','):
                            playback["jump_secs"] = -10
                        elif key == ord('.'):
                            playback["jump_secs"] = 10
                        time.sleep(0.02)
                    continue

                t0 = time.time()

                # x2: saltar frames reales
                if playback["speed"] >= 2.0:
                    current_pos += 2
                    cap.set(cv2.CAP_PROP_POS_FRAMES, current_pos)
                else:
                    current_pos += 1

                ret, frame = cap.read()
                if not ret:
                    print(f"✅ Video terminado: {name}")
                    alarm.stop_alarm()
                    if not headless:
                        cv2.destroyAllWindows()
                    break

                frame_counter += 1

                # Redimensionar si muy ancho
                h, w = frame.shape[:2]
                if w > 1280:
                    scale = 1280 / w
                    frame = cv2.resize(frame, (1280, int(h * scale)))

                # Enviar a IA 1 de cada AI_FRAME_INTERVAL frames
                if frame_counter % AI_FRAME_INTERVAL == 0:
                    with shared["lock"]:
                        shared["raw_frame"]       = frame.copy()
                        shared["new_frame_ready"] = True

                # Mostrar: frame anotado si disponible, crudo si no
                with shared["lock"]:
                    display = (shared["annotated_frame"].copy()
                               if shared["annotated_frame"] is not None
                               else frame.copy())

                draw_controls_bar(display, playback["speed"], playback["paused"])
                if headless:
                    _, buf = cv2.imencode(".jpg", display, [cv2.IMWRITE_JPEG_QUALITY, 52])
                    with STREAM_FRAME["lock"]:
                        STREAM_FRAME["b64"] = base64.b64encode(buf).decode("ascii")
                    _drain_commands()
                else:
                    cv2.imshow(f"PROJECT_VIGIA | {name}", display)

                    key = cv2.waitKey(1) & 0xFF
                    if key == ord(' '):
                        playback["paused"] = True
                    elif key == ord('f'):
                        playback["speed"] = 2.0
                        print("⏩ Velocidad x2")
                    elif key == ord('s'):
                        playback["speed"] = 0.5
                        print("⏪ Velocidad x0.5")
                    elif key == ord('n'):
                        playback["speed"] = 1.0
                        print("▶️  Velocidad normal")
                    elif key == ord(','):
                        playback["jump_secs"] = -10
                        print("⏪ -10s")
                    elif key == ord('.'):
                        playback["jump_secs"] = 10
                        print("⏩ +10s")
                    elif key == ord('q'):
                        playback["skip"] = True
                        alarm.stop_alarm()
                        cv2.destroyAllWindows()

                # Control preciso de velocidad
                elapsed   = time.time() - t0
                target    = base_delay / playback["speed"]
                remaining = target - elapsed
                if remaining > 0.002:
                    time.sleep(remaining)

            cap.release()

        if not video_files:
            break
        if not headless:
            print("\n🔄 Todos los videos completados. Reiniciando...")
            time.sleep(1)


# ─────────────────────────────────────────────────────────────────────────────
# WebSocket y dispatcher de alertas
# ─────────────────────────────────────────────────────────────────────────────

@app.websocket("/ws/alerts")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    connected_clients.append(websocket)
    try:
        while True:
            await websocket.receive_text()
    except Exception:
        pass
    finally:
        if websocket in connected_clients:
            connected_clients.remove(websocket)


async def alert_dispatcher():
    while True:
        with alert_queue_lock:
            items = alert_queue.copy()
            alert_queue.clear()

        for item in items:
            msg = {
                "event":     item["event"],
                "frame":     item["frame"],
                "countdown": 10
            }
            for client in connected_clients.copy():
                try:
                    await client.send_text(json.dumps(msg))
                except Exception:
                    connected_clients.remove(client)

            await twilio_sender.notify_police(item["event"])

        await asyncio.sleep(0.1)


async def broadcast_demo_frames():
    """Envía el último frame JPEG a todos los clientes de demostración web (~15 fps máx)."""
    while True:
        await asyncio.sleep(1 / 15)
        with STREAM_FRAME["lock"]:
            b64 = STREAM_FRAME["b64"]
        if not b64:
            continue
        payload = json.dumps({"type": "frame", "data": b64})
        stale = []
        for ws in list(demo_ws_clients):
            try:
                await ws.send_text(payload)
            except Exception:
                stale.append(ws)
        for ws in stale:
            demo_ws_clients.discard(ws)


@app.websocket("/ws/demo-stream")
async def ws_demo_stream(websocket: WebSocket):
    await websocket.accept()
    demo_ws_clients.add(websocket)
    vf = get_video_files()
    names = [os.path.basename(v) for v in vf]
    try:
        await websocket.send_json(
            {"type": "hello", "videos": names, "video_index": playback["video_index"]},
        )
        while True:
            data = await websocket.receive_json()
            command_queue.put(data)
    except WebSocketDisconnect:
        pass
    except Exception:
        pass
    finally:
        demo_ws_clients.discard(websocket)


@app.get("/api/demo/videos")
def api_demo_videos():
    vf = get_video_files()
    return {
        "videos": [os.path.basename(v) for v in vf],
        "headless": os.environ.get("VIGIA_HEADLESS", "1") == "1",
    }


@app.get("/health")
def health():
    return {"status": "ok", "service": "project-vigia-prototipo"}


@app.on_event("startup")
async def startup():
    video_files = get_video_files()
    headless = os.environ.get("VIGIA_HEADLESS", "1") == "1"
    if headless:
        _configure_alarm_for_web()
    t = threading.Thread(
        target=video_thread_func,
        args=(video_files, headless),
        daemon=True,
    )
    t.start()
    asyncio.create_task(alert_dispatcher())
    asyncio.create_task(broadcast_demo_frames())
