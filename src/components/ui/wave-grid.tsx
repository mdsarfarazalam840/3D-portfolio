"use client";
import React, { useRef, useEffect } from "react";

export function WaveGrid({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const rafRef = useRef<number>(0);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W: number, H: number;
    const COLS = 50;
    const ROWS = 35;
    let spacingX: number, spacingY: number;
    let offsetX: number, offsetY: number;
    const baseZ: number[][] = [];

    function resize() {
      const dpr = window.devicePixelRatio || 1;
      W = window.innerWidth;
      H = window.innerHeight;
      canvas!.width = W * dpr;
      canvas!.height = H * dpr;
      canvas!.style.width = W + "px";
      canvas!.style.height = H + "px";
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      spacingX = W / (COLS + 1);
      spacingY = H / (ROWS + 1);
      offsetX = spacingX;
      offsetY = spacingY;
    }

    resize();
    window.addEventListener("resize", resize);

    const handleMouse = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };
    const handleLeave = () => {
      mouseRef.current.x = -9999;
      mouseRef.current.y = -9999;
    };
    window.addEventListener("mousemove", handleMouse);
    window.addEventListener("mouseleave", handleLeave);

    function animate(ts: number) {
      timeRef.current = ts * 0.0008;
      ctx!.clearRect(0, 0, W, H);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const t = timeRef.current;

      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          const x = offsetX + c * spacingX;
          const y = offsetY + r * spacingY;

          const wave = Math.sin(x * 0.008 + t) * Math.cos(y * 0.008 + t * 0.7) * 30;
          const dx = mx - x;
          const dy = my - y;
          const dist = Math.hypot(dx, dy);
          const ripple = dist < 180 ? Math.cos(dist * 0.025 - t * 4) * (180 - dist) / 180 * 25 : 0;

          const z = wave + ripple;
          const sx = x + z * 0.15;
          const sy = y + z * 0.12;

          const distNorm = dist / Math.max(W, H);
          const bright = 0.25 + 0.35 * (1 - distNorm);
          const alpha = 0.2 + 0.5 * Math.max(0, Math.sin(x * 0.005 + y * 0.005 + t) * 0.5 + 0.5);

          const h = 200 + Math.sin(x * 0.003 + y * 0.003 + t * 0.5) * 30;

          ctx!.beginPath();
          ctx!.arc(sx, sy, 1.5 + z * 0.02, 0, Math.PI * 2);
          ctx!.fillStyle = `hsla(${h}, 70%, ${55 + z * 0.3}%, ${alpha * bright})`;
          ctx!.fill();
        }
      }

      rafRef.current = requestAnimationFrame(animate);
    }

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouse);
      window.removeEventListener("mouseleave", handleLeave);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ position: "fixed", inset: 0, zIndex: 0 }}
    />
  );
}
