"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import changeCameraView from "@/utils/map/changeCameraView";
import ControlsHeader from "./controlsHeader";
import RegionSelector from "./regionSelector";
import AreaGroupsList from "./areaGroupList";
import { STAGE_META, STAGE_ORDER } from "@/constants/stageMeta";
import Image from "next/image";
import StageFilter from "./stageFilter";
import SearchBox from "./searchBox";
import BottomSheet, { SNAP_PEEK, SNAP_HALF } from "@/components/ui/BottomSheet";
import { Activity, Filter, MapPinned, Search } from "lucide-react";

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
  const router = useRouter();
  const searchRef = useRef(null);

  useEffect(() => {
    if (!areas?.length) return;
    areas.forEach((a) => {
      if (a?.id == null) return;
      try {
        router.prefetch(`/detailInfo/${a.id}`);
      } catch {}
    });
  }, [areas, router]);

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
      setActiveStage(null);
      resetView();
      return;
    }
    setCurrentLocation(region);
    setWorkingArea(null);
    setActiveStage(null);
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

  const filteredCount = useMemo(
    () => grouped.reduce((sum, group) => sum + group.items.length, 0),
    [grouped],
  );

  return (
    <>
      {/* ═══════════ 데스크탑: 기존 우상단 패널 ═══════════ */}
      <div
        className="pointer-events-auto fixed right-4 top-4 z-50 hidden w-[460px]
                   max-w-[92vw] text-[var(--ds-text)] md:block"
        aria-label="해역/작업영역 컨트롤"
      >
        <div className="oc-panel overflow-hidden rounded-2xl">
          <div className="px-4 pt-4 pb-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Image
                  src="/oceanCampusLogo.png"
                  alt="Ocean Campus"
                  width={20}
                  height={20}
                  className="h-5 w-5 object-contain"
                  priority
                />
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-indigo-100/72">
                    OC Dashboard
                  </p>
                </div>
              </div>
              <span
                className="oc-kpi-glow rounded-full border border-orange-200/40 bg-orange-400/22 px-2.5 py-1
                           text-[10px] font-semibold uppercase tracking-[0.14em] text-orange-100"
              >
                Live
              </span>
            </div>

            <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
              <div className="rounded-lg border border-white/18 bg-white/10 px-2 py-2">
                <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.1em] text-indigo-100/70">
                  <MapPinned size={12} />
                  Region
                </div>
                <p className="mt-1 text-sm font-semibold text-slate-50">
                  {currentLocation?.label ?? "전체"}
                </p>
              </div>
              <div className="rounded-lg border border-white/18 bg-white/10 px-2 py-2">
                <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.1em] text-indigo-100/70">
                  <Filter size={12} />
                  Filtered
                </div>
                <p className="mt-1 text-sm font-semibold text-slate-50">
                  {filteredCount}
                </p>
              </div>
              <div className="rounded-lg border border-white/18 bg-white/10 px-2 py-2">
                <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.1em] text-indigo-100/70">
                  <Activity size={12} />
                  Total
                </div>
                <p className="mt-1 text-sm font-semibold text-slate-50">
                  {areas.length}
                </p>
              </div>
            </div>
          </div>

          <div className="oc-soft-divider h-px w-full" />

          <ControlsHeader open={open} setOpen={setOpen} resetView={resetView} />

          {open && (
            <>
              <div className="px-4 pt-2">
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-indigo-100/72">
                    Search & Region
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <RegionSelector
                    activeId={currentLocation?.id}
                    onSelect={handleRegion}
                  />
                  <div className="min-w-[150px] flex-1">
                    <SearchBox value={query} onChange={setQuery} />
                  </div>
                </div>
              </div>

              <div className="px-4 py-3">
                <StageFilter
                  activeStage={activeStage}
                  setActiveStage={setActiveStage}
                  stageMeta={STAGE_META}
                />
              </div>

              <div className="oc-soft-divider h-px w-full" />

              <AreaGroupsList
                grouped={grouped}
                onSelectArea={handleArea}
                activeRegion={!!currentLocation}
                isLoading={isLoading}
                workingArea={workingArea}
              />
            </>
          )}
        </div>
      </div>

      {/* ═══════════ 모바일: 바텀시트 ═══════════ */}
      <div className="md:hidden">
        <BottomSheet snap={mobileSnap} onSnapChange={setMobileSnap}>
          {(snap) => (
            <>
              {/* 미니 헤더 (항상 표시) */}
              <div className="flex h-12 shrink-0 items-center justify-between px-4">
                <RegionSelector
                  activeId={currentLocation?.id}
                  onSelect={handleRegion}
                />
                <button
                  className="ml-2 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg
                             border border-white/20 bg-white/10 text-slate-100
                             hover:border-indigo-300/60 hover:bg-indigo-500/20 transition"
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
                  <div className="oc-soft-divider h-px w-full" />
                </>
              )}

              {/* 리스트 (Half 이상) */}
              {snap >= SNAP_HALF && (
                <div className="min-h-0 flex-1 overflow-y-auto">
                  <AreaGroupsList
                    grouped={grouped}
                    onSelectArea={handleArea}
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
