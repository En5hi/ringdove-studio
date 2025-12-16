"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    UnicornStudio?: {
      init?: () => void;
      destroy?: () => void;
    };
  }
}

const BG_VERSION = process.env.NEXT_PUBLIC_UNICORN_BG_VERSION ?? "2025-12-15";

export function UnicornBackground() {
  const projectSrc = `/unicorn/flow_gradient.bg.json${BG_VERSION ? `?v=${BG_VERSION}` : ""}`;
  const containerRef = useRef<HTMLDivElement>(null);
  const initAttempted = useRef(false);

  useEffect(() => {
    if (initAttempted.current) return;

    const initBackground = () => {
      try {
        if (window.UnicornStudio?.init) {
          window.UnicornStudio.init();
          initAttempted.current = true;
        } else {
          // SDK not ready yet, try again in 100ms
          setTimeout(initBackground, 100);
        }
      } catch (error) {
        console.error("[unicorn] Background init failed", error);
      }
    };

    // Small delay to ensure DOM is ready
    const timer = setTimeout(initBackground, 50);

    return () => {
      clearTimeout(timer);
      initAttempted.current = false;
    };
  }, []);

  return (
    <div className="absolute inset-0 -z-10 pointer-events-none" ref={containerRef}>
      <div
        className="h-full w-full"
        data-us-project-src={projectSrc}
        data-us-fps="60"
        data-us-dpi="1.5"
        data-us-scale="1"
        data-us-lazyload="true"
        data-us-production="true"
        data-us-alttext="Decorative background animation"
        data-us-arialabel="Decorative background animation"
      />
    </div>
  );
}
