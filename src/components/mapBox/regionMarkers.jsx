"use client";

import { useEffect } from "react";
import mapboxgl from "mapbox-gl";
import changeCameraView from "@/utils/map/changeCameraView";
import { createRoot } from "react-dom/client";
import RegionPopup from "./regionPopup";
import { STAGE_META } from "@/constants/stageMeta";
import { useRouter } from "next/navigation";
export default function RegionMarkers({
  mapRef,
  currentLocation,
  areas,
  workingArea,
  setWorkingArea,
  setActiveStage,
}) {
  const router = useRouter();

  useEffect(() => {
    if (!mapRef.current) return;

    const map = mapRef.current;
    const markers = [];
    const popups = [];
    const roots = [];

    const getMarkerColor = (area) =>
      STAGE_META[area?.level]?.color ?? currentLocation?.color ?? "#10b981";

    if (currentLocation && areas.length) {
      areas.forEach((a) => {
        const isSelected = workingArea?.id === a.id;

        // React로 팝업 DOM 렌더
        const popupNode = document.createElement("div");
        const popupRoot = createRoot(popupNode);
        roots.push(popupRoot);
        popupRoot.render(
          <RegionPopup
            region={a}
            onOpen={() => router.push(`/detailInfo/${a.id}`)}
          />,
        );

        const popup = new mapboxgl.Popup({
          anchor: "left",
          closeButton: false,
          closeOnClick: true,
          offset: [30, 0, 30, 0],
          className: "region-popup no-tip",
        }).setDOMContent(popupNode);
        popups.push(popup);

        const marker = new mapboxgl.Marker({
          color: getMarkerColor(a),
          scale: isSelected ? 1.6 : 0.9,
        })
          .setLngLat([a.lon, a.lat])
          .setPopup(popup)
          .addTo(map);

        const el = marker.getElement();
        el.setAttribute("data-tip", a?.name ?? "상세 보기");

        el.addEventListener("click", () => {
          setWorkingArea(a);
          setActiveStage?.(a.level);
          changeCameraView(map, a);
        });

        markers.push(marker);
      });
    }

    return () => {
      markers.forEach((m) => m.remove());
      popups.forEach((p) => p.remove());
      roots.forEach((r) => r.unmount());
    };
  }, [
    mapRef,
    currentLocation,
    areas,
    workingArea,
    setWorkingArea,
    setActiveStage,
    router,
  ]);

  return null;
}
