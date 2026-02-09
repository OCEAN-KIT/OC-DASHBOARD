import type { ChartData } from "@/app/api/types";
import SvgReveal from "@/components/charts/SvgReveal";

type Props = {
  chart: ChartData;
};

const CHART_COLOR = "#2C67BC";

export default function RecentWorkChart({ chart }: Props) {
  const values = chart.values.slice(-3);
  const labels = chart.labels.slice(-3);
  const hasData = values.length > 0 && values.some((v) => v > 0);

  return (
    <div className="rounded-xl bg-white/5 p-4 h-full flex flex-col">
      <div className="flex items-center gap-3 mb-1">
        <h3 className="text-[11px] text-white/50">최근 3개월 작업횟수</h3>
        {chart.period && (
          <span className="text-[10px] text-white/30">{chart.period}</span>
        )}
      </div>
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
function LineChart({ values, labels }: { values: number[]; labels: number[][] }) {
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

  const gradientId = "recent-work-gradient";
  const areaPath = `${linePath} L${points[points.length - 1].x},${H - PY} L${points[0].x},${H - PY} Z`;

  const formatLabel = (label: number[]) => `${label[1]}월`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full mt-1">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={CHART_COLOR} stopOpacity={0.25} />
          <stop offset="100%" stopColor={CHART_COLOR} stopOpacity={0} />
        </linearGradient>
      </defs>

      <line
        x1={PX}
        y1={H - PY}
        x2={W - PX}
        y2={H - PY}
        stroke="rgba(255,255,255,0.1)"
        strokeWidth={0.5}
      />

      <SvgReveal width={W} height={H}>
        {points.length > 1 && <path d={areaPath} fill={`url(#${gradientId})`} />}

        <path
          d={linePath}
          fill="none"
          stroke={CHART_COLOR}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {points.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r={3.5} fill={CHART_COLOR} />
            <circle cx={p.x} cy={p.y} r={2} fill="#0d1117" />
            <text
              x={p.x}
              y={p.y - 8}
              textAnchor="middle"
              className="fill-white/70"
              fontSize={9}
            >
              {p.v}회
            </text>
          </g>
        ))}
      </SvgReveal>

      {points.map((p, i) => (
        <text
          key={`label-${i}`}
          x={p.x}
          y={H - 2}
          textAnchor="middle"
          className="fill-white/40"
          fontSize={8}
        >
          {formatLabel(labels[i])}
        </text>
      ))}
    </svg>
  );
}
