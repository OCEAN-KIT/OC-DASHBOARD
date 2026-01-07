"use client";

import { useMemo, useState } from "react";
// import { REGIONS } from "@/constants/regions"; // ❌ 제거: 더미 데이터 상수 삭제
import changeCameraView from "@/utils/map/changeCameraView";
import ControlsHeader from "./controlsHeader";
import AreaGroupsList from "./areaGroupList";
import { STAGE_META, STAGE_ORDER } from "@/constants/stageMeta";
import Image from "next/image";
import StageFilter from "./stageFilter";
import SearchBox from "./searchBox";

function daysAgo(area) {
  const iso = area.updatedAt ?? area.startDate;
  if (!iso) return null;
  const t = Date.parse(iso);
  if (Number.isNaN(t)) return null;
  return Math.max(0, Math.floor((Date.now() - t) / 86400000));
}

export default function TopRightControls({
  regionsData, // ✅ 추가: 부모로부터 데이터 수신
  currentLocation,
  setCurrentLocation,
  workingArea,
  setWorkingArea,
  mapRef,
  activeStage,
  setActiveStage,
}) {
  const [open, setOpen] = useState(true);
  const [query, setQuery] = useState("");

  // REGIONS 상수 대신 props로 받은 regionsData 사용
  const activeRegion = useMemo(() => {
    if (!currentLocation || !regionsData) return null;
    return regionsData.find((r) => r.id === currentLocation.id) ?? null;
  }, [currentLocation, regionsData]);

  const resetView = () => {
    if (!mapRef?.current) return;
    changeCameraView(mapRef.current, {
      center: [129.38, 36.5],
      zoom: 6.5,
      id: "overview",
    });
  };

  const handleRegion = (id) => {
    if (currentLocation?.id === id) {
      setCurrentLocation(null);
      setWorkingArea(null);
      resetView();
      return;
    }
    // REGIONS 상수 대신 regionsData에서 찾음
    const selected = regionsData.find((r) => r.id === id) ?? null;
    setCurrentLocation(selected);
    setWorkingArea(null);
    if (mapRef?.current && selected) changeCameraView(mapRef.current, selected);
  };

  const handleArea = (area) => {
    setWorkingArea(area);
    setActiveStage(area.stage);
    if (mapRef?.current && area) changeCameraView(mapRef.current, area);
  };

  const grouped = useMemo(() => {
    if (!activeRegion) return [];
    const q = query.trim().toLowerCase();

    const items = (activeRegion.areas ?? []).filter((a) => {
      const hitStage = activeStage ? a.stage === activeStage : true;
      const hitQuery = q
        ? (a.label ?? "").toLowerCase().includes(q) ||
          (a.habitat ?? "").toLowerCase().includes(q)
        : true;
      return hitStage && hitQuery;
    });

    return STAGE_ORDER.map((stage) => ({
      stage,
      color: STAGE_META[stage]?.color,
      items: items.filter((a) => a.stage === stage),
    })).filter((g) => g.items.length > 0);
  }, [activeRegion, activeStage, query]);

  return (
    <div
      className="pointer-events-auto fixed right-4 top-4 z-50 w-[430px] max-w-[86vw]
                 rounded-2xl border border-white/10 bg-white/10 backdrop-blur-xl
                 shadow-[0_8px_30px_rgba(0,0,0,0.25)] text-white"
      aria-label="해역/작업영역 컨트롤"
    >
      {/* ── (로고) Ocean Campus 라벨 ─────────────────────────────── */}
      <div className="flex items-center gap-2 px-4 pt-3">
        <Image
          src="/oceanCampusLogo.png"
          alt="Ocean Campus"
          width={20}
          height={20}
          className="h-5 w-5 object-contain"
          priority
        />
        <span className="text-[13px] font-semibold tracking-wide opacity-90">
          Ocean Campus
        </span>
      </div>
      <div className="h-px w-full bg-white/10 mt-3" />
      {/* 기존 헤더 */}
      <ControlsHeader open={open} setOpen={setOpen} resetView={resetView} />

      {open && (
        <>
          {/* 지역 스위처 + 검색 같은 줄 */}
          <div className="px-4 pt-2">
            <div className="flex items-center gap-3">
              {/* 지역 스위처: regionsData 매핑 */}
              <div className="flex gap-2 overflow-x-auto pr-1 max-w-[55%]">
                {regionsData && regionsData.map((r) => {
                  const active = currentLocation?.id === r.id;
                  return (
                    <button
                      key={r.id}
                      onClick={() => handleRegion(r.id)}
                      className={`h-9 px-4 rounded-xl border text-sm font-semibold whitespace-nowrap transition
                  ${
                    active
                      ? "border-cyan-400/60 bg-cyan-400/20 shadow-[inset_0_0_0_2px_rgba(34,211,238,0.25)]"
                      : "border-white/10 bg-white/10 hover:bg-white/15"
                  }`}
                    >
                      {r.label} ({r.areas ? r.areas.length : 0})
                    </button>
                  );
                })}
              </div>

              {/* 검색창: 남은 공간 꽉 채움 */}
              <div className="flex-1 min-w-[140px]">
                <SearchBox value={query} onChange={setQuery} />
              </div>
            </div>
          </div>

          {/* 필터칩: 아랫줄 */}
          <div className="px-4 py-3">
            <StageFilter
              activeStage={activeStage}
              setActiveStage={setActiveStage}
              stageMeta={STAGE_META}
            />
          </div>

          <div className="h-px w-full bg-white/10" />

          {/* 리스트 */}
          <AreaGroupsList
            grouped={grouped}
            onSelectArea={handleArea}
            stageMeta={STAGE_META}
            daysAgo={daysAgo}
            activeRegion={!!activeRegion}
            workingArea={workingArea}
          />
        </>
      )}
    </div>
  );
}