import type { AreaDetails } from "@/app/api/types";
import EnvironmentSummaryCard from "./environment-summary-card";
import TemperatureChart from "./temperature-chart";

type Props = {
  data: AreaDetails;
};

export default function EnvironmentTab({ data }: Props) {
  const { environment } = data;

  return (
    <section className="grid grid-cols-4 gap-4 max-md:grid-cols-2">
      {/* 1행: 환경 등급 요약 4열 (시야 / 조류 / 서지 / 파도) */}
      <EnvironmentSummaryCard summary={environment.last3MonthsSummary} />

      {/* 2행: 수온 시계열 그래프 */}
      <div className="col-span-4 h-[220px] max-md:col-span-2">
        <TemperatureChart chart={environment.temperatureChart} />
      </div>
    </section>
  );
}
