import "@/components/detail-info/page-bg.css";

export default function DetailInfoRouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="ai-bg-container">
      <div className="ai-bg-layer" aria-hidden />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
