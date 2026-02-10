import { useEffect, useRef, useState } from "react";
import type { AreaDetails } from "@/app/api/types";
import { STAGE_META, STAGE_ORDER, type StageName } from "@/constants/stageMeta";
import { MapPin, Ruler, Waves, Shell, Calendar, Activity } from "lucide-react";

type Props = {
  data: AreaDetails;
};

/* ── Bento card wrapper ── */
function Card({
  children,
  className = "",
  deco,
}: {
  children: React.ReactNode;
  className?: string;
  deco?: React.ReactNode;
}) {
  return (
    <div
      className={`relative rounded-2xl border border-white/10 bg-white/6 p-5 transition-colors hover:bg-white/9 ${className}`}
    >
      {deco && (
        <div className="absolute inset-0 overflow-hidden rounded-2xl">
          {deco}
        </div>
      )}
      <div className="relative z-[1]">{children}</div>
    </div>
  );
}

function CardLabel({
  icon: Icon,
  label,
  suffix,
}: {
  icon: React.ElementType;
  label: string;
  suffix?: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-1.5 mb-3">
      <Icon className="h-3.5 w-3.5 text-white/35" />
      <span className="text-[11px] font-medium text-white/35 uppercase tracking-wider">
        {label}
      </span>
      {suffix}
    </div>
  );
}

function StageTooltip() {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent | TouchEvent) => {
      if (!rootRef.current) return;
      const target = e.target as Node;
      if (!rootRef.current.contains(target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("touchstart", onDoc, { passive: true });
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("touchstart", onDoc);
    };
  }, [open]);

  return (
    <span ref={rootRef} className="relative group inline-flex ml-1">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-white/20 text-[10px] text-white/50 cursor-help"
        aria-label="현재 단계 도움말"
      >
        ?
      </button>

      <span
        className={[
          "pointer-events-none absolute bottom-full left-0 mb-2 w-56 rounded-lg border border-white/15 bg-black/80 backdrop-blur-md p-2.5 text-xs opacity-0 transition-opacity z-50",
          "max-md:bottom-auto max-md:top-full max-md:mt-2 max-md:mb-0",
          "group-hover:pointer-events-auto group-hover:opacity-100",
          open ? "pointer-events-auto opacity-100" : "",
        ].join(" ")}
      >
        <ul className="space-y-1.5">
          {STAGE_ORDER.map((stage) => {
            const meta = STAGE_META[stage];
            return (
              <li key={stage} className="flex items-start gap-1.5">
                <span
                  className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full"
                  style={{ backgroundColor: meta.color }}
                />
                <span>
                  <span className="font-medium text-white/90">{stage}</span>
                  <span className="text-white/50">: {meta.description}</span>
                </span>
              </li>
            );
          })}
        </ul>
      </span>
    </span>
  );
}

/* ── Decorations ── */

function WaveDeco() {
  return (
    <svg
      className="absolute bottom-0 left-0 w-full opacity-[0.07]"
      viewBox="0 0 200 40"
      preserveAspectRatio="none"
      style={{ height: "60%" }}
    >
      <path fill="currentColor" className="text-sky-400">
        <animate
          attributeName="d"
          dur="4s"
          repeatCount="indefinite"
          values="
            M0,28 C30,20 70,35 100,25 C130,15 170,30 200,22 L200,40 L0,40 Z;
            M0,25 C30,33 70,18 100,28 C130,38 170,20 200,27 L200,40 L0,40 Z;
            M0,28 C30,20 70,35 100,25 C130,15 170,30 200,22 L200,40 L0,40 Z
          "
        />
      </path>
      <path fill="currentColor" className="text-sky-300">
        <animate
          attributeName="d"
          dur="5s"
          repeatCount="indefinite"
          values="
            M0,32 C40,26 80,36 120,30 C160,24 190,34 200,28 L200,40 L0,40 Z;
            M0,29 C40,35 80,25 120,33 C160,38 190,26 200,31 L200,40 L0,40 Z;
            M0,32 C40,26 80,36 120,30 C160,24 190,34 200,28 L200,40 L0,40 Z
          "
        />
      </path>
    </svg>
  );
}

function GridDeco() {
  return (
    <svg
      className="absolute bottom-1 right-1 opacity-[0.06]"
      width="80"
      height="80"
      viewBox="0 0 80 80"
    >
      {Array.from({ length: 16 }).map((_, i) => (
        <rect
          key={i}
          x={(i % 4) * 20 + 4}
          y={Math.floor(i / 4) * 20 + 4}
          width="12"
          height="12"
          rx="2"
          fill="currentColor"
          className="text-white"
        />
      ))}
    </svg>
  );
}

function PinRippleDeco() {
  return (
    <div className="absolute -bottom-4 -right-4 h-24 w-24 opacity-[0.06]">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="absolute inset-0 rounded-full border border-white"
          style={{
            transform: `scale(${0.4 + i * 0.3})`,
          }}
        />
      ))}
    </div>
  );
}

function ShellDeco() {
  return (
    <svg
      className="absolute -bottom-2 -right-2 opacity-[0.05]"
      width="72"
      height="72"
      viewBox="0 0 72 72"
    >
      {[20, 28, 36].map((r) => (
        <circle
          key={r}
          cx="52"
          cy="52"
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          className="text-white"
        />
      ))}
    </svg>
  );
}

function TimelineDeco() {
  return (
    <div className="absolute top-1/2 left-0 w-full -translate-y-1/2 flex justify-between px-12 opacity-[0.05]">
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          className="h-6 w-px bg-white"
          style={{ height: i % 3 === 0 ? "24px" : "12px" }}
        />
      ))}
    </div>
  );
}

/* ── Stage progress stepper ── */
function StageStepper({ current }: { current: string }) {
  const currentIdx = STAGE_ORDER.indexOf(current as StageName);

  return (
    <div className="flex items-center gap-0 mt-4">
      {STAGE_ORDER.map((stage, i) => {
        const meta = STAGE_META[stage];
        const isActive = i <= currentIdx;
        const isCurrent = i === currentIdx;

        return (
          <div key={stage} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className="relative flex h-7 w-7 items-center justify-center rounded-full border-2 transition-all"
                style={{
                  borderColor: isActive ? meta.color : "rgba(255,255,255,.12)",
                  backgroundColor: isCurrent
                    ? meta.color
                    : isActive
                      ? `${meta.color}20`
                      : "transparent",
                  boxShadow: isCurrent ? `0 0 12px ${meta.color}50` : "none",
                }}
              >
                {isCurrent && (
                  <div
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: "#fff" }}
                  />
                )}
                {isActive && !isCurrent && (
                  <div
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: meta.color }}
                  />
                )}
              </div>
              <span
                className="text-[10px] font-medium whitespace-nowrap"
                style={{
                  color: isCurrent
                    ? meta.color
                    : isActive
                      ? "rgba(255,255,255,.6)"
                      : "rgba(255,255,255,.25)",
                }}
              >
                {stage}
              </span>
            </div>
            {i < STAGE_ORDER.length - 1 && (
              <div
                className="h-0.5 flex-1 mx-1.5 rounded-full"
                style={{
                  backgroundColor:
                    i < currentIdx ? meta.color : "rgba(255,255,255,.08)",
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function OverviewTab({ data }: Props) {
  const { overview } = data;
  const nf = new Intl.NumberFormat("ko-KR");

  const startStr = `${overview.startDate[0]}년 ${overview.startDate[1]}월 ${overview.startDate[2]}일`;
  const endStr = overview.endDate
    ? `${overview.endDate[0]}년 ${overview.endDate[1]}월 ${overview.endDate[2]}일`
    : "진행 중";

  return (
    <section className="grid grid-cols-3 gap-3 max-md:grid-cols-2">
      {/* ─ 현재 단계 (2col) ─ */}
      <Card className="col-span-2 max-md:col-span-2">
        <CardLabel icon={Activity} label="현재 단계" suffix={<StageTooltip />} />
        <p className="text-xl font-semibold">
          {overview.currentStatus.name}
          <span className="ml-2 text-sm font-normal text-white/40">
            {overview.currentStatus.description}
          </span>
        </p>
        <StageStepper current={overview.currentStatus.name} />
      </Card>

      {/* ─ 면적 ─ */}
      <Card deco={<GridDeco />}>
        <CardLabel icon={Ruler} label="면적" />
        <p className="text-2xl font-semibold tabular-nums">
          {nf.format(overview.areaSize)}
          <span className="ml-1 text-sm font-normal text-white/40">
            m<sup>2</sup>
          </span>
        </p>
      </Card>

      {/* ─ 지역 ─ */}
      <Card deco={<PinRippleDeco />}>
        <CardLabel icon={MapPin} label="지역" />
        <p className="text-lg font-semibold">{overview.restorationRegion}</p>
      </Card>

      {/* ─ 평균 수심 ─ */}
      <Card deco={<WaveDeco />}>
        <CardLabel icon={Waves} label="평균 수심" />
        <p className="text-2xl font-semibold tabular-nums">
          {overview.avgDepth}
          <span className="ml-1 text-sm font-normal text-white/40">m</span>
        </p>
      </Card>

      {/* ─ 해역 유형 ─ */}
      <Card deco={<ShellDeco />}>
        <CardLabel icon={Shell} label="해역 유형" />
        <p className="text-lg font-semibold">{overview.habitatType}</p>
      </Card>

      {/* ─ 관측 기간 (3col) ─ */}
      <Card className="col-span-3 max-md:col-span-2" deco={<TimelineDeco />}>
        <CardLabel icon={Calendar} label="관측 기간" />
        <div className="flex items-center gap-3">
          <span className="text-lg font-semibold tabular-nums">{startStr}</span>
          <span className="h-0.5 w-8 rounded-full bg-white/20" />
          <span className="text-lg font-semibold tabular-nums">{endStr}</span>
        </div>
      </Card>
    </section>
  );
}
