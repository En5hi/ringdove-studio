"use client";

import { motion } from "framer-motion";
import type { SiteContent } from "../../lib/i18n";
import { Button } from "../ui/Button";

type ProjectsProps = {
  copy: SiteContent["sections"]["projects"];
};

export function Projects({ copy }: ProjectsProps) {
  return (
    <motion.section
      id="projects"
      className="rounded-3xl border border-border bg-white/5 p-8 backdrop-blur-xl sm:p-10"
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h2 className="font-display text-3xl sm:text-4xl">{copy.heading}</h2>
          <p className="text-muted">{copy.intro}</p>
        </div>
        <div className="grid gap-4">
          {copy.items.map((item, idx) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: idx * 0.05 }}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 via-white/0 to-white/5 p-5"
            >
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="font-display text-2xl">{item.title}</h3>
                    <p className="text-muted">{item.subtitle}</p>
                  </div>
                  <div className="hidden text-xs uppercase tracking-[0.2em] text-muted sm:block">
                    {String(idx + 1).padStart(2, "0")}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-white/10 px-3 py-1 text-xs text-muted transition group-hover:border-white/30 group-hover:text-white"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                {item.link && (
                  <div>
                    <Button
                      variant="ghost"
                      className="text-sm"
                      onClick={() => window.open(item.link, "_blank")}
                    >
                      View
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
