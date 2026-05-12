================================================================================
  PROTOTIPO PYTHON — PROJECT VIGIA (YOLO / detector / alarma)
================================================================================

Yo (desde Cursor) NO puedo ver tu Escritorio ni pegar carpetas por ti: tienes que
COPIAR UNA SOLA VEZ los archivos desde tu PC a esta carpeta.

--------------------------------------------------------------------------------
1) QUÉ VA AQUÍ
--------------------------------------------------------------------------------

Copia TODO el contenido de tu carpeta del escritorio, por ejemplo:

  Project-vigia-prototipo-V3.0

y PEGA los archivos DIRECTAMENTE dentro de:

  PROJECT_VIGIA/prototipo/

Es decir, aquí deben quedar juntos (ejemplo):

  prototipo/main.py
  prototipo/detector.py
  prototipo/requirements.txt
  prototipo/alarm.py          (o como se llame en tu versión)
  prototipo/twilio_sender.py
  prototipo/IPhone Alarm Ringtone.mp3   (si existe)
  prototipo/videos/           (subcarpeta de tu proyecto, si la tienes)

IMPORTANTE: No dejes una carpeta extra "Project-vigia-prototipo-V3.0" dentro de
prototipo con todo adentro; si pasa, entra a esa subcarpeta, selecciona TODO,
corta y pega un nivel arriba para que main.py y detector.py queden en prototipo/.

--------------------------------------------------------------------------------
2) CÓMO SE RELACIONA CON LA PÁGINA WEB (Next.js)
--------------------------------------------------------------------------------

Opción A — Vídeo ya exportado (sin servidor corriendo en la demo del navegador):
  La web sirve MP4 desde app/public/demostracion/. NO ejecuta Python dentro del
  navegador. Para ver cajas IA sin backend, usa export_annotated_video.py y copia
  los MP4 a public/demostracion/ (ver sección 4).

Opción B — YOLO en tiempo real en la página (requiere TU PC como servidor):
  1) En app/.env.local crea:
       NEXT_PUBLIC_VIGIA_WS_URL=http://127.0.0.1:8000
     (copia desde app/.env.example)
  2) npm run dev en la carpeta app/
  3) En otra terminal, desde esta carpeta prototipo/ (con .venv activado):
       $env:PYTHONIOENCODING='utf-8'
       $env:VIGIA_HEADLESS='1'
       uvicorn main:app --host 127.0.0.1 --port 8000
  4) Abre /demostracion en el navegador y pulsa "Conectar este escenario" en el
     bloque verde. El navegador muestra los JPEG que envía FastAPI por WebSocket;
     la inferencia ocurre en Python (YOLO), no en Chrome.

Variables útiles:
  VIGIA_HEADLESS=1  (por defecto) — sin ventana OpenCV, solo streaming web.
  VIGIA_HEADLESS=0  — ventana clásica OpenCV en tu escritorio (menos streaming web).
  VIGIA_CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000

--------------------------------------------------------------------------------
3) INSTALAR DEPENDENCIAS (Windows, PowerShell)
--------------------------------------------------------------------------------

Abre terminal en esta carpeta:

  cd D:\Users\JUAN JOSÉ\Desktop\PROJECT_VIGIA\prototipo

Crear entorno virtual:

  python -m venv .venv
  .\.venv\Scripts\Activate.ps1

Instalar:

  pip install -r requirements.txt

La primera vez Ultralytics puede descargar modelos YOLO (varios MB).

--------------------------------------------------------------------------------
4) EXPORTAR VÍDEOS CON IA DIBUJADA (para subirlos a la web)
--------------------------------------------------------------------------------

Mete los MP4 crudos en:   prototipo/videos_in/
Nombres esperados:         escenario-1.mp4 … escenario-5.mp4

Con .venv activado:

  python export_annotated_video.py --batch

Salida en: prototipo/videos_out/

Luego copia videos_out/*.mp4 a:

  PROJECT_VIGIA/app/public/demostracion/

Si detector.py de tu V3 NO tiene el parámetro show_preview ni reset_tracker_state,
abre INSTRUCCIONES_DETECTOR.txt en esta carpeta y aplica los cambios mínimos.

--------------------------------------------------------------------------------
5) SI DETECTOR CAMBIÓ DE NOMBRE O RUTA
--------------------------------------------------------------------------------

export_annotated_video.py importa "detector" y "analyze_frame".
Si tu archivo tiene otro nombre, renómbralo a detector.py o ajusta el import en
export_annotated_video.py (líneas del import).

================================================================================
