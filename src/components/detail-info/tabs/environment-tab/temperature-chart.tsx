import type { ChartData } from "@/app/api/types";
import SvgReveal from "@/components/charts/SvgReveal";

type Props = {
  chart: ChartData;
};

const MAX_MONTHS = 6;
const CHART_COLOR = "#2C67BC";

export default function TemperatureChart({ chart }: Props) {
  const values = chart.values.slice(-MAX_MONTHS);
  const labels = chart.labels.slice(-MAX_MONTHS);
  const hasData = values.length > 0;
  return (
    <div className="rounded-xl bg-white/5 p-4 h-full flex flex-col">
      <div className="flex items-center gap-3 mb-1">
        <h3 className="text-[13px] text-white/60">수온 변화 추이</h3>
        <div className="ml-auto text-right">
          {chart.period && (
            <span className="text-[12px] text-white/40">{chart.period}</span>
          )}
        </div>
      </div>
      <p className="text-[12px] text-white/35 mb-1">월별 평균 수온</p>

      {hasData ? (
        <div className="flex-1 min-h-0 flex">
          <LineChart values={values} labels={labels} unit={chart.unit} />
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-sm text-white/40">
          수온 데이터가 없습니다.
        </div>
      )}
    </div>
  );
}

function LineChart({
  values,
  labels,
  unit,
}: {
  values: number[];
  labels: string[];
  unit: string;
}) {
  const W = 620;
  const H = 140;
  const PX = 32;
  const PY = 20;
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);
  const range = maxVal - minVal || 1;

  const points = values.map((v, i) => {
    const x =
      values.length === 1
        ? W / 2
        : PX + (i / (values.length - 1)) * (W - PX * 2);
    const y = PY + (1 - (v - minVal) / range) * (H - PY * 2);
    return { x, y, v };
  });

  const linePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`)
    .join(" ");

  const gradientId = "temp-gradient";
  const areaPath = `${linePath} L${points[points.length - 1].x},${H - PY} L${points[0].x},${H - PY} Z`;

  const formatLabel = (label: string | number[]) => {
    if (Array.isArray(label)) {
      const year = String(label[0]);
      const month = label[1] != null ? String(label[1]).padStart(2, "0") : null;
      const day = label[2] != null ? String(label[2]).padStart(2, "0") : null;
      if (month && day) return `${year}년 ${month}월 ${day}일`;
      if (month) return `${year}년 ${month}월`;
      return `${year}년`;
    }
    return String(label);
  };

  const displayUnit = unit || "℃";

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full mt-1">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={CHART_COLOR} stopOpacity={0.25} />
          <stop offset="100%" stopColor={CHART_COLOR} stopOpacity={0} />
        </linearGradient>
      </defs>

      {/* 가로 기준선 */}
      <line
        x1={PX}
        y1={H - PY}
        x2={W - PX}
        y2={H - PY}
        stroke="rgba(255,255,255,0.1)"
        strokeWidth={0.5}
      />

      <SvgReveal width={W} height={H}>
        {/* 영역 그라데이션 */}
        {points.length > 1 && (
          <path d={areaPath} fill={`url(#${gradientId})`} />
        )}

        {/* 선 */}
        <path
          d={linePath}
          fill="none"
          stroke={CHART_COLOR}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* 데이터 포인트 */}
        {points.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r={3.5} fill={CHART_COLOR} />
            <circle cx={p.x} cy={p.y} r={2} fill="#0d1117" />
            <text
              x={p.x}
              y={p.y - 9}
              textAnchor="middle"
              className="fill-white/70"
              fontSize={11}
            >
              {p.v}
              {displayUnit}
            </text>
          </g>
        ))}
      </SvgReveal>

      {/* x축 라벨 */}
      {points.map((p, i) => (
        <text
          key={`label-${i}`}
          x={p.x}
          y={H - 4}
          textAnchor="middle"
          className="fill-white/40"
          fontSize={10}
        >
          {formatLabel(labels[i])}
        </text>
      ))}
    </svg>
  );
}
