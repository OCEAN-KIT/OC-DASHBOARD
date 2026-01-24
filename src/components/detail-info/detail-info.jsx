"use client";

import { useEffect, useMemo, useState } from "react";
import { PuffLoader } from "react-spinners";
import { fetchAreaDetail } from "@/api/dashboard";
import { mapAreaDetailToViewModel } from "@/utils/mappers/dashboardMapper";
import TransplantTab from "./tabs/transplant-tab";
import GrowthTab from "./tabs/growth-tab";
import BiodiversityTab from "./tabs/bio-diversity-tab";
import WaterTab from "./tabs/water-tab";

export default function DetailInfo({ areaId }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const apiResponse = await fetchAreaDetail(areaId);
        const viewModel = mapAreaDetailToViewModel(apiResponse.data);
        setData(viewModel);
      } catch (err) {
        console.error(err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    if (areaId) loadData();
  }, [areaId]);

  const headerInfo = useMemo(() => {
    const b = data?.basic;
    if (!b) return "로딩 중...";
    return `복원 시작일 ${b.startDate} · ${b.habitat} · ${b.depth}m · 면적 ${b.areaSize}`;
  }, [data]);

  if (loading) {
    return (
      <div className="min-h-screen bg-transparent text-white flex items-center justify-center">
        <PuffLoader color="#36d7b7" size={60} />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-transparent text-white flex items-center justify-center">
        <div className="rounded-xl border border-white/15 bg-white/10 px-6 py-5 backdrop-blur-md">
          <div className="text-sm">데이터를 불러올 수 없습니다. (ID: {areaId})</div>
          <a
            href="/"
            className="mt-4 inline-flex items-center rounded-md border border-white/10 bg-white/10 px-3 py-2 text-sm hover:bg-white/15"
          >
            지도 보기로 돌아가기
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent text-white">
      {/* 헤더 */}
      <div className="sticky top-0 z-20 backdrop-blur-lg bg-black/25 border-b border-white/10">
        <div className="mx-auto max-w-6xl px-5 py-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-xl font-semibold">
                작업 영역 상세 (ID: {areaId})
              </div>
              <div className="text-xs text-white/70">{headerInfo}</div>
            </div>

            <a
              href="/"
              className="h-8 px-3 rounded-md text-sm border border-white/10 bg-white/10 hover:bg-white/15 flex items-center"
            >
              지도 보기로 돌아가기
            </a>
          </div>
        </div>
      </div>

      {/* 본문 */}
      <main className="mx-auto max-w-6xl px-5 py-6 space-y-8">
        <section>
          <h2 className="mb-3 text-lg font-semibold">이식 해조류</h2>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <TransplantTab data={data} />
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold">성장</h2>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <GrowthTab data={data} />
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold">생물다양성</h2>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <BiodiversityTab data={data} />
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold">수질</h2>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <WaterTab data={data} />
          </div>
        </section>

        <div className="h-8" />
      </main>
    </div>
  );
}