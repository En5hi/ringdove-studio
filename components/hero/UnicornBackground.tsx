"use client";

const BG_VERSION = process.env.NEXT_PUBLIC_UNICORN_BG_VERSION ?? "2025-12-15";

export function UnicornBackground() {
  const projectSrc = `/unicorn/flow_gradient.bg.json${BG_VERSION ? `?v=${BG_VERSION}` : ""}`;

  return (
    <div className="absolute inset-0 -z-10 pointer-events-none">
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
