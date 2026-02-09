import type { AreaDetails } from "@/app/api/types";
import { STAGE_META, STAGE_ORDER } from "@/constants/stageMeta";

type Props = {
  data: AreaDetails;
};

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between py-2 border-b border-white/5 last:border-0">
      <span className="text-white/50 text-sm">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  );
}

function StageTooltip() {
  return (
    <span className="relative group inline-flex ml-1">
      <span className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-white/20 text-[10px] text-white/50 cursor-help">
        !
      </span>
      <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 rounded-lg border border-white/15 bg-black/80 backdrop-blur-md p-2.5 text-xs opacity-0 transition-opacity group-hover:pointer-events-auto group-hover:opacity-100 z-10">
        <ul className="space-y-1.5">
          {STAGE_ORDER.map((stage) => (
            <li key={stage} className="flex items-start gap-1.5">
              <span
                className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full"
                style={{ backgroundColor: STAGE_META[stage].color }}
              />
              <span>
                <span className="font-medium text-white/90">{stage}</span>
                <span className="text-white/50">
                  : {STAGE_META[stage].description}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </span>
    </span>
  );
}

export default function OverviewTab({ data }: Props) {
  const { overview } = data;

  const period = overview.endDate
    ? `${overview.startDate[0]}년 ${overview.startDate[1]}월 ${overview.startDate[2]}일 ~ ${overview.endDate}`
    : `${overview.startDate[0]}년 ${overview.startDate[1]}월 ${overview.startDate[2]}일 ~ 관측 진행 중`;

  return (
    <section className="grid grid-cols-2 gap-4">
      <div className="rounded-xl  bg-white/5 px-4 py-1">
        <Row label="지역" value={overview.restorationRegion} />
        <Row label="관측 기간" value={period} />
        <Row
          label="현재 단계"
          value={
            <span className="inline-flex items-center">
              {overview.currentStatus.name}
              <StageTooltip />
            </span>
          }
        />
      </div>
      <div className="rounded-xl  bg-white/5 px-4 py-1">
        <Row label="면적" value={`${overview.areaSize.toLocaleString()} ㎡`} />
        <Row label="평균 수심" value={`${overview.avgDepth} m`} />
        <Row label="해역 유형" value={overview.habitatType} />
      </div>
    </section>
  );
}
