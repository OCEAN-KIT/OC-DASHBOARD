import type { AreaDetails } from "@/app/api/types";
import AttachmentStatusCard from "./attachment-status-card";
import SurvivalStatusCard from "./survival-status-card";
import GrowthChart from "./growth-chart";

type Props = {
  data: AreaDetails;
};

export default function EcologyTab({ data }: Props) {
  const { ecology } = data;

  return (
    <section className="grid grid-cols-6 gap-4 max-md:grid-cols-1">
      {/* 1행 1열: 착생 상태 */}
      <div className="col-span-3 h-[220px] max-md:col-span-1">
        <AttachmentStatusCard statuses={ecology.attachmentStatuses} />
      </div>

      {/* 1행 2열: 생존 상태 */}
      <div className="col-span-3 h-[220px] max-md:col-span-1">
        <SurvivalStatusCard status={ecology.areaAttachmentStatus} />
      </div>

      {/* 2행: 대표 개체 성장 추이 */}
      <div className="col-span-6 h-[220px] max-md:col-span-1">
        <GrowthChart chart={ecology.representativeGrowthChart} />
      </div>
    </section>
  );
}
