"use client";

import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import AreaItemCard from "./areaItemCard";

export default function AreaGroupsList({
  grouped,
  onSelectArea,
  daysAgo,
  activeRegion,
  workingArea,
  isLoading,
}) {
  const [expanded, setExpanded] = useState(() =>
    Object.fromEntries(grouped.map((g) => [g.stage, true])),
  );

  useEffect(() => {
    setExpanded(Object.fromEntries(grouped.map((g) => [g.stage, true])));
  }, [grouped, activeRegion]);

  const toggle = (stage) => setExpanded((s) => ({ ...s, [stage]: !s[stage] }));

  if (isLoading) {
    return (
      <div className="px-3 py-8 text-center text-sm text-white/60">
        불러오는 중...
      </div>
    );
  }

  return (
    <div className="max-h-[56vh] overflow-auto px-2 py-2">
      {activeRegion ? (
        grouped.length ? (
          grouped.map((group) => {
            const isOpen = !!expanded[group.stage];
            return (
              <div key={group.stage} className="mb-2">
                <button
                  type="button"
                  onClick={() => toggle(group.stage)}
                  className="sticky top-0 z-10 -mx-2 flex w-[calc(100%+16px)] items-center justify-between
                             bg-white/10 backdrop-blur-xl px-3 py-1 text-xs tracking-wide
                             hover:bg-white/12 transition"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="inline-block h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: group.color }}
                    />
                    {group.stage} ({group.items.length})
                  </div>
                  <span className="text-white/80">
                    {isOpen ? (
                      <ChevronUp size={16} />
                    ) : (
                      <ChevronDown size={16} />
                    )}
                  </span>
                </button>

                {isOpen && (
                  <div className="mt-2 space-y-1">
                    {group.items.map((a) => (
                      <AreaItemCard
                        key={a.id}
                        area={a}
                        color={group.color}
                        onClick={() => onSelectArea(a)}
                        days={daysAgo(a)}
                        isActive={workingArea?.id === a.id}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="px-3 py-8 text-center text-sm text-white/60">
            조건에 맞는 작업영역이 없습니다
          </div>
        )
      ) : (
        <div className="px-3 py-8 text-center text-sm text-white/60">
          지역을 먼저 선택하세요
        </div>
      )}
    </div>
  );
}
