"use client";

import { REGIONS } from "@/constants/regions";

export default function RegionSelector({ activeId, onSelect }) {
  return (
    <div className="flex max-w-[58%] gap-2 overflow-x-auto pr-1">
      {REGIONS.map((r) => {
        const active = activeId === r.id;
        return (
          <button
            key={r.id}
            onClick={() => onSelect(r)}
            aria-pressed={active}
            className={`h-9 whitespace-nowrap rounded-xl border px-4 text-sm font-semibold transition
              ${
                active
                  ? "border-emerald-300/60 bg-emerald-500/20 text-emerald-100 shadow-[inset_0_0_0_1px_rgba(110,231,183,0.35)]"
                  : "border-slate-700/70 bg-slate-900/70 text-slate-100 hover:border-slate-500/70 hover:bg-slate-900"
              }`}
          >
            {r.label}
          </button>
        );
      })}
    </div>
  );
}
