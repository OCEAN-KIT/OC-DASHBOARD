"use client";

import { useState } from "react";
import Image from "next/image";
import { keyToPublicUrl } from "@/utils/s3";

type TimelineItem = {
  url: string;
  label: string;
  caption: string;
};

type Props = {
  items: TimelineItem[];
};

export default function TimelineView({ items }: Props) {
  const [activeIdx, setActiveIdx] = useState(0);
  const hasData = items.length > 0;
  const active = hasData ? items[activeIdx] : null;

  const [y, m, d] = active?.label?.split(".") ?? ["", "", ""];

  return (
    <div className="rounded-xl bg-white/5 p-4 h-full flex flex-col">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-[11px] text-white/50 -mt-3 ml-2">타임라인</h3>
        <div className="rounded-full border border-white/15 bg-white/10 px-3.5 py-1 text-[13px] font-semibold text-white/90">
          {y}년 {m}월{d ? ` ${d}일` : ""}
        </div>
      </div>

      {hasData ? (
        <div className="flex-1 min-h-0 flex flex-col gap-3">
          {/* 메인 이미지 */}
          <div className="relative w-full max-w-[520px] aspect-[4/3] mx-auto rounded-lg overflow-hidden bg-white/5">
            {active?.url ? (
              <Image
                src={keyToPublicUrl(active.url)}
                alt={active.caption}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 90vw, 520px"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[11px] text-white/30">
                사진 없음
              </div>
            )}
            {active?.caption && (
              <span className="absolute bottom-2 left-2 text-[10px] text-white/80 bg-black/50 px-2 py-0.5 rounded">
                {active.caption}
              </span>
            )}
          </div>

          {/* 타임라인 슬라이더 */}
          <div className="flex items-center gap-2">
            {/* 이전 버튼 */}
            <button
              onClick={() => setActiveIdx((p) => Math.max(0, p - 1))}
              disabled={activeIdx === 0}
              className="shrink-0 w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:bg-white/20 disabled:opacity-30 disabled:cursor-default transition"
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path
                  d="M6.5 2L3.5 5L6.5 8"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {/* 썸네일 목록 */}
            <div className="flex-1 min-w-0 overflow-x-auto flex gap-1.5 scrollbar-hide">
              {items.map((item, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIdx(i)}
                  className={[
                    "shrink-0 flex flex-col items-center gap-1 px-2 py-1 rounded-lg transition",
                    i === activeIdx
                      ? "bg-white/15"
                      : "bg-white/5 hover:bg-white/10",
                  ].join(" ")}
                >
                  <div
                    className={[
                      "relative w-10 h-7 rounded overflow-hidden bg-white/5",
                      i === activeIdx ? "ring-1 ring-white/40" : "",
                    ].join(" ")}
                  >
                    {item.url ? (
                      <Image
                        src={keyToPublicUrl(item.url)}
                        alt={item.label}
                        fill
                        className="object-cover"
                        sizes="40px"
                      />
                    ) : (
                      <div className="w-full h-full" />
                    )}
                  </div>
                  <span
                    className={[
                      "text-[9px] whitespace-nowrap",
                      i === activeIdx ? "text-white/80" : "text-white/40",
                    ].join(" ")}
                  >
                    {item.label}
                  </span>
                </button>
              ))}
            </div>

            {/* 다음 버튼 */}
            <button
              onClick={() =>
                setActiveIdx((p) => Math.min(items.length - 1, p + 1))
              }
              disabled={activeIdx === items.length - 1}
              className="shrink-0 w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:bg-white/20 disabled:opacity-30 disabled:cursor-default transition"
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path
                  d="M3.5 2L6.5 5L3.5 8"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-sm text-white/40">
          타임라인 데이터가 없습니다.
        </div>
      )}
    </div>
  );
}
