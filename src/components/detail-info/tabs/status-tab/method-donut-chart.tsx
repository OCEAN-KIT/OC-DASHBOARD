import type { AreaDetails } from "@/app/api/types";
import { getMethodMeta } from "@/constants/method";

type Props = {
  distribution: AreaDetails["status"]["methodDistribution"];
};

export default function MethodDonutChart({ distribution }: Props) {
  const entries = Object.entries(distribution);
  const total = entries.reduce((sum, [, v]) => sum + v, 0);

  const SIZE = 140;
  const CENTER = SIZE / 2;
  const RADIUS = 62;
  const INNER = 38;
  const arcs = entries.map(([method, value]) => {
    const meta = getMethodMeta(method);
    return {
      method,
      value,
      pct: total > 0 ? value / total : 0,
      color: meta.color,
      name: meta.name,
    };
  });

  let cumAngle = -Math.PI / 2;
  const paths = arcs.map((arc) => {
    const angle = arc.pct * Math.PI * 2;
    const startAngle = cumAngle;
    const endAngle = cumAngle + angle;
    cumAngle = endAngle;

    const x1 = CENTER + RADIUS * Math.cos(startAngle);
    const y1 = CENTER + RADIUS * Math.sin(startAngle);
    const x2 = CENTER + RADIUS * Math.cos(endAngle);
    const y2 = CENTER + RADIUS * Math.sin(endAngle);

    const ix1 = CENTER + INNER * Math.cos(endAngle);
    const iy1 = CENTER + INNER * Math.sin(endAngle);
    const ix2 = CENTER + INNER * Math.cos(startAngle);
    const iy2 = CENTER + INNER * Math.sin(startAngle);

    const large = angle > Math.PI ? 1 : 0;

    const d = [
      `M${x1},${y1}`,
      `A${RADIUS},${RADIUS} 0 ${large} 1 ${x2},${y2}`,
      `L${ix1},${iy1}`,
      `A${INNER},${INNER} 0 ${large} 0 ${ix2},${iy2}`,
      "Z",
    ].join(" ");

    return { ...arc, d, startAngle, endAngle };
  });

  return (
    <div className="rounded-xl bg-white/5 p-4 h-full flex flex-col">
      <div className="flex items-center gap-3 mb-1">
        <h3 className="text-[11px] text-white/50">이식 방식별 분포</h3>
      </div>
      <span className="text-[10px] text-white/30">기준: 이식 단위</span>

      {total > 0 ? (
        <div className="flex-1 min-h-0 flex items-center justify-center">
          <div className="flex items-center gap-6">
            <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="w-46 h-46 shrink-0">
              <defs>
                <filter
                  id="donut-soft-shadow"
                  x="-30%"
                  y="-30%"
                  width="160%"
                  height="160%"
                >
                  <feDropShadow
                    dx="0"
                    dy="3"
                    stdDeviation="4"
                    floodOpacity="0.28"
                  />
                </filter>
                <radialGradient id="donut-inner-glow" cx="50%" cy="50%" r="60%">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.18)" />
                  <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                </radialGradient>
                <radialGradient id="donut-center" cx="50%" cy="45%" r="80%">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.18)" />
                  <stop offset="55%" stopColor="rgba(44,103,188,0.18)" />
                  <stop offset="100%" stopColor="rgba(13,17,23,0.85)" />
                </radialGradient>
                <linearGradient id="donut-spark" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.0)" />
                  <stop offset="55%" stopColor="rgba(255,255,255,0.22)" />
                  <stop offset="100%" stopColor="rgba(255,255,255,0.0)" />
                </linearGradient>
              </defs>

              {paths.map((p) => (
                <g key={p.method} filter="url(#donut-soft-shadow)">
                  <path d={p.d} fill={p.color} />
                  {/* top sheen */}
                  <path
                    d={p.d}
                    fill="none"
                    stroke="rgba(255,255,255,0.25)"
                    strokeWidth={1}
                  />
                </g>
              ))}

              {/* separators */}
              {paths.length > 1 &&
                paths.map((p, i) => {
                  const angle = p.endAngle;
                  const x1 = CENTER + INNER * Math.cos(angle);
                  const y1 = CENTER + INNER * Math.sin(angle);
                  const x2 = CENTER + RADIUS * Math.cos(angle);
                  const y2 = CENTER + RADIUS * Math.sin(angle);
                  return (
                    <line
                      key={`${p.method}-sep-${i}`}
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke="rgba(13,17,23,0.6)"
                      strokeWidth={1}
                    />
                  );
                })}

              {/* inner glow ring */}
              <circle
                cx={CENTER}
                cy={CENTER}
                r={INNER + 1}
                fill="url(#donut-inner-glow)"
              />

              <text
                x={CENTER}
                y={CENTER}
                textAnchor="middle"
                className="fill-white/90"
                fontSize={16}
                fontWeight="bold"
              >
                100
              </text>
              <text
                x={CENTER}
                y={CENTER + 14}
                textAnchor="middle"
                className="fill-white/50"
                fontSize={9}
              >
                전체
              </text>
            </svg>

            <div className="flex flex-col gap-2 text-xs">
              {arcs.map((a) => {
                return (
                  <div key={a.method} className="flex items-center gap-2">
                    <span
                      className="h-2 w-2 shrink-0 rounded-full"
                      style={{ backgroundColor: a.color }}
                    />
                    <span className="text-xs text-white/80">{a.name}</span>
                    <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-white/5 text-white/60">
                      {Math.round(a.pct * 100)}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-sm text-white/40">
          데이터가 없습니다.
        </div>
      )}
    </div>
  );
}
