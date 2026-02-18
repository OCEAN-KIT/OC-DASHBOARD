"use client";

export default function AreaItemCard({
  area,
  color,
  onClick,
  isActive = false,
}) {
  const start =
    Array.isArray(area.startDate) && area.startDate.length >= 3
      ? `${area.startDate[0]}년 ${area.startDate[1]}월 ${area.startDate[2]}일`
      : "-";

  return (
    <button
      onClick={onClick}
      className={[
        "relative w-full rounded-xl border px-3 py-2 text-left transition",
        "cursor-pointer",
        isActive
          ? "border-indigo-200/70 bg-indigo-500/26 shadow-[0_0_0_1px_rgba(199,210,254,0.36),0_10px_18px_rgba(2,6,23,0.35)]"
          : "border-white/15 bg-white/10 hover:border-indigo-300/55 hover:bg-indigo-500/16",
      ].join(" ")}
    >
      <div className="absolute inset-y-2 left-1 w-1 rounded-full bg-indigo-200/45" />
      <div className="ml-2 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span
              className="inline-block h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: color ?? "rgba(248,250,252,0.6)" }}
            />
            <span className="truncate text-[13px] font-semibold text-slate-50">
              {area.name}
            </span>
          </div>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-[10px] tracking-[0.1em] text-indigo-100/55">
            복원 시작일
          </p>
          <p className="text-xs font-medium text-slate-100">{start}</p>
        </div>
      </div>
    </button>
  );
}
