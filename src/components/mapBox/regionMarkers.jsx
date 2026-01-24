"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import changeCameraView from "@/utils/map/changeCameraView";
import { createRoot } from "react-dom/client";
import RegionPopup from "./regionPopup";
import { STAGE_META } from "@/constants/stageMeta";
import { useRouter } from "next/navigation";

export default function RegionMarkers({
  mapRef,
  regionsData, // ✅ 추가됨
  currentLocation,
  workingArea,
  setWorkingArea,
  setActiveStage,
}) {
  const router = useRouter();

  // 마커 인스턴스 관리 (재렌더링 시 깜빡임 방지)
  const markersRef = useRef({});
  const popupRootsRef = useRef({});

  // 1. 마커 생성 및 갱신 로직 (regionsData가 바뀌면 실행)
  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;

    // ✅ 핵심 수정: currentLocation이 없으면 전체 regionsData에서 영역을 추출
    let targetAreas = [];
    if (currentLocation && currentLocation.areas) {
      targetAreas = currentLocation.areas;
    } else if (regionsData && regionsData.length > 0) {
      targetAreas = regionsData.flatMap((r) => r.areas || []);
    }

    if (targetAreas.length === 0) return;

    // 현재 그려져야 할 ID 집합
    const activeIds = new Set(targetAreas.map((a) => a.id));

    // 1) 화면에서 사라져야 할 마커 제거
    Object.keys(markersRef.current).forEach((id) => {
      if (!activeIds.has(id)) {
        markersRef.current[id].remove();
        delete markersRef.current[id];
        if (popupRootsRef.current[id]) {
          popupRootsRef.current[id].unmount();
          delete popupRootsRef.current[id];
        }
      }
    });

    const getMarkerColor = (area) => {
      // 지역 색상 찾기
      const parentRegion = regionsData.find((r) =>
        r.areas?.some((a) => a.id === area.id)
      );
      const regionColor = parentRegion?.color ?? "#10b981";
      return STAGE_META[area?.stage]?.color ?? regionColor;
    };

    // 2) 새로운 마커 생성 혹은 기존 마커 유지
    targetAreas.forEach((area) => {
      // 이미 있으면 스킵 (깜빡임 방지)
      if (markersRef.current[area.id]) return;

      // --- 팝업 DOM 생성 ---
      const popupNode = document.createElement("div");
      const popupRoot = createRoot(popupNode);
      popupRoot.render(
        <RegionPopup
          region={area}
          onOpen={() => router.push(`/detailInfo/${area.id}`)}
        />
      );
      popupRootsRef.current[area.id] = popupRoot;

      const popup = new mapboxgl.Popup({
        anchor: "left",
        closeButton: false,
        closeOnClick: true,
        offset: [30, 0, 30, 0],
        className: "region-popup no-tip",
      }).setDOMContent(popupNode);

      // --- 마커 생성 ---
      const marker = new mapboxgl.Marker({
        color: getMarkerColor(area),
        scale: 1, // CSS로 크기 제어
      })
        .setLngLat(area.center)
        .setPopup(popup)
        .addTo(map);

      const el = marker.getElement();
      el.setAttribute("data-tip", area?.label ?? "상세 보기");
      el.style.transition = "z-index 0.2s";

      // 클릭 이벤트
      el.addEventListener("click", (e) => {
        // e.stopPropagation();
        setWorkingArea(area);
        setActiveStage?.(area.stage);
        changeCameraView(map, area);
      });

      markersRef.current[area.id] = marker;
    });
  }, [
    mapRef,
    regionsData,
    currentLocation,
    router,
    setWorkingArea,
    setActiveStage,
  ]);

  // 2. 선택 상태(Highlight) 업데이트 (workingArea 변경 시 스타일만 변경)
  useEffect(() => {
    Object.entries(markersRef.current).forEach(([id, marker]) => {
      const el = marker.getElement();
      const isSelected = workingArea?.id === id;

      if (isSelected) {
        el.classList.add("marker-selected");
        el.style.zIndex = "10";
      } else {
        el.classList.remove("marker-selected");
        el.style.zIndex = "1";
      }
    });
  }, [workingArea]);

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      Object.values(markersRef.current).forEach((m) => m.remove());
      Object.values(popupRootsRef.current).forEach((root) => root.unmount());
      markersRef.current = {};
      popupRootsRef.current = {};
    };
  }, []);

  return null;
}
