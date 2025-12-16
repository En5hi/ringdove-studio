"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "../../lib/utils";
import type { Experiment, SiteContent } from "../../lib/i18n";

type ExperimentsProps = {
  copy: SiteContent["sections"]["experiments"];
  experiments: Experiment[];
};

const placeholderImg =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjIwIiBoZWlnaHQ9IjE0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjIwIiBoZWlnaHQ9IjE0MCIgcng9IjIwIiBmaWxsPSIjMTIxNzE5Ii8+PGNpcmNsZSBjeD0iNTAiIGN5PSI0MCIgcj0iMjAiIGZpbGw9IiMyMDI4MmYiIGZpbGwtb3BhY2l0eT0iMC43Ii8+PHRleHQgeD0iMTA1IiB5PSI3NSIgc3R5bGU9ImZpbGw6I2ZmZjsgZm9udC1zaXplOjE0cHg7IGZvbnQtZmFtaWx5Ok1vbmFyc3BhY2U7IGxldHRlci1zcGFjaW5nOjEuNXB4OyI+RXhwZXI8L3RleHQ+PC9zdmc+";

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
                "group overflow-hidden rounded-lg border border-white/20 bg-black/60 shadow-[0_20px_60px_rgba(0,0,0,0.25)] transition",
                dim ? "blur-sm opacity-65" : "opacity-100"
              )}
              onMouseEnter={() => setHovered(idx)}
              onMouseLeave={() => setHovered(null)}
            >
              <div className="relative h-56 w-full overflow-hidden">
                <Image
                  src={experiment.image || placeholderImg}
                  alt={experiment.title}
                  fill
                  sizes="(min-width: 1024px) 360px, (min-width: 768px) 45vw, 100vw"
                  className="object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-80" />
                <div className="absolute left-4 top-4 rounded-sm bg-black/70 px-2 py-1 text-[11px] uppercase tracking-[0.18em] text-white/80">
                  {String(idx + 1).padStart(2, "0")}
                </div>
              </div>
              <div className="flex flex-col gap-3 border-t border-white/12 px-5 py-4 text-left">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-lg uppercase tracking-[0.18em] text-white">
                    {experiment.title}
                  </h3>
                  <span className="text-2xl leading-none text-white">&nearr;</span>
                </div>
                <p className="text-xs uppercase tracking-[0.16em] text-white/55">
                  {experiment.description}
                </p>
                <div className="flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.18em] text-white/50">
                  {experiment.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-sm border border-white/20 bg-black/70 px-2 py-1"
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
