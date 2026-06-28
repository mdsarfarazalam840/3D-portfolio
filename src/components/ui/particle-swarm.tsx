"use client";
import React, { useRef, useEffect } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  hue: number;
}

export function ParticleSwarm({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const particlesRef = useRef<Particle[]>([]);
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

    function initParticles() {
      const count = Math.min(Math.floor((W * H) / 12000), 130);
      particlesRef.current = Array.from({ length: count }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 2.5 + 1,
        alpha: Math.random() * 0.5 + 0.2,
        hue: Math.random() * 60 + 180,
      }));
    }

    resize();
    initParticles();

    window.addEventListener("resize", () => {
      resize();
      initParticles();
    });

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

    function animate() {
      ctx!.clearRect(0, 0, W, H);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      for (const p of particlesRef.current) {
        const dx = mx - p.x;
        const dy = my - p.y;
        const dist = Math.hypot(dx, dy);

        if (dist < 250) {
          const force = (250 - dist) / 250 * 0.06;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }

        const maxV = 2;
        const spd = Math.hypot(p.vx, p.vy);
        if (spd > maxV) {
          p.vx = (p.vx / spd) * maxV;
          p.vy = (p.vy / spd) * maxV;
        }

        p.vx *= 0.99;
        p.vy *= 0.99;

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < -10) p.x = W + 10;
        if (p.x > W + 10) p.x = -10;
        if (p.y < -10) p.y = H + 10;
        if (p.y > H + 10) p.y = -10;

        const pulse = 0.7 + Math.sin(p.x * 0.003 + p.y * 0.003 + Date.now() * 0.001) * 0.3;
        const r = p.size * pulse;

        ctx!.beginPath();
        ctx!.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx!.fillStyle = `hsla(${p.hue}, 80%, 65%, ${p.alpha * pulse})`;
        ctx!.fill();

        ctx!.beginPath();
        ctx!.arc(p.x, p.y, r * 3, 0, Math.PI * 2);
        ctx!.fillStyle = `hsla(${p.hue}, 80%, 65%, ${p.alpha * 0.15 * pulse})`;
        ctx!.fill();
      }

      rafRef.current = requestAnimationFrame(animate);
    }

    animate();

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
