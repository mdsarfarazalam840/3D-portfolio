"use client";
import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import { backgrounds, type BackgroundId, useBackground } from "@/lib/backgrounds";

export function BgSwitcher() {
  const { currentBg, setBg } = useBackground();
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ top: 0, right: 0 });

  useEffect(() => {
    const handlePointer = (e: PointerEvent) => {
      const target = e.target as Node;
      const inWrapper = wrapperRef.current?.contains(target);
      const inDropdown = dropdownRef.current?.contains(target);
      if (!inWrapper && !inDropdown) {
        setOpen(false);
      }
    };
    document.addEventListener("pointerdown", handlePointer);
    return () => document.removeEventListener("pointerdown", handlePointer);
  }, []);

  useLayoutEffect(() => {
    if (open && triggerRef.current) {
      const r = triggerRef.current.getBoundingClientRect();
      setPos({ top: r.bottom + 8, right: window.innerWidth - r.right });
    }
  }, [open]);

  const handleSelect = (id: BackgroundId) => {
    setBg(id);
    setOpen(false);
  };

  return (
    <div className="bg-switcher" ref={wrapperRef}>
      <button
        ref={triggerRef}
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

      {open && typeof document !== "undefined" && createPortal(
        <div
          className="bg-switcher__dropdown bg-switcher__dropdown--portaled"
          ref={dropdownRef}
          style={window.innerWidth > 720 ? { top: pos.top, right: pos.right } : undefined}
        >
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
        </div>,
        document.body
      )}
    </div>
  );
}
