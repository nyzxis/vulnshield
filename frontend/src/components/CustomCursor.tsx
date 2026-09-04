import React, { useEffect, useRef, useState } from 'react';

interface CustomCursorProps {
  theme: 'cyber' | 'minimalist';
}

export default function CustomCursor({ theme }: CustomCursorProps) {
  const isMinimal = theme === 'minimalist';
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  const [visible, setVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  const mousePos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    // Suppress custom cursor on touchscreens
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (hasTouch) {
      setIsTouchDevice(true);
      return;
    }

    const onMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      if (!visible) setVisible(true);

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }

      // Check if hovering over interactive elements
      const target = e.target as HTMLElement | null;
      if (target) {
        const interactive = target.closest('button, a, input, textarea, select, [role="button"], label, .interactive-target');
        setIsHovering(Boolean(interactive));
      }
    };

    const onMouseDown = () => setIsClicking(true);
    const onMouseUp = () => setIsClicking(false);
    const onMouseLeave = () => setVisible(false);
    const onMouseEnter = () => setVisible(true);

    // Smooth physics outer ring loop
    const animate = () => {
      const lerp = 0.18;
      ringPos.current.x += (mousePos.current.x - ringPos.current.x) * lerp;
      ringPos.current.y += (mousePos.current.y - ringPos.current.y) * lerp;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0)`;
      }

      rafId.current = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    rafId.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [visible]);

  if (isTouchDevice || !visible) return null;

  return (
    <>
      {/* Precision Core Dot */}
      <div
        ref={dotRef}
        aria-hidden="true"
        className={`fixed top-0 left-0 pointer-events-none z-[9999] rounded-full will-change-transform -translate-x-1/2 -translate-y-1/2 transition-opacity duration-150 ${
          isClicking ? 'scale-75' : isHovering ? 'scale-125' : 'scale-100'
        } ${
          isMinimal ? 'w-1.5 h-1.5 bg-[#2C2924]' : 'w-1.5 h-1.5 bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]'
        }`}
      />

      {/* Trailing Outer Physics Ring */}
      <div
        ref={ringRef}
        aria-hidden="true"
        className={`fixed top-0 left-0 pointer-events-none z-[9998] rounded-full will-change-transform -translate-x-1/2 -translate-y-1/2 border transition-all duration-150 ${
          isClicking
            ? 'w-7 h-7 scale-90 opacity-90'
            : isHovering
            ? 'w-11 h-11 scale-110 opacity-90'
            : 'w-8 h-8 scale-100 opacity-60'
        } ${
          isMinimal
            ? isHovering
              ? 'border-[#2C2924] bg-[#2C2924]/10 shadow-[0_0_12px_rgba(44,41,36,0.15)]'
              : 'border-[#2C2924]/40 bg-transparent'
            : isHovering
            ? 'border-emerald-400/80 bg-emerald-500/10 shadow-[0_0_16px_rgba(16,185,129,0.35)]'
            : 'border-emerald-500/40 bg-transparent shadow-[0_0_8px_rgba(16,185,129,0.15)]'
        }`}
      />
    </>
  );
}
