"use client";

import type { AreaDetails } from "@/app/api/types";

type Props = {
  overview: AreaDetails["overview"];
  onClose: () => void;
};

export default function Header({ overview, onClose }: Props) {
  const startLine = `${overview.startDate[0]}-${overview.startDate[1]}-${overview.startDate[2]}`;
  return (
    <div className="flex items-center justify-between p-5 pb-3 max-md:pt-4 max-md:pb-4">
      <div className="flex items-center gap-3 max-md:items-start max-md:gap-2">
        <button
          onClick={onClose}
          className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 hover:bg-white/15"
          aria-label="뒤로가기"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
              d="M15 6l-6 6 6 6"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <div className="flex items-center gap-3 max-md:items-start">
          <div className="h-7 w-7 rounded-full bg-emerald-400/30 ring-2 ring-emerald-300/60 max-md:hidden" />
          <div>
            <div className="text-lg font-semibold">{overview.name}</div>
            <div className="text-xs text-white/70 md:hidden">
              {startLine} · {overview.habitatType} · {overview.avgDepth}m · 면적{" "}
              {overview.areaSize} m<sup>2</sup>
            </div>
            <div className="text-xs text-white/70 hidden md:block">
              복원 시작일 {startLine} · {overview.habitatType} ·{" "}
              {overview.avgDepth}m · 면적 {overview.areaSize} m<sup>2</sup>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 max-md:hidden">
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
