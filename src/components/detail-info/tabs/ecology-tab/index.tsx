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
    <section className="grid grid-cols-6 gap-4">
      {/* 1행 1열: 착생 상태 */}
      <div className="col-span-3 h-[220px]">
        <AttachmentStatusCard statuses={ecology.attachmentStatuses} />
      </div>

      {/* 1행 2열: 생존 상태 */}
      <div className="col-span-3 h-[220px]">
        <SurvivalStatusCard status={ecology.areaAttachmentStatus} />
      </div>

      {/* 2행: 대표 개체 성장 추이 */}
      <div className="col-span-6 h-[220px]">
        <GrowthChart chart={ecology.representativeGrowthChart} />
      </div>
    </section>
  );
}
