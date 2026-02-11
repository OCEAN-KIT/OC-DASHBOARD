"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { REGIONS, COORDS } from "@/constants/regions";
import TopRightControls from "@/components/mapBox/topRightControls/topRightControls";
import changeCameraView from "@/utils/map/changeCameraView";
import RegionMarkers from "./regionMarkers";
import Image from "next/image";
import { useAreas } from "@/hooks/useAreas";
import createMarkerElement from "@/utils/map/createMarkerElement";

export default function MapView() {
  const mapRef = useRef(null);
  const containerRef = useRef(null);
  const specialMarkerElsRef = useRef({});

  const [currentLocation, setCurrentLocation] = useState(null);
  const [workingArea, setWorkingArea] = useState(null);
  const [activeStage, setActiveStage] = useState(null);

  const { data: areas = [], isLoading } = useAreas(currentLocation?.id ?? null);

  // 마커 클릭 핸들러에서 최신 currentLocation 참조용
  const currentLocationRef = useRef(null);
  useEffect(() => {
    currentLocationRef.current = currentLocation;
  }, [currentLocation]);

  // 지역 선택 시 카메라 이동
  useEffect(() => {
    if (mapRef.current && currentLocation) {
      changeCameraView(mapRef.current, currentLocation);
    }
  }, [currentLocation]);

  useEffect(() => {
    const els = specialMarkerElsRef.current || {};
    Object.values(els).forEach((el) => el.classList.remove("is-selected"));
    if (currentLocation?.id && els[currentLocation.id]) {
      els[currentLocation.id].classList.add("is-selected");
    }
  }, [currentLocation]);

  // 작업영역 선택 시 카메라 이동
  useEffect(() => {
    if (mapRef.current && workingArea) {
      changeCameraView(mapRef.current, workingArea);
    }
  }, [workingArea]);

  // 지도 초기화 (정상 버전)
  useEffect(() => {
    const setAppHeight = () => {
      const h = window.visualViewport?.height ?? window.innerHeight;
      document.documentElement.style.setProperty("--app-height", `${h}px`);
    };
    setAppHeight();
    window.addEventListener("resize", setAppHeight);
    window.visualViewport?.addEventListener("resize", setAppHeight);
    window.visualViewport?.addEventListener("scroll", setAppHeight);
    return () => {
      window.removeEventListener("resize", setAppHeight);
      window.visualViewport?.removeEventListener("resize", setAppHeight);
      window.visualViewport?.removeEventListener("scroll", setAppHeight);
    };
  }, []);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";
    const valid = token.startsWith("pk.") && token.length > 50;
    if (!valid) {
      console.error(
        "[Mapbox] Invalid or missing token. " +
          "Check .env(.local) NEXT_PUBLIC_MAPBOX_TOKEN and restart the dev server.",
      );
      return;
    }

    mapboxgl.accessToken = token;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      // style: "mapbox://styles/aryu1217/cmhq8lzea005k01ss3zjh8fvv",
      // style: "/map-styles/camouflage.json",
      style: "mapbox://styles/aryu1217/cmhssx9l9006q01r64s59b80d",
      projection: "globe",
      antialias: true,
      center: COORDS.POHANG,
      zoom: 6,
    });

    mapRef.current = map;

    map.dragRotate.enable();
    map.touchZoomRotate.enableRotation();

    map.on("load", () => {
      // 포항~울진 초기 뷰 설정
      const bounds = new mapboxgl.LngLatBounds(
        COORDS.POHANG,
        COORDS.POHANG,
      ).extend(COORDS.ULJIN);

      const clearSpecialSelection = () => {
        Object.values(specialMarkerElsRef.current).forEach((el) =>
          el.classList.remove("is-selected"),
        );
      };

      // 포항·울진 지역 마커 (클릭 시 우상단 지역 선택과 동일 동작)
      REGIONS.forEach((region) => {
        const markerEl = createMarkerElement({
          color: region.color,
          label: region.label,
          variant: "special",
        });

        const marker = new mapboxgl.Marker({ element: markerEl })
          .setLngLat(region.center)
          .addTo(map);

        const el = marker.getElement();
        el.style.cursor = "pointer";
        specialMarkerElsRef.current[region.id] = el;

        el.addEventListener("click", () => {
          if (currentLocationRef.current?.id === region.id) {
            setCurrentLocation(null);
            setWorkingArea(null);
            clearSpecialSelection();
            changeCameraView(map, {
              center: [129.38, 36.5],
              zoom: 6.5,
              id: "overview",
            });
          } else {
            setCurrentLocation(region);
            setWorkingArea(null);
            clearSpecialSelection();
            el.classList.add("is-selected");
          }
        });
      });

      map.fitBounds(bounds, {
        padding: 140,
        maxZoom: 9,
        offset: [0, -30],
        duration: 1200,
        pitch: 45,
        bearing: -15,
      });

      // Sky layer
      if (!map.getLayer("sky")) {
        map.addLayer({
          id: "sky",
          type: "sky",
          paint: {
            "sky-type": "atmosphere",
            "sky-atmosphere-sun": [0.0, 0.0],
            "sky-atmosphere-sun-intensity": 15,
          },
        });
      }
    });

    map.on("error", (e) => {
      console.error("[Mapbox] runtime error:", e?.error || e);
    });

    return () => {
      try {
        map.remove();
      } finally {
        mapRef.current = null;
      }
    };
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "var(--app-height, 100dvh)",
      }}
    >
      <div
        ref={containerRef}
        id="map"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
        }}
      />

      {/* 좌상단 (로고) Ocean Campus 라벨 */}
      <div className="pointer-events-none fixed left-4 top-4 z-50 flex items-center gap-2 mx-1 max-md:hidden">
        <Image
          src="/oceanCampusLogo.png"
          alt="Ocean Campus"
          width={80}
          height={80}
          className="h-10 w-10 object-contain"
          priority
        />
      </div>

      <RegionMarkers
        mapRef={mapRef}
        currentLocation={currentLocation}
        areas={areas}
        workingArea={workingArea}
        setWorkingArea={setWorkingArea}
        setActiveStage={setActiveStage}
      />

      <TopRightControls
        currentLocation={currentLocation}
        setCurrentLocation={setCurrentLocation}
        areas={areas}
        isLoading={isLoading}
        workingArea={workingArea}
        setWorkingArea={setWorkingArea}
        mapRef={mapRef}
        activeStage={activeStage}
        setActiveStage={setActiveStage}
      />

      {/* 데이터 고지 문구 */}
      <div
        className="pointer-events-none fixed z-50 flex justify-center
                   bottom-0 left-0 right-0 pb-1.5
                   max-md:top-3 max-md:bottom-auto max-md:px-4 max-md:pb-0"
      >
        <p
          className="max-w-[800px] text-center leading-relaxed text-white/40
                     text-[14px]
                     max-md:text-[10px] max-md:leading-snug"
        >
          본 대시보드의 모든 정보는 오션캠퍼스 현장 기록 시스템(OC RECORD)을
          통해 수중에서 직접 관측·기록된 데이터를 기반으로 구성되었습니다.
          <br />본 자료는 복원 활동의 경과와 변화를 장기간에 걸쳐 보여주기 위한
          목적을 가집니다.
        </p>
      </div>
    </div>
  );
}
