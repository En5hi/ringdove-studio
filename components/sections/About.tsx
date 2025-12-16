"use client";

import type { SectionCopy } from "../../lib/i18n";

type AboutProps = {
  copy: SectionCopy;
};

export function About({ copy }: AboutProps) {
  return (
    <div className="mx-auto flex max-w-3xl flex-col items-start gap-6 text-left">
      <h2 className="font-display text-4xl uppercase tracking-[0.12em]">{copy.heading}</h2>
      <p className="text-lg text-white/80">{copy.body}</p>
      {copy.highlights && (
        <div className="grid w-full gap-3 sm:grid-cols-3">
          {copy.highlights.map((item) => (
            <div
              key={item}
              className="border border-white/20 bg-black/60 px-4 py-3 text-sm uppercase tracking-wide text-white/80"
            >
              {item}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
