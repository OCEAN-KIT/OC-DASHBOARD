import DetailInfo from "@/components/detail-info/detail-info";

export default async function DetailInfoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <DetailInfo areaId={Number(id)} />;
}
