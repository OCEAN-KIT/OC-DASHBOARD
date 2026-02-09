import type { ChartData } from "@/app/api/types";

type Props = {
  chart: ChartData;
};

export default function RecentWorkChart({ chart }: Props) {
  const values = chart.values.slice(-3);
  const labels = chart.labels.slice(-3);
  const hasData = values.length > 0 && values.some((v) => v > 0);

  return (
    <div className="rounded-xl bg-white/5 p-4 h-full flex flex-col">
      <h3 className="text-[11px] text-white/50 mb-2">최근 3개월 작업횟수</h3>
      {hasData ? (
        <div className="flex-1 min-h-0 flex ">
          <LineChart values={values} labels={labels} />
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-sm text-white/40">
          최근 작업이 없습니다.
        </div>
      )}
    </div>
  );
}

/* SVG 꺽은선 그래프 */
function LineChart({ values, labels }: { values: number[]; labels: string[] }) {
  const W = 280;
  const H = 100;
  const PX = 24;
  const PY = 15;
  const maxVal = Math.max(...values, 1);

  const points = values.map((v, i) => {
    const x =
      values.length === 1
        ? W / 2
        : PX + (i / (values.length - 1)) * (W - PX * 2);
    const y = PY + (1 - v / maxVal) * (H - PY * 2);
    return { x, y, v };
  });

  const linePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`)
    .join(" ");

  const formatLabel = (label: string | number[]) => {
    if (Array.isArray(label)) {
      return `${Number(label[1])}월`;
    }
    if (typeof label === "string" && label.includes("-")) {
      return `${Number(label.split("-")[1])}월`;
    }
    if (typeof label === "string" && label.includes("/")) {
      return `${Number(label.split("/")[0])}월`;
    }
    return String(label);
  };

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full mt-2">
      <line
        x1={PX}
        y1={H - PY}
        x2={W - PX}
        y2={H - PY}
        stroke="rgba(255,255,255,0.1)"
        strokeWidth={0.5}
      />

      <path
        d={linePath}
        fill="none"
        stroke="#38bdf8"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {points.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r={3} fill="#38bdf8" />
          <text
            x={p.x}
            y={p.y - 8}
            textAnchor="middle"
            className="fill-white/70"
            fontSize={9}
          >
            {p.v}회
          </text>
          <text
            x={p.x}
            y={H - 2}
            textAnchor="middle"
            className="fill-white/40"
            fontSize={8}
          >
            {formatLabel(labels[i])}
          </text>
        </g>
      ))}
    </svg>
  );
}
