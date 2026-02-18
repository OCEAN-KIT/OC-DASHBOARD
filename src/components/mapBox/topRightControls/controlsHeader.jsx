"use client";

import { ChevronsUpDown, RotateCcw } from "lucide-react";

export default function ControlsHeader({ open, setOpen, resetView }) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <div>
        <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--ds-muted)]">
          Controls
        </div>
        <div className="text-sm font-semibold tracking-tight">해역 컨트롤</div>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={resetView}
          className="inline-flex items-center gap-1 rounded-lg border border-slate-700/70
                     bg-slate-900/70 px-2.5 py-1.5 text-xs text-slate-100
                     hover:border-emerald-400/40 hover:bg-slate-900"
        >
          <RotateCcw size={13} />
          초기뷰
        </button>
        <button
          onClick={() => setOpen((s) => !s)}
          className="inline-flex items-center gap-1 rounded-lg border border-slate-700/70
                     bg-slate-900/70 px-2.5 py-1.5 text-xs text-slate-100
                     hover:border-emerald-400/40 hover:bg-slate-900"
        >
          <ChevronsUpDown size={13} />
          {open ? "접기" : "펼치기"}
        </button>
      </div>
    </div>
  );
}
