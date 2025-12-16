"use client";

export function Footer() {
  return (
    <footer className="relative w-full bg-[#000000] px-5 py-14 text-sm text-white/70 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-3 tracking-[0.18em]">
            <div className="text-5xl font-medium" style={{ fontFamily: "var(--font-logo)", fontWeight: 500 }}>
              Ringdove
            </div>
            <div className="text-[11px] text-white/40">Experimental design shapes the future</div>
            <div className="text-[10px] text-white/30">© Ringdove 2025</div>
          </div>
          <button className="group flex items-center gap-3 transition-all">
            <img src="/ringdove-audio-logo.svg" alt="" className="h-10 w-10 opacity-40 transition-opacity group-hover:opacity-100" />
            <span className="text-3xl font-medium text-white/40 transition-colors group-hover:text-white" style={{ fontFamily: "var(--font-logo)", fontWeight: 500 }}>
              Ringdove Audio
            </span>
            <svg
              className="h-8 w-8 text-white/40 transition-colors group-hover:text-white ml-1"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            >
              <path d="M5 12h14m0 0l-7-7m7 7l-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </footer>
  );
}
