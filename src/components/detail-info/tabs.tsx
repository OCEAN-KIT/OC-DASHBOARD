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
    <div className="flex items-center gap-2 px-5 pt-4">
      {TABS.map((t) => {
        const on = active === t.key;
        return (
          <button
            key={t.key}
            onClick={() => onChange(t.key)}
            className={[
              "h-8 px-3 rounded-xl text-sm border transition",
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
  );
}
