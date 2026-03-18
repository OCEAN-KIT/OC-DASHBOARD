"use client";

import { useState } from "react";
import type { AreaDetails } from "@/app/api/types";
import BeforeAfterCard from "./before-after-card";
import TimelineView from "./timeline-view";

type Props = {
  data: AreaDetails;
};

const SUB_TABS = [
  { key: "before-after", label: "복원 전/후" },
  { key: "timeline", label: "타임라인" },
] as const;

type SubTabKey = (typeof SUB_TABS)[number]["key"];

export default function PhotosTab({ data }: Props) {
  const { photos } = data;
  const [subTab, setSubTab] = useState<SubTabKey>("before-after");

  return (
    <section className="space-y-4">
      {/* 서브탭 */}
      <div className="flex items-center gap-1.5">
        {SUB_TABS.map((t) => {
          const on = subTab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setSubTab(t.key)}
              className={[
                "h-7 px-3 rounded-lg text-[12px] transition",
                on
                  ? "border border-indigo-200/65 bg-indigo-500/30 text-indigo-50"
                  : "border border-white/10 bg-white/10 text-indigo-100/60 hover:border-indigo-300/50 hover:bg-indigo-500/18 hover:text-indigo-50",
              ].join(" ")}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {/* 콘텐츠 */}
      {subTab === "before-after" && (
        <BeforeAfterCard
          beforeUrl={photos.beforeUrl}
          afterUrl={photos.afterUrl}
        />
      )}
      {subTab === "timeline" && <TimelineView items={photos.timeline} />}
    </section>
  );
}
