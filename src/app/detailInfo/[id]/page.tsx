import DetailInfo from "@/components/detail-info/detail-info";
import React from "react";

export default function DetailInfoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);
  return <DetailInfo areaId={Number(id)} />;
}
