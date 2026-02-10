import DetailInfoModal from "@/components/detail-info/detail-info-modal";

export default async function DetailInfoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <DetailInfoModal areaId={Number(id)} />;
}
