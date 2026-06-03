"use client";

import gsap from "gsap";
import { useEffect, useRef } from "react";

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;

    if (!cursor || window.matchMedia("(pointer: coarse)").matches) {
      return;
    }

    const setX = gsap.quickTo(cursor, "x", { duration: 0.45, ease: "power3.out" });
    const setY = gsap.quickTo(cursor, "y", { duration: 0.45, ease: "power3.out" });
    const setScale = gsap.quickTo(cursor, "scale", { duration: 0.25, ease: "power3.out" });

    const onMouseMove = (event: MouseEvent) => {
      setX(event.clientX);
      setY(event.clientY);
    };

    const onPointerOver = (event: PointerEvent) => {
      const target = event.target;

      if (
        target instanceof Element &&
        target.closest("a, button, input, textarea, select, [data-cursor='hover']")
      ) {
        setScale(1.9);
      }
    };

    const onPointerOut = (event: PointerEvent) => {
      const target = event.target;

      if (
        target instanceof Element &&
        target.closest("a, button, input, textarea, select, [data-cursor='hover']")
      ) {
        setScale(1);
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    document.addEventListener("pointerover", onPointerOver);
    document.addEventListener("pointerout", onPointerOut);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("pointerover", onPointerOver);
      document.removeEventListener("pointerout", onPointerOut);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="pointer-events-none fixed left-0 top-0 z-[100] hidden size-5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[var(--color-warm-brown)] bg-[var(--color-butter)]/70 mix-blend-multiply shadow-[0_0_24px_rgba(245,200,66,0.5)] md:block"
      aria-hidden="true"
    />
  );
}
