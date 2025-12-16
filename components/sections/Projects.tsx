"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "../../lib/utils";
import type { SiteContent } from "../../lib/i18n";

export type ProjectsProps = {
  copy: SiteContent["sections"]["projects"];
};

const projectImages = [
  "data:image/svg+xml,%3Csvg width='1600' height='900' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3ClinearGradient id='p1' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23667eea;stop-opacity:1'/%3E%3Cstop offset='100%25' style='stop-color:%23764ba2;stop-opacity:1'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='1600' height='900' fill='url(%23p1)'/%3E%3C/svg%3E",
  "data:image/svg+xml,%3Csvg width='1600' height='900' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3ClinearGradient id='p2' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23f093fb;stop-opacity:1'/%3E%3Cstop offset='100%25' style='stop-color:%234facfe;stop-opacity:1'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='1600' height='900' fill='url(%23p2)'/%3E%3C/svg%3E",
  "data:image/svg+xml,%3Csvg width='1600' height='900' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3ClinearGradient id='p3' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23fa709a;stop-opacity:1'/%3E%3Cstop offset='100%25' style='stop-color:%23fee140;stop-opacity:1'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='1600' height='900' fill='url(%23p3)'/%3E%3C/svg%3E"
];

export function Projects({ copy }: ProjectsProps) {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-10 text-left">
      <div className="space-y-2">
        <h2 className="font-display text-4xl uppercase tracking-[0.12em]">{copy.heading}</h2>
        <p className="text-white/75">{copy.intro}</p>
      </div>
      <div className="flex w-full flex-col gap-14">
        {copy.items.map((item, idx) => {
          const dim = hovered !== null && hovered !== idx;
          return (
            <div
              key={item.title}
              className={cn(
                "group flex cursor-pointer items-start gap-10 transition-all duration-300",
                dim ? "blur-[1px] opacity-70 grayscale" : "opacity-100 grayscale-0"
              )}
              onClick={() => item.link && window.open(item.link, "_blank")}
              onMouseEnter={() => setHovered(idx)}
              onMouseLeave={() => setHovered(null)}
            >
              <div className="flex flex-1 flex-col justify-between" style={{ minHeight: '192px' }}>
                <div className="flex items-start justify-between gap-6">
                  <div className="flex-1 space-y-2">
                    <h3 className="font-display text-3xl uppercase tracking-[0.12em] text-white">
                      {item.title}
                    </h3>
                    <p className="text-lg text-white/70">{item.subtitle}</p>
                  </div>
                  <svg
                    className="h-7 w-7 flex-shrink-0 text-white/60 opacity-0 transition-all group-hover:opacity-100 group-hover:text-white"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                  >
                    <path d="M5 12h14m0 0l-7-7m7 7l-7 7" />
                  </svg>
                </div>
                <div className="flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.18em] text-white/40">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-white/5 px-2.5 py-1"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="relative h-48 w-80 flex-shrink-0 overflow-hidden">
                <Image
                  src={projectImages[idx % projectImages.length]}
                  alt={item.title}
                  fill
                  sizes="320px"
                  className="object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-70" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
