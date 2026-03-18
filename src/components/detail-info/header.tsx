"use client";

import type { CSSProperties } from "react";
import type { AreaDetails } from "@/app/api/types";
import { getStageColor } from "@/constants/stageMeta";

type Props = {
  overview: AreaDetails["overview"];
  onClose: () => void;
};

export default function Header({ overview, onClose }: Props) {
  const startLine = `${overview.startDate[0]}.${overview.startDate[1]}.${overview.startDate[2]}`;
  const stageColor = getStageColor(overview.currentStatus.name);
  const stageDotStyle = { "--stage-color": stageColor } as CSSProperties;

  return (
    <div className="flex items-center justify-between p-5 pb-3 max-md:pt-4 max-md:pb-4">
      <div className="flex items-center gap-3 max-md:items-start max-md:gap-2">
        <button
          onClick={onClose}
          className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/20 bg-white/10 hover:bg-indigo-500/22"
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
          <div
            style={stageDotStyle}
            className="h-7 w-7 rounded-full ring-2 max-md:hidden
                       [background-color:color-mix(in_srgb,var(--stage-color)_38%,transparent)]
                       [--tw-ring-color:color-mix(in_srgb,var(--stage-color)_72%,white_28%)]"
          />
          <div>
            <div className="text-lg font-semibold">{overview.name}</div>
            <div className="text-xs text-indigo-100/78 md:hidden">
              {startLine} · {overview.habitatType} · {overview.avgDepth}m · 면적{" "}
              {overview.areaSize} m<sup>2</sup>
            </div>
            <div className="text-xs text-indigo-100/78 hidden md:block">
              복원 시작일 {startLine} · {overview.habitatType} ·{" "}
              {overview.avgDepth}m · 면적 {overview.areaSize} m<sup>2</sup>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 max-md:hidden">
        <button
          onClick={onClose}
          className="rounded-md border border-white/20 bg-white/10 px-3 py-1.5 text-sm hover:bg-indigo-500/22"
        >
          닫기
        </button>
      </div>
    </div>
  );
}
