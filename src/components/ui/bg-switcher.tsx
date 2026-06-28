"use client";
import React, { useState, useRef, useEffect } from "react";
import { backgrounds, type BackgroundId, useBackground } from "@/lib/backgrounds";

export function BgSwitcher() {
  const { currentBg, setBg } = useBackground();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSelect = (id: BackgroundId) => {
    setBg(id);
    setOpen(false);
  };

  return (
    <div className="bg-switcher" ref={ref}>
      <button
        className="bg-switcher__trigger"
        onClick={() => setOpen((v) => !v)}
        aria-label="Switch background"
        aria-expanded={open}
        type="button"
      >
        <span className="bg-switcher__icon" aria-hidden="true">
          ◇
        </span>
      </button>

      {open && (
        <div className="bg-switcher__dropdown">
          {backgrounds.map((bg) => (
            <button
              key={bg.id}
              className={`bg-switcher__option${bg.id === currentBg ? " bg-switcher__option--active" : ""}`}
              onClick={() => handleSelect(bg.id)}
              type="button"
            >
              <span className="bg-switcher__option-icon">{bg.icon}</span>
              <div className="bg-switcher__option-text">
                <span className="bg-switcher__option-name">{bg.name}</span>
                <span className="bg-switcher__option-desc">{bg.description}</span>
              </div>
              {bg.id === currentBg && <span className="bg-switcher__check">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
