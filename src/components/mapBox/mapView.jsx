"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { COORDS } from "@/constants/geo";
import TopRightControls from "@/components/mapBox/topRightControls/topRightControls";
import changeCameraView from "@/utils/map/changeCameraView";
import RegionMarkers from "./regionMarkers";
import Image from "next/image";
import { fetchMarkersInBBox } from "@/api/dashboard";
import { mapMarkerListToViewModel } from "@/utils/mappers/dashboardMapper";

export default function MapView() {
  const mapRef = useRef(null);
  const containerRef = useRef(null);

  const [regionsData, setRegionsData] = useState([]);
  
  const [currentLocation, setCurrentLocation] = useState(null);
  const [workingArea, setWorkingArea] = useState(null);
  const [activeStage, setActiveStage] = useState(null);

  const loadMarkersInView = useCallback(async () => {
    const map = mapRef.current;
    if (!map) return { pohang: [], uljin: [] };

    const bounds = map.getBounds();
    const sw = bounds.getSouthWest();
    const ne = bounds.getNorthEast();

    try {
      const response = await fetchMarkersInBBox({
        minLat: sw.lat,
        minLon: sw.lng,
        maxLat: ne.lat,
        maxLon: ne.lng,
      });

      const viewModels = mapMarkerListToViewModel(response.data);

      const pohangAreas = [];
      const uljinAreas = [];

      viewModels.forEach((area) => {
        const lat = area.center[1];
        if (lat > 36.5) {
          uljinAreas.push(area);
        } else {
          pohangAreas.push(area);
        }
      });

      const newRegionsData = [
        {
          id: "pohang",
          label: "포항",
          color: "#10b981",
          center: COORDS.POHANG,
          areas: pohangAreas,
        },
        {
          id: "uljin",
          label: "울진",
          color: "#3b82f6",
          center: COORDS.ULJIN,
          areas: uljinAreas,
        },
      ];

      setRegionsData(newRegionsData);

      return { pohang: pohangAreas, uljin: uljinAreas };

    } catch (err) {
      console.error("Failed to fetch visible markers:", err);
      return { pohang: [], uljin: [] };
    }
  }, []);

  useEffect(() => {
    if (mapRef.current && currentLocation) {
      changeCameraView(mapRef.current, currentLocation);
    }
  }, [currentLocation]);

  useEffect(() => {
    if (mapRef.current && workingArea) {
      changeCameraView(mapRef.current, workingArea);
    }
  }, [workingArea]);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";
    mapboxgl.accessToken = token;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/aryu1217/cmhssx9l9006q01r64s59b80d",
      projection: "globe",
      antialias: true,
      center: COORDS.POHANG,
      zoom: 6,
    });

    mapRef.current = map;
    map.dragRotate.enable();
    map.touchZoomRotate.enableRotation();

    map.on("load", async () => {
      // 1. 초기 데이터 로드
      const { pohang } = await loadMarkersInView();

      // 2. 인트로 애니메이션 좌표 계산
      let targetCenter = COORDS.POHANG;
      let targetZoom = 11.5;

      if (pohang && pohang.length > 0) {
        const sumLon = pohang.reduce((acc, curr) => acc + curr.center[0], 0);
        const sumLat = pohang.reduce((acc, curr) => acc + curr.center[1], 0);
        targetCenter = [sumLon / pohang.length, sumLat / pohang.length];
        targetZoom = 12; 
      }

      // 3. 이동
      setTimeout(() => {
        changeCameraView(map, {
          center: targetCenter,
          zoom: targetZoom,
          id: "intro-animation",
        });
      }, 800);

      map.on("moveend", () => {
        loadMarkersInView();
      });

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

    return () => {
      try { map.remove(); } finally { mapRef.current = null; }
    };
  }, [loadMarkersInView]);

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <div
        ref={containerRef}
        id="map"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      />

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

      {/* ✅ 수정됨: regionsData prop 전달 */}
      <RegionMarkers
        mapRef={mapRef}
        regionsData={regionsData} 
        currentLocation={currentLocation}
        workingArea={workingArea}
        setWorkingArea={setWorkingArea}
        setActiveStage={setActiveStage}
      />

      <TopRightControls
        regionsData={regionsData}
        currentLocation={currentLocation}
        setCurrentLocation={setCurrentLocation}
        workingArea={workingArea}
        setWorkingArea={setWorkingArea}
        mapRef={mapRef}
        activeStage={activeStage}
        setActiveStage={setActiveStage}
      />
    </div>
  );
}