"use client";

import type { AreaDetails } from "@/app/api/types";

type Props = {
  overview: AreaDetails["overview"];
  onClose: () => void;
};

export default function Header({ overview, onClose }: Props) {
  return (
    <div className="flex items-center justify-between p-5 pb-3">
      <div className="flex items-center gap-3">
        <div className="h-7 w-7 rounded-full bg-emerald-400/30 ring-2 ring-emerald-300/60" />
        <div>
          <div className="text-lg font-semibold">{overview.name}</div>
          <div className="text-xs text-white/70">
            복원 시작일 {overview.startDate[0]}-{overview.startDate[1]}-
            {overview.startDate[2]} · {overview.habitatType} ·{" "}
            {overview.avgDepth}m · 면적 {overview.areaSize} m<sup>2</sup>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onClose}
          className="rounded-md px-3 py-1.5 text-sm bg-white/10 hover:bg-white/15"
        >
          닫기
        </button>
      </div>
    </div>
  );
}
