"use client";

import { useMemo, useRef, useState, useEffect, useCallback } from "react";
import changeCameraView from "@/utils/map/changeCameraView";
import ControlsHeader from "./controlsHeader";
import RegionSelector from "./regionSelector";
import AreaGroupsList from "./areaGroupList";
import { STAGE_META, STAGE_ORDER } from "@/constants/stageMeta";
import Image from "next/image";
import StageFilter from "./stageFilter";
import SearchBox from "./searchBox";
import BottomSheet, {
  SNAP_PEEK,
  SNAP_HALF,
} from "@/components/ui/BottomSheet";
import { Search } from "lucide-react";

export default function TopRightControls({
  currentLocation,
  setCurrentLocation,
  areas,
  isLoading,
  workingArea,
  setWorkingArea,
  mapRef,
  activeStage,
  setActiveStage,
}) {
  const [open, setOpen] = useState(true);
  const [query, setQuery] = useState("");
  const [mobileSnap, setMobileSnap] = useState(SNAP_PEEK);
  const [now, setNow] = useState(null);
  const searchRef = useRef(null);

  useEffect(() => {
    setNow(Date.now());
  }, []);

  const daysAgo = useCallback(
    (area) => {
      if (!now) return null;
      const iso = area.updatedAt ?? area.startDate;
      if (!iso) return null;
      const t = Date.parse(iso);
      if (Number.isNaN(t)) return null;
      return Math.max(0, Math.floor((now - t) / 86400000));
    },
    [now],
  );

  const resetView = () => {
    if (!mapRef?.current) return;
    changeCameraView(mapRef.current, {
      center: [129.38, 36.5],
      zoom: 6.5,
      id: "overview",
    });
  };

  const handleRegion = (region) => {
    if (currentLocation?.id === region.id) {
      setCurrentLocation(null);
      setWorkingArea(null);
      resetView();
      return;
    }
    setCurrentLocation(region);
    setWorkingArea(null);
    if (mapRef?.current) changeCameraView(mapRef.current, region);
  };

  const handleArea = (area) => {
    setWorkingArea(area);
    setActiveStage(area.level);
    if (mapRef?.current && area) changeCameraView(mapRef.current, area);
  };

  const grouped = useMemo(() => {
    if (!areas.length) return [];
    const q = query.trim().toLowerCase();

    const items = areas.filter((a) => {
      const hitStage = activeStage ? a.level === activeStage : true;
      const hitQuery = q
        ? (a.name ?? "").toLowerCase().includes(q) ||
          (a.habitat ?? "").toLowerCase().includes(q)
        : true;
      return hitStage && hitQuery;
    });

    return STAGE_ORDER.map((stage) => ({
      stage,
      color: STAGE_META[stage]?.color,
      items: items.filter((a) => a.level === stage),
    })).filter((g) => g.items.length > 0);
  }, [areas, activeStage, query]);

  return (
    <>
      {/* ═══════════ 데스크탑: 기존 우상단 패널 ═══════════ */}
      <div
        className="pointer-events-auto fixed right-4 top-4 z-50 w-[430px] max-w-[86vw]
                   rounded-2xl border border-white/10 bg-white/10 backdrop-blur-xl
                   shadow-[0_8px_30px_rgba(0,0,0,0.25)] text-white
                   hidden md:block"
        aria-label="해역/작업영역 컨트롤"
      >
        {/* 로고 */}
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

        <ControlsHeader open={open} setOpen={setOpen} resetView={resetView} />

        {open && (
          <>
            {/* 지역 스위처 + 검색 같은 줄 */}
            <div className="px-4 pt-2">
              <div className="flex items-center gap-3">
                <RegionSelector
                  activeId={currentLocation?.id}
                  onSelect={handleRegion}
                />
                <div className="flex-1 min-w-[140px]">
                  <SearchBox value={query} onChange={setQuery} />
                </div>
              </div>
            </div>

            {/* 필터칩 */}
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
              daysAgo={daysAgo}
              activeRegion={!!currentLocation}
              isLoading={isLoading}
              workingArea={workingArea}
            />
          </>
        )}
      </div>

      {/* ═══════════ 모바일: 바텀시트 ═══════════ */}
      <div className="md:hidden">
        <BottomSheet snap={mobileSnap} onSnapChange={setMobileSnap}>
          {(snap) => (
            <>
              {/* 미니 헤더 (항상 표시) */}
              <div className="flex shrink-0 items-center justify-between px-4 h-12">
                <RegionSelector
                  activeId={currentLocation?.id}
                  onSelect={handleRegion}
                />
                <button
                  className="ml-2 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg
                             bg-white/10 hover:bg-white/15 transition"
                  onClick={() => {
                    if (snap <= SNAP_PEEK) setMobileSnap(SNAP_HALF);
                    setTimeout(() => searchRef.current?.focus(), 350);
                  }}
                  aria-label="검색"
                >
                  <Search size={16} />
                </button>
              </div>

              {/* 확장 시 표시 */}
              {snap > SNAP_PEEK && (
                <>
                  <div className="px-4 pt-1 pb-2">
                    <SearchBox
                      ref={searchRef}
                      value={query}
                      onChange={setQuery}
                    />
                  </div>
                  <div className="px-4 pb-2">
                    <StageFilter
                      activeStage={activeStage}
                      setActiveStage={setActiveStage}
                      stageMeta={STAGE_META}
                    />
                  </div>
                  <div className="h-px w-full bg-white/10" />
                </>
              )}

              {/* 리스트 (Half 이상) */}
              {snap >= SNAP_HALF && (
                <div className="min-h-0 flex-1 overflow-y-auto">
                  <AreaGroupsList
                    grouped={grouped}
                    onSelectArea={handleArea}
                    daysAgo={daysAgo}
                    activeRegion={!!currentLocation}
                    isLoading={isLoading}
                    workingArea={workingArea}
                  />
                </div>
              )}
            </>
          )}
        </BottomSheet>
      </div>
    </>
  );
}
