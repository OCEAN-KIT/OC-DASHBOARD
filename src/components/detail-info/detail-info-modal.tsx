"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "./header";
import TabsBar, { type TabKey } from "./tabs";
import OverviewTab from "./tabs/overview-tab";
import TransplantTab from "./tabs/transplant-tab";
import GrowthTab from "./tabs/growth-tab";
// import BiodiversityTab from "./tabs/bio-diversity-tab";
import WaterTab from "./tabs/water-tab";
import MediaTab from "./tabs/media-tab";
import { useAreaDetails } from "@/hooks/useAreas";

type Props = {
  areaId: number;
};

export default function DetailInfoModal({ areaId }: Props) {
  const router = useRouter();
  const [tab, setTab] = useState<TabKey>("overview");
  const [frame, setFrame] = useState(0);

  const { data: area, isLoading, isError } = useAreaDetails(areaId);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && router.back();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [router]);

  if (isLoading) {
    return (
      <div
        aria-modal
        role="dialog"
        className="fixed inset-0 z-100 flex items-center justify-center"
      >
        <div className="absolute inset-0 bg-black/55 backdrop-blur-sm" />
        <div className="relative z-10 text-white text-sm">로딩 중...</div>
      </div>
    );
  }

  if (isError || !area) {
    return (
      <div
        aria-modal
        role="dialog"
        className="fixed inset-0 z-100 flex items-center justify-center"
      >
        <div
          className="absolute inset-0 bg-black/55 backdrop-blur-sm"
          onClick={() => router.back()}
        />
        <div className="relative z-10 max-w-[92vw] rounded-2xl border border-white/15 bg-white/10 p-6 text-white backdrop-blur-xl shadow-2xl">
          <div className="text-sm">데이터가 없습니다. (ID: {areaId})</div>
          <button
            className="mt-4 rounded-md border border-white/15 bg-white/10 px-3 py-2 text-sm"
            onClick={() => router.back()}
          >
            닫기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      aria-modal
      role="dialog"
      className="fixed inset-0 z-100 flex items-center justify-center"
    >
      <div
        className="absolute inset-0 bg-black/55 backdrop-blur-sm"
        onClick={() => router.back()}
      />

      <div className="relative z-10 w-[980px] max-w-[92vw] rounded-2xl border border-white/15 bg-white/10 text-white backdrop-blur-xl shadow-2xl animate-popIn">
        <Header overview={area.overview} onClose={() => router.back()} />

        <div className="h-px w-full bg-white/10" />
        <TabsBar active={tab} onChange={setTab} />

        <div className="p-5 space-y-2">
          {tab === "overview" && <OverviewTab data={area} />}
          {/* {tab === "transplant" && <TransplantTab data={area} />}
          {tab === "growth" && <GrowthTab data={area} />}
          {tab === "biodiversity" && <BiodiversityTab data={area} />}
          {tab === "water" && <WaterTab data={area} />}
          {tab === "media" && (
            <MediaTab media={area.photos} frame={frame} setFrame={setFrame} />
          )} */}
        </div>
      </div>

      <style jsx global>{`
        @keyframes popIn {
          0% {
            opacity: 0;
            transform: translateY(8px) scale(0.98);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-popIn {
          animation: popIn 0.18s ease-out;
        }
      `}</style>
    </div>
  );
}
