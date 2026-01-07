"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { fetchAreaDetail } from "@/api/dashboard";
import { mapAreaDetailToViewModel } from "@/utils/mappers/dashboardMapper";
import Header from "./header";
import TabsBar from "./tabs";
import OverviewTab from "./tabs/overview-tab";
import TransplantTab from "./tabs/transplant-tab";
import GrowthTab from "./tabs/growth-tab";
import BiodiversityTab from "./tabs/bio-diversity-tab";
import WaterTab from "./tabs/water-tab";
import MediaTab from "./tabs/media-tab";
import { PuffLoader } from "react-spinners"; // 로딩 스피너 활용

export default function DetailInfoModal({ areaId }) {
  const router = useRouter();
  const [tab, setTab] = useState("overview");
  
  // 데이터 상태 관리
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // AI 관련 상태 (현재는 백엔드 연동 전이라 Mocking 유지 혹은 API 연동 시 수정)
  const [aiOn, setAiOn] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [frame, setFrame] = useState(0);

  // API 데이터 조회
  useEffect(() => {
    let isMounted = true;
    
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        // 1. 백엔드 API 호출
        const apiResponse = await fetchAreaDetail(areaId);
        
        // 2. 프론트엔드 뷰 모델로 변환 (Mapper 사용)
        const viewModel = mapAreaDetailToViewModel(apiResponse.data);
        
        if (isMounted) {
          setData(viewModel);
        }
      } catch (err) {
        console.error("Failed to fetch area detail:", err);
        if (isMounted) setError(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (areaId) {
      loadData();
    }

    return () => { isMounted = false; };
  }, [areaId]);

  // 키보드 이벤트 (ESC 닫기)
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && router.back();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [router]);

  // AI 토글 핸들러 (FastAPI 연동 예정)
  const handleToggleAI = async () => {
    if (aiLoading) return;
    setAiLoading(true);

    // TODO: 추후 FastAPI 연동 포인트
    // const res = await fetch(`/api/ai/predict/${areaId}`); ...
    await new Promise((r) => setTimeout(r, 1000)); // Mock delay

    setAiOn((v) => !v);
    setAiLoading(false);
  };

  // 로딩 상태 렌더링
  if (loading) {
    return (
      <div className="fixed inset-0 z-100 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/55 backdrop-blur-sm" />
        <div className="relative z-10">
          <PuffLoader color="#36d7b7" size={60} />
        </div>
      </div>
    );
  }

  // 에러 또는 데이터 없음 처리
  if (error || !data) {
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
          <div className="text-sm">
            {error ? "데이터를 불러오는 중 오류가 발생했습니다." : `데이터가 없습니다. (ID: ${areaId})`}
          </div>
          <button
            className="mt-4 rounded-md border border-white/15 bg-white/10 px-3 py-2 text-sm hover:bg-white/20"
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
        <Header
          areaId={areaId}
          basic={data.basic}
          aiOn={aiOn}
          loading={aiLoading}
          onToggle={handleToggleAI}
          onClose={() => router.back()}
        />

        <div className="h-px w-full bg-white/10" />
        <TabsBar active={tab} onChange={setTab} />
        <div className="h-px w-full bg-white/10" />

        <div className="p-5 space-y-4">
          {tab === "overview" && <OverviewTab data={data} aiOn={aiOn} />}
          {tab === "transplant" && <TransplantTab data={data} />}
          {tab === "growth" && <GrowthTab data={data} aiOn={aiOn} />}
          {tab === "biodiversity" && <BiodiversityTab data={data} />}
          {tab === "water" && <WaterTab data={data} aiOn={aiOn} />}
          {tab === "media" && (
            <MediaTab media={data.media} frame={frame} setFrame={setFrame} />
          )}
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