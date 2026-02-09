"use client";

import { useMemo } from "react";
import { AREA_DETAILS } from "@/constants/areaDetails";
import TransplantTab from "./tabs/transplant-tab";
import GrowthTab from "./tabs/growth-tab";
import BiodiversityTab from "./tabs/bio-diversity-tab";
import WaterTab from "./tabs/water-tab";
import { useAreaDetails } from "@/hooks/useAreas";

export default function DetailInfo({ areaId }) {
  const { data: area, isLoading, isError } = useAreaDetails(areaId);

  if (!isError) {
    return (
      <div className="min-h-screen bg-transparent text-white flex items-center justify-center">
        <div className="rounded-xl border border-white/15 bg-white/10 px-6 py-5 backdrop-blur-md">
          <div className="text-sm">데이터가 없습니다. (ID: {areaId})</div>
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

            <div className="flex items-center gap-2">
              <a
                href="/"
                className="h-8 px-3 rounded-md text-sm border border-white/10 bg-white/10 hover:bg-white/15 flex items-center"
              >
                지도 보기로 돌아가기
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* 본문 */}
      <main className="mx-auto max-w-6xl px-5 py-6 space-y-8">
        <section>
          <h2 className="mb-3 text-lg font-semibold">이식 해조류</h2>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <TransplantTab data={area} />
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold">성장</h2>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <GrowthTab data={area} />
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold">생물다양성</h2>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <BiodiversityTab data={area} />
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold">수질</h2>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <WaterTab data={area} />
          </div>
        </section>

        <div className="h-8" />
      </main>
    </div>
  );
}
