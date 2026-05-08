'use client';

import { useEffect, useRef } from 'react';

export default function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Animation state
    let animationId: number;
    let rotation = 0;

    // Draw surveillance network
    const draw = () => {
      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;

      // Clear canvas
      ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
      ctx.fillRect(0, 0, width, height);

      ctx.save();
      ctx.translate(width / 2, height / 2);
      rotation += 0.002;

      // Draw rotating circles
      ctx.strokeStyle = `rgba(37, 99, 235, 0.1)`;
      ctx.lineWidth = 1;

      for (let i = 1; i <= 3; i++) {
        ctx.beginPath();
        ctx.arc(0, 0, i * 60, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Draw nodes
      const nodeCount = 12;
      for (let i = 0; i < nodeCount; i++) {
        const angle = (i / nodeCount) * Math.PI * 2 + rotation;
        const x = Math.cos(angle) * 150;
        const y = Math.sin(angle) * 150;

        // Node connection to center
        ctx.strokeStyle = `rgba(37, 99, 235, 0.2)`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(x, y);
        ctx.stroke();

        // Draw node
        ctx.fillStyle = `rgba(37, 99, 235, 0.8)`;
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();

        // Draw pulse
        ctx.strokeStyle = `rgba(37, 99, 235, 0.3)`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(x, y, 8 + Math.sin(rotation * 2) * 3, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Central node
      ctx.fillStyle = 'rgba(37, 99, 235, 1)';
      ctx.beginPath();
      ctx.arc(0, 0, 8, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ display: 'block' }}
    />
  );
}
