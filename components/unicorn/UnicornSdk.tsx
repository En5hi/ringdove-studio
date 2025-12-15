"use client";

import Script from "next/script";
import { useEffect } from "react";

declare global {
  interface Window {
    UnicornStudio?: {
      init?: () => void;
      destroy?: () => void;
    };
  }
}

const SDK_SRC =
  "https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.5.3/dist/unicornStudio.umd.js";

export function UnicornSdk() {
  useEffect(() => {
    return () => {
      try {
        window.UnicornStudio?.destroy?.();
      } catch (error) {
        console.error("[unicorn] SDK destroy failed", error);
      }
    };
  }, []);

  return (
    <Script
      src={SDK_SRC}
      strategy="afterInteractive"
      onLoad={() => {
        try {
          window.UnicornStudio?.init?.();
        } catch (error) {
          console.error("[unicorn] SDK init failed", error);
        }
      }}
      onError={(error) => {
        console.error("[unicorn] Failed to load UnicornStudio SDK", error);
      }}
    />
  );
}
