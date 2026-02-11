export const TABS = [
  { key: "overview", label: "개요" },
  { key: "status", label: "현황" },
  { key: "ecology", label: "생태 반응" },
  { key: "environment", label: "환경" },
  { key: "photos", label: "사진" },
] as const;

export type TabKey = (typeof TABS)[number]["key"];

type Props = {
  active: TabKey;
  onChange: (key: TabKey) => void;
};

export default function TabsBar({ active, onChange }: Props) {
  return (
    <div className="relative">
      <div className="flex items-center gap-2 px-5 pt-4 max-md:pt-3 max-md:px-4 max-md:overflow-x-auto max-md:whitespace-nowrap scrollbar-hide">
        {TABS.map((t) => {
          const on = active === t.key;
          return (
            <button
              key={t.key}
              onClick={() => onChange(t.key)}
              className={[
                "h-8 px-3 rounded-xl text-sm border transition shrink-0",
                on
                  ? "border-white/20 bg-white/20"
                  : "border-white/10 bg-white/10 hover:bg-white/15",
              ].join(" ")}
            >
              {t.label}
            </button>
          );
        })}
      </div>
      <div className="pointer-events-none absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-black/40 to-transparent md:hidden" />
    </div>
  );
}
