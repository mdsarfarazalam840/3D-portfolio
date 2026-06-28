"use client";
import React, { createContext, useContext, useState, useCallback, type ReactNode } from "react";

export type BackgroundId = "neural" | "aurora" | "particle-swarm" | "wave-grid" | "gradient-flow";

export interface BackgroundDef {
  id: BackgroundId;
  name: string;
  icon: string;
  description: string;
}

export const backgrounds: BackgroundDef[] = [
  { id: "neural", name: "Neural", icon: "◆", description: "Connected nodes with mouse influence" },
  { id: "aurora", name: "Aurora", icon: "✦", description: "Smooth aurora waves with glow" },
  { id: "particle-swarm", name: "Particles", icon: "●", description: "Floating particle swarm" },
  { id: "wave-grid", name: "Wave Grid", icon: "≋", description: "Undulating grid with ripples" },
  { id: "gradient-flow", name: "Gradient", icon: "◐", description: "Flowing color gradients" },
];

interface BackgroundCtx {
  currentBg: BackgroundId;
  setBg: (id: BackgroundId) => void;
}

const BackgroundContext = createContext<BackgroundCtx>({
  currentBg: "neural",
  setBg: () => {},
});

export function BackgroundProvider({ children }: { children: ReactNode }) {
  const [currentBg, setCurrentBg] = useState<BackgroundId>("neural");

  const setBg = useCallback((id: BackgroundId) => {
    setCurrentBg(id);
  }, []);

  return (
    <BackgroundContext.Provider value={{ currentBg, setBg }}>
      {children}
    </BackgroundContext.Provider>
  );
}

export function useBackground() {
  return useContext(BackgroundContext);
}
