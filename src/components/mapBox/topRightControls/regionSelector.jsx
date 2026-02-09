"use client";

import { REGIONS } from "@/constants/regions";

export default function RegionSelector({ activeId, onSelect }) {
  return (
    <div className="flex gap-2 overflow-x-auto pr-1 max-w-[55%]">
      {REGIONS.map((r) => {
        const active = activeId === r.id;
        return (
          <button
            key={r.id}
            onClick={() => onSelect(r)}
            className={`h-9 px-4 rounded-xl border text-sm font-semibold whitespace-nowrap transition
              ${
                active
                  ? "border-cyan-400/60 bg-cyan-400/20 shadow-[inset_0_0_0_2px_rgba(34,211,238,0.25)]"
                  : "border-white/10 bg-white/10 hover:bg-white/15"
              }`}
          >
            {r.label}
          </button>
        );
      })}
    </div>
  );
}
