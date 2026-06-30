"use client";
import React, { useRef, useEffect, useCallback } from "react";
import gsap from "gsap";

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  pulse: number;
  pulseSpeed: number;
}

interface Edge {
  from: Node;
  to: Node;
  opacity: number;
  proximity: number;
}

export function NeuralBackground({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef = useRef<Node[]>([]);
  const edgesRef = useRef<Edge[]>([]);
  const animationRef = useRef<number>(0);
  const mouseRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2, speed: 0 });
  const lastMouseRef = useRef({ x: mouseRef.current.x, y: mouseRef.current.y, time: performance.now() });
  const smoothedMouseRef = useRef({ x: mouseRef.current.x, y: mouseRef.current.y });
  const gradientRef = useRef<{ angle: number; color1: string; color2: string; color3: string }>({
    angle: 135,
    color1: "#0a0a0a",
    color2: "#111318",
    color3: "#0a0a0a",
  });

  const colors = [
    "rgba(255, 166, 71, 0.6)",   // Warm orange
    "rgba(0, 212, 255, 0.6)",    // Cyan
    "rgba(138, 43, 226, 0.5)",   // Purple
    "rgba(255, 255, 255, 0.4)",  // White
    "rgba(0, 255, 136, 0.4)",    // Mint
  ];

  const gradientColors = {
    primary: ["#0a0a0a", "#111318", "#0d1117", "#161b22"],
    accent: ["#0a1628", "#1a1a2e", "#16213e", "#0f3460"],
  };

  const createNodes = useCallback((width: number, height: number) => {
    const nodeCount = Math.min(Math.floor((width * height) / 15000), 60);
    nodesRef.current = Array.from({ length: nodeCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      radius: Math.random() * 2 + 1,
      color: colors[Math.floor(Math.random() * colors.length)],
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: Math.random() * 0.02 + 0.01,
    }));
  }, []);

  const applyMouseInfluence = useCallback(() => {
    const { x: mx, y: my, speed } = mouseRef.current;
    const influenceRadius = 200 + speed * 80;

    nodesRef.current.forEach((node) => {
      const dx = mx - node.x;
      const dy = my - node.y;
      const dist = Math.hypot(dx, dy);

      if (dist < influenceRadius) {
        const force = ((influenceRadius - dist) / influenceRadius) * (0.08 + speed * 0.04);
        const angle = Math.atan2(dy, dx);

        node.vx -= Math.cos(angle) * force;
        node.vy -= Math.sin(angle) * force;
      }
    });
  }, []);

  const draw = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const { angle, color1, color2, color3 } = gradientRef.current;
    const rad = (angle * Math.PI) / 180;
    const x1 = width / 2 - Math.cos(rad) * width;
    const y1 = height / 2 - Math.sin(rad) * height;
    const x2 = width / 2 + Math.cos(rad) * width;
    const y2 = height / 2 + Math.sin(rad) * height;

    const bgGradient = ctx.createLinearGradient(x1, y1, x2, y2);
    bgGradient.addColorStop(0, color1);
    bgGradient.addColorStop(0.4, color2);
    bgGradient.addColorStop(0.7, color3);
    bgGradient.addColorStop(1, color1);

    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);

    applyMouseInfluence();

    nodesRef.current.forEach((node) => {
      const maxSpeed = 1.2 + mouseRef.current.speed * 0.5;
      const speed = Math.hypot(node.vx, node.vy);
      if (speed > maxSpeed) {
        node.vx = (node.vx / speed) * maxSpeed;
        node.vy = (node.vy / speed) * maxSpeed;
      }

      node.vx *= 0.98;
      node.vy *= 0.98;

      node.x += node.vx;
      node.y += node.vy;

      if (node.x < 0 || node.x > width) {
        node.vx *= -0.8;
        node.x = Math.max(0, Math.min(width, node.x));
      }
      if (node.y < 0 || node.y > height) {
        node.vy *= -0.8;
        node.y = Math.max(0, Math.min(height, node.y));
      }

      node.pulse += node.pulseSpeed;

      const pulseFactor = 0.5 + Math.sin(node.pulse) * 0.5;
      const speedBoost = 1 + mouseRef.current.speed * 0.3;
      const currentRadius = node.radius * (1 + pulseFactor * 0.3) * speedBoost;

      const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, currentRadius * 4);
      const intensityBoost = 1 + mouseRef.current.speed * 0.5;
      gradient.addColorStop(0, node.color.replace(/[\d.]+\)$/, (m) => `${parseFloat(m) * intensityBoost})`));
      gradient.addColorStop(1, "transparent");

      ctx.beginPath();
      ctx.arc(node.x, node.y, currentRadius, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
    });

    edgesRef.current = [];
    nodesRef.current.forEach((node, i) => {
      nodesRef.current.slice(i + 1).forEach((other) => {
        const dx = node.x - other.x;
        const dy = node.y - other.y;
        const dist = Math.hypot(dx, dy);
        const maxDist = 150 + mouseRef.current.speed * 30;

        if (dist < maxDist) {
          const proximity = 1 - dist / maxDist;
          const opacity = proximity * 0.5;
          edgesRef.current.push({ from: node, to: other, opacity, proximity });
        }
      });
    });

    edgesRef.current.forEach((edge) => {
      const mouseDist = Math.min(
        Math.hypot(mouseRef.current.x - edge.from.x, mouseRef.current.y - edge.from.y),
        Math.hypot(mouseRef.current.x - edge.to.x, mouseRef.current.y - edge.to.y)
      );
      const mouseInfluence = mouseDist < 150 ? 1 - mouseDist / 150 : 0;
      const boostedOpacity = edge.opacity * (1 + mouseInfluence * 0.8 + mouseRef.current.speed * 0.3);

      const gradient = ctx.createLinearGradient(edge.from.x, edge.from.y, edge.to.x, edge.to.y);
      const opacity1 = Math.min(boostedOpacity, 1);
      const opacity2 = Math.min(boostedOpacity * edge.proximity, 1);
      gradient.addColorStop(0, `rgba(255, 255, 255, ${opacity1})`);
      gradient.addColorStop(1, `rgba(255, 255, 255, ${opacity2})`);

      ctx.beginPath();
      ctx.moveTo(edge.from.x, edge.from.y);
      ctx.lineTo(edge.to.x, edge.to.y);
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 0.5 + edge.proximity * mouseInfluence * 1.5;
      ctx.stroke();
    });
  }, [applyMouseInfluence]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
      createNodes(window.innerWidth, window.innerHeight);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const now = performance.now();
      const prevX = lastMouseRef.current.x;
      const prevY = lastMouseRef.current.y;
      const prevTime = lastMouseRef.current.time || now;
      const dt = Math.max(now - prevTime, 16);

      const dx = e.clientX - prevX;
      const dy = e.clientY - prevY;
      mouseRef.current.speed = Math.min(Math.hypot(dx, dy) / dt * 2, 2);

      lastMouseRef.current = { x: e.clientX, y: e.clientY, time: now };
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };

    const handleMouseLeave = () => {
      gsap.to(mouseRef.current, {
        speed: 0,
        duration: 0.8,
        ease: "power2.out",
      });
    };

    const gsapGradient = gsap.to(gradientRef.current, {
      angle: 315,
      color1: "#0d1117",
      color2: "#161b22",
      color3: "#1a1a2e",
      duration: 8,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
    });

    const gsapColorShift = gsap.to(gradientRef.current, {
      color2: "#1e3a5f",
      color3: "#16213e",
      duration: 12,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
      delay: 2,
    });

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    const animate = () => {
      smoothedMouseRef.current.x += (mouseRef.current.x - smoothedMouseRef.current.x) * 0.08;
      smoothedMouseRef.current.y += (mouseRef.current.y - smoothedMouseRef.current.y) * 0.08;

      mouseRef.current.x = smoothedMouseRef.current.x;
      mouseRef.current.y = smoothedMouseRef.current.y;

      draw(ctx, window.innerWidth, window.innerHeight);
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      gsapGradient.kill();
      gsapColorShift.kill();
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationRef.current);
    };
  }, [createNodes, draw]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
      }}
    />
  );
}
