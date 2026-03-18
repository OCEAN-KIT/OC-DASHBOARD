"use client";
import * as React from "react";
import DetailInfoModal from "@/components/detail-info/detail-info-modal";

export default function Page({ params }) {
  // Next 15 동기 경고 피하려면 React.use()로 언랩
  const { id } = React.use(params);
  return <DetailInfoModal areaId={Number(id)} />;
}
