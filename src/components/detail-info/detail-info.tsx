"use client";

import Link from "next/link";
import Header from "./header";
import OverviewTab from "./tabs/overview-tab";
import StatusTab from "./tabs/status-tab";
import EcologyTab from "./tabs/ecology-tab";
import EnvironmentTab from "./tabs/environment-tab";
import PhotosTab from "./tabs/photos-tab";
import { useAreaDetails } from "@/hooks/useAreas";

type Props = {
  areaId: number;
};

export default function DetailInfo({ areaId }: Props) {
  const { data: area, isLoading, isError } = useAreaDetails(areaId);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-transparent text-white flex items-center justify-center px-4">
        <div className="rounded-xl border border-white/20 bg-slate-900/70 px-4 py-3 text-sm text-slate-100 oc-glass-subtle">
          로딩 중...
        </div>
      </div>
    );
  }

  if (isError || !area) {
    return (
      <div className="min-h-screen bg-transparent text-white flex items-center justify-center px-4">
        <div className="rounded-xl px-6 py-5 oc-detail-shell">
          <div className="text-sm">데이터가 없습니다. (ID: {areaId})</div>
          <Link
            href="/"
            className="mt-4 inline-flex items-center rounded-md border border-white/20 bg-white/10 px-3 py-2 text-sm hover:bg-indigo-500/20"
          >
            지도 보기로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent text-white">
      <div className="mx-auto max-w-[820px] px-5 py-6 space-y-6">
        <Header overview={area.overview} onClose={() => history.back()} />

        <OverviewTab data={area} />
        <StatusTab data={area} />
        <EcologyTab data={area} />
        <EnvironmentTab data={area} />
        <PhotosTab data={area} />
      </div>
    </div>
  );
}
