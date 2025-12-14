"use client";

import { motion } from "framer-motion";
import type { SectionCopy } from "../../lib/i18n";

type AboutProps = {
  copy: SectionCopy;
};

export function About({ copy }: AboutProps) {
  return (
    <motion.section
      id="about"
      className="rounded-3xl border border-border bg-white/5 p-8 backdrop-blur-xl sm:p-10"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="flex flex-col gap-6">
        <h2 className="font-display text-3xl sm:text-4xl">{copy.heading}</h2>
        <p className="max-w-3xl text-lg text-muted">{copy.body}</p>
        {copy.highlights && (
          <div className="grid gap-3 sm:grid-cols-3">
            {copy.highlights.map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/90"
              >
                {item}
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.section>
  );
}
