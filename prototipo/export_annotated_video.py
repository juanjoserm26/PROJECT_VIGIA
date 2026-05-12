#!/usr/bin/env python3
"""
Exporta MP4 con las anotaciones que dibuja detector.analyze_frame.
Compatible si analyze_frame solo acepta (frame): llama sin show_preview.

Uso (con .venv activado):
  python export_annotated_video.py --batch
"""

from __future__ import annotations

import argparse
import inspect
import os
import sys

import cv2

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import alarm as _alarm_mod  # noqa: E402 — antes de usar detector en export

from detector import analyze_frame  # noqa: E402

try:
    from detector import reset_video_state as _reset_detector_state  # noqa: E402
except ImportError:
    try:
        from detector import reset_tracker_state as _reset_detector_state  # noqa: E402
    except ImportError:

        def _reset_detector_state():
            pass


def _silence_alarm_for_export() -> None:
    """Evita MP3/beep durante el batch (analyze_frame llama alarm.*)."""
    _alarm_mod.start_alarm = lambda *a, **k: None  # noqa: ARG005
    _alarm_mod.stop_alarm = lambda *a, **k: None  # noqa: ARG005


def _analyze_export(frame):
    sig = inspect.signature(analyze_frame)
    if "show_preview" in sig.parameters:
        return analyze_frame(frame, show_preview=False)
    return analyze_frame(frame)


def process_file(input_path: str, output_path: str) -> bool:
    _reset_detector_state()
    cap = cv2.VideoCapture(input_path)
    if not cap.isOpened():
        print(f"No se pudo abrir: {input_path}")
        return False

    fps = float(cap.get(cv2.CAP_PROP_FPS)) or 25.0
    w = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    h = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    if w <= 0 or h <= 0:
        print(f"Resolución inválida: {input_path}")
        cap.release()
        return False

    out_dir = os.path.dirname(os.path.abspath(output_path))
    if out_dir:
        os.makedirs(out_dir, exist_ok=True)

    fourcc = cv2.VideoWriter_fourcc(*"mp4v")
    out = cv2.VideoWriter(output_path, fourcc, fps, (w, h))
    if not out.isOpened():
        print(f"No se pudo crear salida: {output_path}")
        cap.release()
        return False

    n = 0
    print(f"Procesando {input_path} -> {output_path} ({w}x{h} @ {fps:.2f} fps)")

    while True:
        ret, frame = cap.read()
        if not ret:
            break
        _analyze_export(frame)
        out.write(frame)
        n += 1
        if n % 60 == 0:
            print(f"  ... {n} frames")

    cap.release()
    out.release()
    print(f"Listo: {n} frames -> {output_path}\n")
    return True


def main() -> None:
    _silence_alarm_for_export()

    parser = argparse.ArgumentParser()
    parser.add_argument("-i", "--input")
    parser.add_argument("-o", "--output")
    parser.add_argument("--batch", action="store_true")
    parser.add_argument("--in-dir", default="videos_in")
    parser.add_argument("--out-dir", default="videos_out")
    args = parser.parse_args()

    if args.batch:
        os.makedirs(args.out_dir, exist_ok=True)
        for i in range(1, 6):
            inp = os.path.join(args.in_dir, f"escenario-{i}.mp4")
            outp = os.path.join(args.out_dir, f"escenario-{i}.mp4")
            if not os.path.isfile(inp):
                print(f"Omitido (no existe): {inp}")
                continue
            process_file(inp, outp)
        print(
            "Copia los MP4 de",
            args.out_dir,
            "a ../app/public/demostracion/",
        )
        return

    if not args.input or not args.output:
        print("Uso: python export_annotated_video.py -i entrada.mp4 -o salida.mp4")
        print("  o: python export_annotated_video.py --batch")
        sys.exit(1)

    process_file(args.input, args.output)


if __name__ == "__main__":
    main()
