"use client";

import { motion } from "framer-motion";
import { Fragment, useEffect, useState } from "react";
import { NavItem } from "../../lib/i18n";
import { cn } from "../../lib/utils";

type LeftNavProps = {
  items: NavItem[];
  activeId?: string;
};

export function LeftNav({ items, activeId }: LeftNavProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = () => setOpen(false);
    window.addEventListener("hashchange", handler);
    return () => window.removeEventListener("hashchange", handler);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    history.replaceState(null, "", `#${id}`);
  };

  return (
    <div className="lg:flex lg:h-full lg:flex-col lg:items-start lg:justify-center">
      <div className="mb-6 flex items-center justify-end lg:hidden">
        <button
          onClick={() => setOpen((o) => !o)}
          className="inline-flex items-center gap-2 border-b border-white/20 px-2 py-1 text-xs uppercase tracking-[0.18em] text-muted transition hover:text-white"
          aria-expanded={open}
        >
          Menu
          <span className="text-[10px]">{open ? "x" : "+"}</span>
        </button>
      </div>

      <div className={cn("lg:block", open ? "block" : "hidden")}>
        <motion.ul layout className="flex flex-col items-start text-white/80">
          {items.map((item, idx) => {
            const active = activeId === item.id;
            return (
              <Fragment key={item.id}>
                <motion.li layout className="w-full">
                  <motion.button
                    onClick={() => scrollTo(item.id)}
                    className={cn(
                      "group flex w-full items-center gap-4 rounded-md border border-transparent px-2 py-2.5 text-left transition-all duration-500",
                      active ? "text-white" : "text-white/55 hover:border-white/10 hover:text-white"
                    )}
                    animate={{
                      opacity: active ? 1 : 0.9
                    }}
                    transition={{ type: "spring", stiffness: 180, damping: 24, mass: 0.8 }}
                    aria-current={active ? "true" : "false"}
                  >
                    <motion.span
                      layout
                      className="bg-white/80"
                      style={{ transformOrigin: "left" }}
                      animate={{
                        width: active ? 24 : 16,
                        height: active ? 16 : 2,
                        opacity: active ? 1 : 0.7
                      }}
                      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    />
                    <span
                      className={cn(
                        "font-display uppercase tracking-[0.3em] transition-all duration-500 leading-none block",
                        active ? "text-lg font-bold" : "text-xs"
                      )}
                      style={{ lineHeight: active ? '1' : 'inherit' }}
                    >
                      {item.label}
                    </span>
                  </motion.button>
                </motion.li>
                {idx < items.length - 1 && (
                  <>
                    <li aria-hidden className="w-full pl-2 py-2.5">
                      <span className="block h-[1px] w-2 bg-white/20" />
                    </li>
                    <li aria-hidden className="w-full pl-2 py-2.5">
                      <span className="block h-[1px] w-2 bg-white/20" />
                    </li>
                  </>
                )}
              </Fragment>
            );
          })}
        </motion.ul>
      </div>
    </div>
  );
}
