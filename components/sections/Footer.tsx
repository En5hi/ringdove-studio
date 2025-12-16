"use client";

export function Footer() {
  return (
    <footer className="relative border-t border-white/12 bg-black px-5 py-14 text-sm text-white/70 lg:px-10">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2 uppercase tracking-[0.18em] text-white/60">
          <div className="text-sm" style={{ fontFamily: "var(--font-logo)" }}>
            Ringdove
          </div>
          <div className="text-[11px]">Experimental design & technology</div>
        </div>
        <div className="text-[11px] text-white/50">
          Built for bold experiences. Based everywhere, shipping digitally.
        </div>
      </div>
    </footer>
  );
}
