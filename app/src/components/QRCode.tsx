'use client';

import { useEffect, useRef } from 'react';

interface QRCodeProps {
  data: string;
  size?: number;
  level?: 'L' | 'M' | 'Q' | 'H';
}

export default function QRCode({ data, size = 200, level = 'M' }: QRCodeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Simple QR code generation using a placeholder pattern
    // For production, use a library like 'qrcode' or 'qrcode.react'
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = size;
    canvas.height = size;

    // Create a simple pattern-based QR code representation
    const cellSize = size / 29; // Standard QR has 29x29 modules for Level L
    const padding = 2;

    // White background
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, size, size);

    // Create pseudo-QR pattern based on data hash
    const hash = data
      .split('')
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);

    // Draw position markers (finder patterns)
    const drawPositionMarker = (x: number, y: number) => {
      // Outer 7x7 square (black)
      ctx.fillStyle = 'black';
      ctx.fillRect(x * cellSize, y * cellSize, 7 * cellSize, 7 * cellSize);

      // Inner 5x5 square (white)
      ctx.fillStyle = 'white';
      ctx.fillRect(
        (x + 1) * cellSize,
        (y + 1) * cellSize,
        5 * cellSize,
        5 * cellSize
      );

      // Center 3x3 square (black)
      ctx.fillStyle = 'black';
      ctx.fillRect(
        (x + 2) * cellSize,
        (y + 2) * cellSize,
        3 * cellSize,
        3 * cellSize
      );
    };

    // Draw three position markers
    drawPositionMarker(0, 0); // Top-left
    drawPositionMarker(22, 0); // Top-right
    drawPositionMarker(0, 22); // Bottom-left

    // Draw data pattern based on hash
    ctx.fillStyle = 'black';
    for (let i = 0; i < 29; i++) {
      for (let j = 0; j < 29; j++) {
        // Skip position markers and white areas
        if (
          (i < 9 && j < 9) ||
          (i > 19 && j < 9) ||
          (i < 9 && j > 19) ||
          (i >= 27 || j >= 27)
        ) {
          continue;
        }

        // Pseudo-random pattern
        const seed = (hash + i * j + i + j) % 256;
        const isBlack = seed > 128;

        if (isBlack) {
          ctx.fillRect(i * cellSize, j * cellSize, cellSize, cellSize);
        }
      }
    }

    // Draw timing patterns (alternating black/white lines)
    ctx.fillStyle = 'black';
    for (let i = 8; i < 21; i++) {
      if (i % 2 === 0) {
        ctx.fillRect(6 * cellSize, i * cellSize, cellSize, cellSize);
        ctx.fillRect(i * cellSize, 6 * cellSize, cellSize, cellSize);
      }
    }
  }, [data, size]);

  return (
    <canvas
      ref={canvasRef}
      className="border-2 border-gray-300 bg-white"
      style={{ width: `${size}px`, height: `${size}px` }}
    />
  );
}
