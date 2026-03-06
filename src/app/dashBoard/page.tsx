import dynamic from "next/dynamic";

const MapView = dynamic(() => import("@/components/mapBox/mapView"), {
  ssr: false,
  loading: () => (
    <div
      className="min-h-screen w-full bg-slate-900/90 text-slate-200 flex items-center justify-center"
      role="status"
      aria-live="polite"
    >
      <p className="text-sm font-medium tracking-wide">지도 로딩 중...</p>
    </div>
  ),
});

export default function DashBoardPage() {
  return (
    <div>
      <MapView />
    </div>
  );
}
