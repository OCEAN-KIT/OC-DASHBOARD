import { getMethodMeta } from "@/constants/method";

type AttachmentStatus = {
  method: string;
  status: string;
};

type Props = {
  statuses: AttachmentStatus[];
};

const STATUS_COLOR: Record<string, { bg: string; text: string }> = {
  양호: { bg: "bg-emerald-500/20", text: "text-emerald-400" },
  보통: { bg: "bg-amber-500/20", text: "text-amber-400" },
  미흡: { bg: "bg-red-500/20", text: "text-red-400" },
};

const fallback = { bg: "bg-white/10", text: "text-white/60" };

export default function AttachmentStatusCard({ statuses }: Props) {
  const hasData = statuses.length > 0;

  return (
    <div className="rounded-xl bg-white/5 p-4 h-full flex flex-col">
      <h3 className="text-[11px] text-white/50 mb-1">착생 상태</h3>
      <p className="text-[10px] text-white/30 mb-3">기준: 이식 단위</p>

      {hasData ? (
        <ul className="flex flex-col gap-2 flex-1">
          {statuses.map((item) => {
            const meta = getMethodMeta(item.method);
            const color = STATUS_COLOR[item.status] ?? fallback;
            return (
              <li key={item.method} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="inline-block w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: meta.color }}
                  />
                  <span className="text-xs text-white/80">{meta.name}</span>
                </div>
                <span
                  className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full ${color.bg} ${color.text}`}
                >
                  {item.status}
                </span>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="flex-1 flex items-center justify-center text-sm text-white/40">
          데이터 없음
        </div>
      )}
    </div>
  );
}
