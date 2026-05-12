#!/usr/bin/env python3
"""
Genera MP4 con las mismas anotaciones que el monitor en vivo:
rostros (verde), objetos YOLO (naranja), esqueleto pose (verde/rojo), barra de estado.

La web solo reproduce vídeo; la IA corre aquí en Python. Después copias los MP4
generados a: PROJECT_VIGIA/app/public/demostracion/

Uso (desde esta carpeta, con el venv activado y dependencias instaladas):

  # Un archivo
  python export_annotated_video.py -i videos_in/escenario-1.mp4 -o videos_out/escenario-1.mp4

  # Lote: lee videos_in/escenario-1.mp4 … escenario-5.mp4 y escribe videos_out/
  python export_annotated_video.py --batch

Requisitos: mismas dependencias que el prototipo (opencv-python, ultralytics, numpy).
"""

from __future__ import annotations

import argparse
import os
import sys

import cv2

# Imports del detector en esta carpeta
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from detector import analyze_frame, reset_tracker_state  # noqa: E402


def process_file(input_path: str, output_path: str) -> bool:
    reset_tracker_state()
    cap = cv2.VideoCapture(input_path)
    if not cap.isOpened():
        print(f"❌ No se pudo abrir: {input_path}")
        return False

    fps = float(cap.get(cv2.CAP_PROP_FPS)) or 25.0
    w = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    h = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    if w <= 0 or h <= 0:
        print(f"❌ Resolución inválida en {input_path}")
        cap.release()
        return False

    out_dir = os.path.dirname(os.path.abspath(output_path))
    if out_dir:
        os.makedirs(out_dir, exist_ok=True)
    fourcc = cv2.VideoWriter_fourcc(*"mp4v")
    out = cv2.VideoWriter(output_path, fourcc, fps, (w, h))
    if not out.isOpened():
        print(f"❌ No se pudo crear el archivo de salida: {output_path}")
        cap.release()
        return False

    n = 0
    print(f"▶ Procesando {input_path} → {output_path} ({w}x{h} @ {fps:.2f} fps)")

    while True:
        ret, frame = cap.read()
        if not ret:
            break
        analyze_frame(frame, show_preview=False)
        out.write(frame)
        n += 1
        if n % 60 == 0:
            print(f"   … {n} frames")

    cap.release()
    out.release()
    print(f"✅ Listo: {n} frames guardados en {output_path}\n")
    return True


def main() -> None:
    parser = argparse.ArgumentParser(description="Exportar vídeo con anotaciones IA")
    parser.add_argument("-i", "--input", help="Video de entrada (MP4)")
    parser.add_argument("-o", "--output", help="Video de salida anotado (MP4)")
    parser.add_argument(
        "--batch",
        action="store_true",
        help="Procesa videos_in/escenario-1.mp4 … escenario-5.mp4 → videos_out/",
    )
    parser.add_argument(
        "--in-dir",
        default="videos_in",
        help="Carpeta de entrada (modo --batch)",
    )
    parser.add_argument(
        "--out-dir",
        default="videos_out",
        help="Carpeta de salida (modo --batch)",
    )
    args = parser.parse_args()

    if args.batch:
        os.makedirs(args.out_dir, exist_ok=True)
        for i in range(1, 6):
            inp = os.path.join(args.in_dir, f"escenario-{i}.mp4")
            out = os.path.join(args.out_dir, f"escenario-{i}.mp4")
            if not os.path.isfile(inp):
                print(f"⚠ Omitido (no existe): {inp}")
                continue
            process_file(inp, out)
        print(
            "Siguiente paso: copia los MP4 de",
            args.out_dir,
            "a PROJECT_VIGIA/app/public/demostracion/ (reemplaza los anteriores si quieres).",
        )
        return

    if not args.input or not args.output:
        parser.print_help()
        print("\nEjemplo: python export_annotated_video.py -i entrada.mp4 -o salida_anotado.mp4")
        sys.exit(1)

    process_file(args.input, args.output)


if __name__ == "__main__":
    main()
