"use client";

import type { SiteContent } from "../../lib/i18n";
import { Button } from "../ui/Button";

export type ProjectsProps = {
  copy: SiteContent["sections"]["projects"];
};

export function Projects({ copy }: ProjectsProps) {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 text-left">
      <div className="space-y-2">
        <h2 className="font-display text-4xl uppercase tracking-[0.12em]">{copy.heading}</h2>
        <p className="text-white/75">{copy.intro}</p>
      </div>
      <div className="flex w-full flex-col gap-5">
        {copy.items.map((item, idx) => (
          <div
            key={item.title}
            className="group overflow-hidden rounded-lg border border-white/20 bg-black/60 shadow-[0_20px_60px_rgba(0,0,0,0.25)] transition hover:border-white/35"
          >
            <div className="flex flex-col gap-4 px-6 py-6">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <h3 className="font-display text-2xl uppercase tracking-[0.12em] text-white">
                    {item.title}
                  </h3>
                  <p className="max-w-3xl text-white/70">{item.subtitle}</p>
                </div>
                <span className="text-2xl leading-none text-white">&nearr;</span>
              </div>
              <div className="flex flex-wrap gap-3 text-xs uppercase tracking-[0.2em] text-white/70">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-sm border border-white/20 bg-black/70 px-3 py-1"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.24em] text-white/40">
                <span>{String(idx + 1).padStart(2, "0")}</span>
                {item.link && (
                  <Button
                    variant="ghost"
                    className="px-0 text-xs uppercase tracking-[0.2em]"
                    onClick={() => window.open(item.link, "_blank")}
                  >
                    View
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
