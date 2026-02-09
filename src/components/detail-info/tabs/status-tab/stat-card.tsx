type Props = {
  label: string;
  value: React.ReactNode;
  unit?: string;
};

export default function StatCard({ label, value, unit }: Props) {
  return (
    <div className="rounded-xl bg-white/5 p-4 h-full flex flex-col">
      <div className="text-[11px] text-white/50">{label}</div>
      <div className="mt-auto self-end text-4xl font-bold">
        {value}
        {unit && (
          <span className="text-sm font-normal text-white/50 ml-1">{unit}</span>
        )}
      </div>
    </div>
  );
}
