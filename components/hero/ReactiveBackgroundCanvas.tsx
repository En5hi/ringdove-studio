"use client";

import { useEffect, useRef } from "react";

type Blob = {
  x: number;
  y: number;
  radius: number;
  hue: number;
  drift: number;
};

const createBlob = (w: number, h: number, index: number): Blob => ({
  x: Math.random() * w,
  y: Math.random() * h,
  radius: Math.max(w, h) * 0.35 + index * 10,
  hue: 160 + Math.random() * 60,
  drift: 0.5 + Math.random() * 0.5
});

export function ReactiveBackgroundCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const blobs: Blob[] = [];
    let raf: number;
    let last = 0;
    let pointer = { x: 0.5, y: 0.5, strength: 0 };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
      blobs.length = 0;
      for (let i = 0; i < 4; i++) {
        blobs.push(createBlob(rect.width, rect.height, i));
      }
    };

    resize();

    const handlePointer = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer = {
        x: (event.clientX - rect.left) / rect.width,
        y: (event.clientY - rect.top) / rect.height,
        strength: 1
      };
    };

    const decayPointer = () => {
      pointer.strength = Math.max(0, pointer.strength - 0.01);
    };

    const draw = (timestamp: number) => {
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      ctx.clearRect(0, 0, w, h);

      const delta = (timestamp - last) / 1000;
      last = timestamp;

      blobs.forEach((blob, i) => {
        const speed = prefersReduced.matches ? 0.02 : 0.06;
        blob.x += Math.cos(timestamp * 0.0003 + i) * blob.drift * speed * w * delta;
        blob.y += Math.sin(timestamp * 0.0004 + i) * blob.drift * speed * h * delta;

        if (blob.x < -blob.radius) blob.x = w + blob.radius;
        if (blob.x > w + blob.radius) blob.x = -blob.radius;
        if (blob.y < -blob.radius) blob.y = h + blob.radius;
        if (blob.y > h + blob.radius) blob.y = -blob.radius;

        const gradient = ctx.createRadialGradient(
          blob.x,
          blob.y,
          blob.radius * 0.25,
          blob.x,
          blob.y,
          blob.radius
        );
        gradient.addColorStop(0, `hsla(${blob.hue}, 95%, 65%, 0.5)`);
        gradient.addColorStop(1, `hsla(${blob.hue + 40}, 80%, 50%, 0)`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(blob.x, blob.y, blob.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      if (pointer.strength > 0.001) {
        const px = pointer.x * w;
        const py = pointer.y * h;
        const focusRadius = Math.min(w, h) * 0.35;
        const lens = ctx.createRadialGradient(px, py, focusRadius * 0.1, px, py, focusRadius);
        lens.addColorStop(0, "rgba(255,255,255,0.22)");
        lens.addColorStop(1, "rgba(255,255,255,0)");
        ctx.globalCompositeOperation = "screen";
        ctx.fillStyle = lens;
        ctx.beginPath();
        ctx.arc(px, py, focusRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalCompositeOperation = "source-over";
        decayPointer();
      }

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);

    const throttledPointer = (event: PointerEvent) => {
      if (prefersReduced.matches) return;
      handlePointer(event);
    };

    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
      } else {
        last = performance.now();
        raf = requestAnimationFrame(draw);
      }
    };

    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", throttledPointer, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", throttledPointer);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />;
}
