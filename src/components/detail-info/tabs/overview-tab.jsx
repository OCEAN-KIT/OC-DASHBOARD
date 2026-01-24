"use client";
import Image from "next/image";

export default function OverviewTab({ data }) {
  // 데이터에서 마지막 값 기준 간단 KPI
  const attach = data?.growth?.attachment?.at(-1) ?? 0;
  const survival = data?.growth?.survival?.at(-1) ?? 0;
  const growthLast = data?.growth?.growthMM?.at(-1) ?? 0;
  const growthMax = Math.max(...(data?.growth?.growthMM ?? [1]));
  const growthPct = Math.round((growthLast / growthMax) * 100);

  return (
    <section className="grid grid-cols-12 gap-4">
      {/* 좌: 히어로(이미지 + KPI 오버레이) */}
      <div className="col-span-8">
        <div className="relative h-72 rounded-2xl overflow-hidden border border-white/10 bg-white/5">
          <Image
            src="/images/underSea.jpg"
            alt="해역 전경"
            fill
            priority
            className="object-cover"
          />
          {/* 가독성 보정 */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />

          {/* ✅ KPI: 이미지 위 오버레이(하단 고정) */}
          <div className="absolute inset-x-3 bottom-3 grid grid-cols-3 gap-3">
            {/* 착생률 */}
            <div className="rounded-xl border border-white/15 bg-black/35 backdrop-blur-sm p-3">
              <div className="text-[11px] text-white/70">착생률</div>
              <div className="mt-0.5 text-lg font-semibold">{attach}%</div>
              <div className="mt-2 h-1.5 rounded bg-white/10">
                <div
                  className="h-full rounded bg-emerald-400/80"
                  style={{ width: `${Math.min(attach, 100)}%` }}
                />
              </div>
            </div>
            {/* 생존률 */}
            <div className="rounded-xl border border-white/15 bg-black/35 backdrop-blur-sm p-3">
              <div className="text-[11px] text-white/70">생존률</div>
              <div className="mt-0.5 text-lg font-semibold">{survival}%</div>
              <div className="mt-2 h-1.5 rounded bg-white/10">
                <div
                  className="h-full rounded bg-cyan-400/80"
                  style={{ width: `${Math.min(survival, 100)}%` }}
                />
              </div>
            </div>
            {/* 성장률 */}
            <div className="rounded-xl border border-white/15 bg-black/35 backdrop-blur-sm p-3">
              <div className="text-[11px] text-white/70">성장률</div>
              <div className="mt-0.5 text-lg font-semibold">
                {growthLast.toFixed(1)} mm/일
              </div>
              <div className="mt-2 h-1.5 rounded bg-white/10">
                <div
                  className="h-full rounded bg-violet-400/80"
                  style={{ width: `${Math.min(growthPct, 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 우: 이식 해조류 개요(높이 맞춰 빈공간 제거) */}
      <div className="col-span-4">
        <div className="h-72 rounded-2xl border border-white/10 bg-white/5 p-3 flex flex-col">
          <div className="text-sm font-semibold mb-2">이식 해조류 개요</div>
          <div className="min-h-0 overflow-auto pr-1 space-y-2 text-sm">
            {data.transplant.map((it) => (
              <div key={it.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-cyan-300" />
                  <span>{it.name}</span>
                </div>
                <div className="text-white/80">
                  {it.count.toLocaleString()}개체 · {it.area}
                </div>
              </div>
            ))}
          </div>

          {/* 구분선 + 요약 미니 메타 (옵션) */}
          <div className="mt-3 pt-3 border-t border-white/10 grid grid-cols-2 gap-x-3 gap-y-2 text-[11px] text-white/60">
            <div>서식: {data.basic.habitat}</div>
            <div>수심: {data.basic.depth}m</div>
            <div>면적: {data.basic.areaSize}</div>
            <div>단계: {data.basic.stage}</div>
          </div>
        </div>
      </div>

      {/* 반응형: md 이하에선 1열로 자동 스택 */}
      <style jsx global>{`
        @media (max-width: 1024px) {
          section > .col-span-8,
          section > .col-span-4 {
            grid-column: span 12 / span 12 !important;
          }
          section .h-72 {
            height: 16rem !important;
          } /* 좀 더 콤팩트 */
          section .absolute.inset-x-3.bottom-3 {
            position: static !important;
            margin-top: 0.5rem;
          }
        }
      `}</style>
    </section>
  );
}
