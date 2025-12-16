"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "../../lib/utils";
import type { Experiment, SiteContent } from "../../lib/i18n";

type ExperimentsProps = {
  copy: SiteContent["sections"]["experiments"];
  experiments: Experiment[];
};

const placeholderImages = [
  "data:image/svg+xml,%3Csvg width='800' height='600' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3ClinearGradient id='g1' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23667eea;stop-opacity:1'/%3E%3Cstop offset='100%25' style='stop-color:%23764ba2;stop-opacity:1'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='800' height='600' fill='url(%23g1)'/%3E%3C/svg%3E",
  "data:image/svg+xml,%3Csvg width='800' height='600' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3ClinearGradient id='g2' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23f093fb;stop-opacity:1'/%3E%3Cstop offset='100%25' style='stop-color:%234facfe;stop-opacity:1'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='800' height='600' fill='url(%23g2)'/%3E%3C/svg%3E",
  "data:image/svg+xml,%3Csvg width='800' height='600' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3ClinearGradient id='g3' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23fa709a;stop-opacity:1'/%3E%3Cstop offset='100%25' style='stop-color:%23fee140;stop-opacity:1'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='800' height='600' fill='url(%23g3)'/%3E%3C/svg%3E",
  "data:image/svg+xml,%3Csvg width='800' height='600' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3ClinearGradient id='g4' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%2330cfd0;stop-opacity:1'/%3E%3Cstop offset='100%25' style='stop-color:%23330867;stop-opacity:1'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='800' height='600' fill='url(%23g4)'/%3E%3C/svg%3E"
];

export function Experiments({ copy, experiments }: ExperimentsProps) {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="mx-auto flex max-w-5xl flex-col items-start gap-6 text-left">
      <div className="space-y-2">
        <h2 className="font-display text-4xl uppercase tracking-[0.12em]">{copy.heading}</h2>
        <p className="text-white/75">{copy.intro}</p>
      </div>
      <div className="grid w-full gap-5 md:grid-cols-2">
        {experiments.map((experiment, idx) => {
          const dim = hovered !== null && hovered !== idx;
          return (
            <article
              key={experiment.title}
              className={cn(
                "group cursor-pointer overflow-hidden transition-all duration-300",
                dim ? "blur-[1px] opacity-70 grayscale" : "opacity-100 grayscale-0"
              )}
              onClick={() => experiment.link && window.open(experiment.link, "_blank")}
              onMouseEnter={() => setHovered(idx)}
              onMouseLeave={() => setHovered(null)}
            >
              <div className="relative h-56 w-full overflow-hidden">
                <Image
                  src={experiment.image || placeholderImages[idx % placeholderImages.length]}
                  alt={experiment.title}
                  fill
                  sizes="(min-width: 1024px) 360px, (min-width: 768px) 45vw, 100vw"
                  className="object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-80" />
              </div>
              <div className="flex flex-col gap-2 py-3 text-left">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <h3 className="font-display text-lg uppercase tracking-[0.18em] text-white">
                      {experiment.title}
                    </h3>
                    <p className="mt-1 line-clamp-1 text-xs uppercase tracking-[0.16em] text-white/55">
                      {experiment.description}
                    </p>
                  </div>
                  <svg
                    className="h-6 w-6 flex-shrink-0 text-white/60 transition-colors group-hover:text-white"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                  >
                    <path d="M5 12h14m0 0l-7-7m7 7l-7 7" />
                  </svg>
                </div>
                <div className="flex flex-wrap gap-1.5 text-[10px] uppercase tracking-[0.18em] text-white/40">
                  {experiment.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-white/5 px-2 py-0.5"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
