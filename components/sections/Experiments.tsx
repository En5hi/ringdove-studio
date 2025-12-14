"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { Experiment, SiteContent } from "../../lib/i18n";

type ExperimentsProps = {
  copy: SiteContent["sections"]["experiments"];
  experiments: Experiment[];
};

const placeholderImg =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjIwIiBoZWlnaHQ9IjE0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjIwIiBoZWlnaHQ9IjE0MCIgcng9IjIwIiBmaWxsPSIjMTIxNzE5Ii8+PGNpcmNsZSBjeD0iNTAiIGN5PSI0MCIgcj0iMjAiIGZpbGw9IiMyMDI4MmYiIGZpbGwtb3BhY2l0eT0iMC43Ii8+PHRleHQgeD0iMTA1IiB5PSI3NSIgc3R5bGU9ImZpbGw6I2ZmZjsgZm9udC1zaXplOjE0cHg7IGZvbnQtZmFtaWx5Ok1vbmFyc3BhY2U7IGxldHRlci1zcGFjaW5nOjEuNXB4OyI+RXhwZXI8L3RleHQ+PC9zdmc+";

export function Experiments({ copy, experiments }: ExperimentsProps) {
  return (
    <motion.section
      id="experiments"
      className="rounded-3xl border border-border bg-white/5 p-8 backdrop-blur-xl sm:p-10"
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="flex flex-col gap-6">
        <div>
          <h2 className="font-display text-3xl sm:text-4xl">{copy.heading}</h2>
          <p className="text-muted">{copy.intro}</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {experiments.map((experiment, idx) => (
            <motion.article
              key={experiment.title}
              className="group overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition hover:border-white/30"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: idx * 0.04 }}
            >
              <div className="relative h-40 w-full overflow-hidden">
                <Image
                  src={experiment.image || placeholderImg}
                  alt={experiment.title}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover opacity-80 transition duration-700 group-hover:scale-105 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>
              <div className="flex flex-col gap-3 p-5">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-xl">{experiment.title}</h3>
                  <span className="text-xs text-muted">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                </div>
                <p className="text-sm text-muted">{experiment.description}</p>
                <div className="flex flex-wrap gap-2">
                  {experiment.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-wide text-white/80"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <a
                  href={experiment.link}
                  className="text-sm text-accent underline-offset-4 transition hover:text-white hover:underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  View detail →
                </a>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
