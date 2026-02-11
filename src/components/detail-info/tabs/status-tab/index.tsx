import type { AreaDetails } from "@/app/api/types";
import SpeciesTable from "./species-table";
import MethodDonutChart from "./method-donut-chart";
import RecentWorkChart from "./recent-work-chart";
import StatCard from "./stat-card";

type Props = {
  data: AreaDetails;
};

export default function StatusTab({ data }: Props) {
  const { status } = data;
  const nf = new Intl.NumberFormat("ko-KR");

  return (
    <section className="grid grid-cols-6 gap-4 max-md:grid-cols-2">
      {/* 1행 1열: 종별 현황 */}
      <div className="col-span-3 h-[260px] max-md:col-span-2">
        <SpeciesTable list={status.speciesList} />
      </div>

      {/* 1행 2열: 방식별 분포 도넛 */}
      <div className="col-span-3 h-[260px] max-md:col-span-2">
        <MethodDonutChart distribution={status.methodDistribution} />
      </div>

      {/* 2행 1열: 총이식면적 */}
      <div className="col-span-1 h-[180px]">
        <StatCard
          label="총 이식 면적"
          value={nf.format(status.accumulated.totalAreaSize)}
          unit="㎡"
        />
      </div>

      {/* 2행 2열: 누적작업횟수 */}
      <div className="col-span-1 h-[180px]">
        <StatCard
          label="누적 작업 횟수"
          value={nf.format(status.accumulated.totalWorkCount)}
          unit="회"
        />
      </div>

      {/* 2행 3열: 최근작업일 */}
      <div className="col-span-1 h-[180px] max-md:col-span-2">
        <StatCard
          label="최근 작업일"
          value={(() => {
            const ymd = status.accumulated.lastWorkDate;
            if (!ymd || ymd.length < 3 || !ymd[0] || !ymd[1] || !ymd[2])
              return "-";
            return (
              <span className="text-2xl text-right leading-tight block">
                {ymd[0]}년<br />
                {ymd[1]}월 {ymd[2]}일
              </span>
            );
          })()}
        />
      </div>

      {/* 2행 4열: 최근 3개월 그래프 */}
      <div className="col-span-3 h-[180px] max-md:col-span-2">
        <RecentWorkChart chart={status.workHistoryChart} />
      </div>
    </section>
  );
}
