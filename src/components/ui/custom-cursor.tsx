"use client";

import React, { useEffect, useState } from "react";

export function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [trailingPos, setTrailingPos] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isPointerFine, setIsPointerFine] = useState(false);

  useEffect(() => {
    // Only enable on desktop with fine mouse pointer
    const mediaQuery = window.matchMedia("(pointer: fine) and (hover: hover)");
    if (!mediaQuery.matches) return;
    setIsPointerFine(true);

    const onMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);

      // Check if hovering an interactive element
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.closest("a") ||
          target.closest("button") ||
          target.closest("input") ||
          target.closest("select") ||
          target.closest("textarea") ||
          target.closest("[role='button']") ||
          target.closest(".interactive-hover"))
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseenter", onMouseEnter);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
    };
  }, [isVisible]);

  // Smooth trailing spring effect
  useEffect(() => {
    if (!isPointerFine) return;
    let animationFrameId: number;

    const followMouse = () => {
      setTrailingPos((prev) => ({
        x: prev.x + (position.x - prev.x) * 0.22,
        y: prev.y + (position.y - prev.y) * 0.22,
      }));
      animationFrameId = requestAnimationFrame(followMouse);
    };

    animationFrameId = requestAnimationFrame(followMouse);
    return () => cancelAnimationFrame(animationFrameId);
  }, [position, isPointerFine]);

  if (!isPointerFine || !isVisible) return null;

  return (
    <>
      {/* Central Sharp Dot */}
      <div
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-fest-sunset pointer-events-none z-[9999] transition-transform duration-75 transform -translate-x-1/2 -translate-y-1/2 shadow-[0_0_8px_rgba(232,117,69,0.8)]"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: `translate(-50%, -50%) scale(${isHovered ? 0.5 : 1})`,
        }}
      />

      {/* Trailing Soft Glowing Ring */}
      <div
        className={`fixed top-0 left-0 rounded-full pointer-events-none z-[9998] transition-[width,height,border-color,background-color] duration-200 ease-out transform -translate-x-1/2 -translate-y-1/2 ${
          isHovered
            ? "w-12 h-12 border-2 border-fest-gold bg-fest-sunset/15 backdrop-blur-[1px] shadow-[0_0_20px_rgba(212,173,99,0.4)]"
            : "w-8 h-8 border border-fest-sunset/60 bg-transparent"
        }`}
        style={{
          left: `${trailingPos.x}px`,
          top: `${trailingPos.y}px`,
          transform: "translate(-50%, -50%)",
        }}
      />
    </>
  );
}
