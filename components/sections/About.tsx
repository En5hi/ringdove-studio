"use client";

import type { SectionCopy } from "../../lib/i18n";

type AboutProps = {
  copy: SectionCopy;
};

export function About({ copy }: AboutProps) {
  return (
    <div className="mx-auto flex max-w-4xl flex-col items-start gap-6 text-left">
      <h2 className="font-display text-4xl uppercase tracking-[0.12em]">{copy.heading}</h2>
      <div className="space-y-4 text-2xl leading-relaxed text-white/85">
        <p>
          We're a design-led digital studio that transforms bold ideas into exceptional experiences. Our designer-first approach pairs visual exploration with resilient engineering—shipping fast, iterating with intent, and obsessing over the details that make interfaces feel alive.
        </p>
        <p>
          From interactive brand stories to audio software design, we specialize in work that doesn't just look brilliant, but works brilliantly.
        </p>
      </div>
    </div>
  );
}
