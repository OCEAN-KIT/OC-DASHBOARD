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
                  ? "border-indigo-200/70 bg-indigo-500/32 text-indigo-50 shadow-[inset_0_0_0_1px_rgba(199,210,254,0.5)]"
                  : "border-white/20 bg-white/10 text-slate-100 hover:border-indigo-300/65 hover:bg-indigo-500/20"
              }`}
          >
            {r.label}
          </button>
        );
      })}
    </div>
  );
}
