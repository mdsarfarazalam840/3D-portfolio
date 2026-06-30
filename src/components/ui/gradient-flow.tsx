"use client";
import React, { useRef, useEffect } from "react";

export function GradientFlow({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const rafRef = useRef<number>(0);
  const timeRef = useRef(0);

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

    function noise(x: number, y: number, t: number): number {
      const n = Math.sin(x * 1.2 + y * 0.8 + t * 0.3) * Math.cos(y * 1.1 - x * 0.7 + t * 0.4)
        + Math.sin(x * 0.6 - y * 0.9 + t * 0.5) * 0.5
        + Math.cos(x * 0.4 + y * 0.3 + t * 0.2) * 0.3;
      return n / 1.8;
    }

    function animate(ts: number) {
      timeRef.current = ts * 0.0004;

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const t = timeRef.current;

      const grad = ctx!.createRadialGradient(W * mx, H * my, 0, W * mx, H * my, Math.max(W, H) * 0.9);
      const n1 = noise(mx, my, t);
      const n2 = noise(mx + 0.3, my + 0.3, t + 1);
      const n3 = noise(mx - 0.2, my + 0.1, t + 2);

      const h1 = (220 + n1 * 40 + t * 5) % 360;
      const h2 = (280 + n2 * 50 + t * 8) % 360;
      const h3 = (190 + n3 * 30 + t * 3) % 360;

      grad.addColorStop(0, `hsla(${h1}, 60%, 15%, 1)`);
      grad.addColorStop(0.3, `hsla(${h2}, 55%, 10%, 0.9)`);
      grad.addColorStop(0.6, `hsla(${h3}, 50%, 8%, 0.8)`);
      grad.addColorStop(1, `hsla(${h1 + 30}, 40%, 5%, 1)`);

      ctx!.fillStyle = grad;
      ctx!.fillRect(0, 0, W, H);

      const grain = ctx!.createRadialGradient(W * 0.5, H * 0.5, 0, W * 0.5, H * 0.5, Math.max(W, H) * 0.6);
      grain.addColorStop(0, `hsla(${h1}, 30%, 20%, 0.03)`);
      grain.addColorStop(1, "transparent");
      ctx!.fillStyle = grain;
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
