"use client";
import React, { useRef } from "react";
import { motion, useMotionValue, useMotionTemplate, useSpring } from "framer-motion";

export function AuroraBackground({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 300 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      mouseX.set(e.clientX - rect.left);
      mouseY.set(e.clientY - rect.top);
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className={className}
      style={{ position: "relative", overflow: "hidden" }}
    >
      <div className="aurora-bg" />
      <motion.div
        className="aurora-mouse-glow"
        style={{
          transform: useMotionTemplate`translate(${smoothX}px, ${smoothY}px)`,
          left: useMotionTemplate`-${smoothX}px`,
          top: useMotionTemplate`-${smoothY}px`,
        }}
      />
      {children}
    </div>
  );
}
