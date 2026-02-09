"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { COORDS } from "@/constants/geo";
import TopRightControls from "@/components/mapBox/topRightControls/topRightControls";
import changeCameraView from "@/utils/map/changeCameraView";
import RegionMarkers from "./regionMarkers";
import Image from "next/image";
import { useAreas } from "@/hooks/useAreas";

export default function MapView() {
  const mapRef = useRef(null);
  const containerRef = useRef(null);

  const [currentLocation, setCurrentLocation] = useState(null);
  const [workingArea, setWorkingArea] = useState(null);
  const [activeStage, setActiveStage] = useState(null);

  const { data: areas = [], isLoading } = useAreas(currentLocation?.id ?? null);

  // 지역 선택 시 카메라 이동
  useEffect(() => {
    if (mapRef.current && currentLocation) {
      changeCameraView(mapRef.current, currentLocation);
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
      zoom: 5,
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

      new mapboxgl.Marker().setLngLat(COORDS.POHANG).addTo(map);
      new mapboxgl.Marker().setLngLat(COORDS.ULJIN).addTo(map);

      map.fitBounds(bounds, {
        padding: 80,
        maxZoom: 12,
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
    <div style={{ position: "absolute", inset: 0 }}>
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
      <div className="pointer-events-none fixed left-4 top-4 z-50 flex items-center gap-2 mx-1">
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
    </div>
  );
}
