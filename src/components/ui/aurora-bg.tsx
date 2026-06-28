"use client";
import React, { useRef, useEffect } from "react";

export function AuroraBg({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W: number, H: number;

    function resize() {
      const dpr = window.devicePixelRatio || 1;
      W = window.innerWidth;
      H = window.innerHeight;
      canvas!.width = W * dpr;
      canvas!.height = H * dpr;
      canvas!.style.width = W + "px";
      canvas!.style.height = H + "px";
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    resize();
    window.addEventListener("resize", resize);

    const handleMouse = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX / W;
      mouseRef.current.y = e.clientY / H;
    };
    const handleLeave = () => {
      mouseRef.current.x = 0.5;
      mouseRef.current.y = 0.5;
    };
    window.addEventListener("mousemove", handleMouse);
    window.addEventListener("mouseleave", handleLeave);

    function smoothNoise(x: number, y: number, t: number): number {
      const v = Math.sin(x * 2.0 + t * 0.4) * Math.cos(y * 1.8 + t * 0.3)
        + Math.sin(x * 1.3 - y * 0.7 + t * 0.5) * 0.6
        + Math.sin(x * 0.5 + y * 1.1 + t * 0.2) * 0.4;
      return v / 2;
    }

    function animate(ts: number) {
      const t = ts * 0.0003;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      ctx!.clearRect(0, 0, W, H);

      const layers = [
        { h: 260, s: 70, l: 35, speed: 0.4, amp: 0.12 },
        { h: 300, s: 60, l: 25, speed: 0.6, amp: 0.10 },
        { h: 220, s: 50, l: 20, speed: 0.3, amp: 0.15 },
      ];

      for (const layer of layers) {
        const grad = ctx!.createRadialGradient(
          W * (0.5 + (mx - 0.5) * 0.3),
          H * (0.5 + (my - 0.5) * 0.3),
          0,
          W * 0.5,
          H * 0.5,
          Math.max(W, H) * 0.8,
        );

        for (let i = 0; i <= 10; i++) {
          const p = i / 10;
          const angle = p * Math.PI * 4 + t * layer.speed;
          const nx = Math.cos(angle) * layer.amp + mx * 0.2;
          const ny = Math.sin(angle) * layer.amp + my * 0.2;
          const n = smoothNoise(nx + p * 2, ny + p, t);
          const alpha = 0.08 + 0.12 * (1 + n) * (1 - p * 0.5);
          const shift = n * 15;
          grad.addColorStop(p, `hsla(${layer.h + shift}, ${layer.s}%, ${layer.l + p * 10}%, ${alpha})`);
        }

        ctx!.fillStyle = grad;
        ctx!.fillRect(0, 0, W, H);
      }

      const gx = 0.5 + (mx - 0.5) * 0.4;
      const gy = 0.5 + (my - 0.5) * 0.4;
      const glow = ctx!.createRadialGradient(W * gx, H * gy, 0, W * gx, H * gy, Math.max(W, H) * 0.4);
      glow.addColorStop(0, "rgba(180, 140, 255, 0.06)");
      glow.addColorStop(0.5, "rgba(140, 180, 255, 0.03)");
      glow.addColorStop(1, "transparent");
      ctx!.fillStyle = glow;
      ctx!.fillRect(0, 0, W, H);

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
