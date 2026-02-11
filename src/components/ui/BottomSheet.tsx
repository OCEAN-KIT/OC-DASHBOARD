"use client";

import { useRef, useCallback, useEffect, type ReactNode } from "react";

/* ── Snap points (viewport height %) ── */
const SNAP_PEEK = 0.07;
const SNAP_HALF = 0.5;
const SNAP_FULL = 0.85;
const SNAPS = [SNAP_PEEK, SNAP_HALF, SNAP_FULL];

type Props = {
  snap: number;
  onSnapChange: (s: number) => void;
  children: (snap: number) => ReactNode;
};

export default function BottomSheet({ snap, onSnapChange, children }: Props) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const startY = useRef(0);
  const startH = useRef(0);

  const snapToPx = useCallback((s: number) => window.innerHeight * s, []);

  const nearest = useCallback((hPx: number) => {
    const ratio = hPx / window.innerHeight;
    return SNAPS.reduce((prev, curr) =>
      Math.abs(curr - ratio) < Math.abs(prev - ratio) ? curr : prev,
    );
  }, []);

  /* ── pointer handlers ── */
  const onDown = useCallback(
    (e: React.PointerEvent) => {
      dragging.current = true;
      startY.current = e.clientY;
      startH.current = snapToPx(snap);
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    },
    [snap, snapToPx],
  );

  const onMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging.current || !sheetRef.current) return;
      const dy = startY.current - e.clientY;
      const newH = Math.max(
        snapToPx(SNAP_PEEK),
        Math.min(startH.current + dy, snapToPx(SNAP_FULL)),
      );
      sheetRef.current.style.height = `${newH}px`;
      sheetRef.current.style.transition = "none";
    },
    [snapToPx],
  );

  const onUp = useCallback(() => {
    if (!dragging.current || !sheetRef.current) return;
    dragging.current = false;
    const curH = sheetRef.current.getBoundingClientRect().height;
    const next = nearest(curH);
    onSnapChange(next);
  }, [nearest, onSnapChange]);

  /* sync height on snap change / resize */
  useEffect(() => {
    const el = sheetRef.current;
    if (!el) return;
    el.style.transition = "height 0.3s cubic-bezier(.32,.72,0,1)";
    el.style.height = `${snapToPx(snap)}px`;

    const onResize = () => {
      el.style.transition = "none";
      el.style.height = `${snapToPx(snap)}px`;
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [snap, snapToPx]);

  return (
    <div
      ref={sheetRef}
      className="pointer-events-auto fixed inset-x-0 bottom-0 z-50 flex flex-col
                 rounded-t-2xl border-t border-white/10 bg-white/10 backdrop-blur-xl
                 shadow-[0_-4px_24px_rgba(0,0,0,0.25)] text-white"
    >
      {/* drag handle */}
      <div
        className="flex h-10 shrink-0 cursor-grab items-center justify-center active:cursor-grabbing"
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        style={{ touchAction: "none" }}
      >
        <div className="h-1.5 w-12 rounded-full bg-white/40" />
      </div>

      {/* content */}
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        {children(snap)}
      </div>
    </div>
  );
}

export { SNAP_PEEK, SNAP_HALF, SNAP_FULL };
