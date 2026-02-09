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

    return { ...arc, d };
  });

  return (
    <div className="rounded-xl bg-white/5 p-4 h-full flex flex-col">
      <h3 className="text-[11px] text-white/50 mb-2">이식 방식별 분포</h3>

      {total > 0 ? (
        <div className="flex-1 min-h-0 flex items-center justify-center">
          <div className="flex items-center gap-6">
            <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="w-46 h-46 shrink-0">
              {paths.map((p) => (
                <path key={p.method} d={p.d} fill={p.color} />
              ))}

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

            <div className="flex flex-col gap-1.5 text-xs">
              {arcs.map((a) => {
                return (
                  <div key={a.method} className="flex items-center gap-1.5">
                    <span
                      className="h-2 w-2 shrink-0 rounded-full"
                      style={{ backgroundColor: a.color }}
                    />
                    <span className="text-white/70">
                      {a.name}{" "}
                      <span className="text-white/50">
                        ({Math.round(a.pct * 100)}%)
                      </span>
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
