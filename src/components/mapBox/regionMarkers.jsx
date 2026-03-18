"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import changeCameraView from "@/utils/map/changeCameraView";
import { createRoot } from "react-dom/client";
import RegionPopup from "./regionPopup";
import { STAGE_META } from "@/constants/stageMeta";
import { useRouter } from "next/navigation";
import createMarkerElement from "@/utils/map/createMarkerElement";

function cleanupMarkerEntry(entry) {
  if (!entry) return;

  entry.el?.removeEventListener("click", entry.onClick);
  entry.marker?.remove();
  entry.popup?.remove();
  if (entry.popupRoot) {
    setTimeout(() => entry.popupRoot.unmount(), 0);
  }
}

export default function RegionMarkers({
  mapRef,
  currentLocation,
  areas,
  workingArea,
  setWorkingArea,
  setActiveStage,
}) {
  const router = useRouter();
  const markerEntriesRef = useRef(new Map());
  const selectedMarkerIdRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const map = mapRef.current;
    const markerEntries = new Map();

    const getMarkerColor = (area) =>
      STAGE_META[area?.level]?.color ?? currentLocation?.color ?? "#ef4444";

    if (currentLocation && areas.length) {
      areas.forEach((a) => {
        // React로 팝업 DOM 렌더
        const popupNode = document.createElement("div");
        const popupRoot = createRoot(popupNode);
        popupRoot.render(
          <RegionPopup
            region={a}
            onOpen={() => {
              router.push(`/detailInfo/${a.id}`);
            }}
          />,
        );

        const popup = new mapboxgl.Popup({
          anchor: "left",
          closeButton: false,
          closeOnClick: true,
          offset: [30, 0, 30, 0],
          className: "region-popup no-tip",
        }).setDOMContent(popupNode);

        const markerEl = createMarkerElement({
          color: getMarkerColor(a),
          label: a?.name ?? "상세 보기",
        });

        const marker = new mapboxgl.Marker({
          element: markerEl,
        })
          .setLngLat([a.lon, a.lat])
          .setPopup(popup)
          .addTo(map);

        const el = marker.getElement();
        const onClick = () => {
          setWorkingArea(a);
          setActiveStage?.(a.level);
          changeCameraView(map, a);
        };

        el.addEventListener("click", onClick);
        markerEntries.set(a.id, {
          el,
          marker,
          onClick,
          popup,
          popupRoot,
        });
      });
    }

    markerEntriesRef.current = markerEntries;

    const selectedId = selectedMarkerIdRef.current;
    if (selectedId != null) {
      markerEntries.get(selectedId)?.el.classList.add("is-selected");
    }

    return () => {
      markerEntries.forEach((entry) => cleanupMarkerEntry(entry));
      if (markerEntriesRef.current === markerEntries) {
        markerEntriesRef.current = new Map();
      }
    };
  }, [mapRef, currentLocation, areas, setWorkingArea, setActiveStage, router]);

  useEffect(() => {
    const markerEntries = markerEntriesRef.current;
    const prevSelectedId = selectedMarkerIdRef.current;
    const nextSelectedId =
      workingArea?.id != null && markerEntries.has(workingArea.id)
        ? workingArea.id
        : null;

    if (prevSelectedId != null && prevSelectedId !== nextSelectedId) {
      markerEntries.get(prevSelectedId)?.el.classList.remove("is-selected");
    }

    if (nextSelectedId != null) {
      markerEntries.get(nextSelectedId)?.el.classList.add("is-selected");
    }

    selectedMarkerIdRef.current = nextSelectedId;
  }, [workingArea, areas, currentLocation]);

  return null;
}
