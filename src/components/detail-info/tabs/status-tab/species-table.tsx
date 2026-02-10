import type { AreaDetails } from "@/app/api/types";
import { METHOD_META, getMethodMeta } from "@/constants/method";
import styles from "./status-tab.module.css";

function MethodTooltip() {
  return (
    <span className="relative group inline-flex ml-2">
      <span className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-white/20 text-[10px] text-white/50 cursor-help">
        ?
      </span>

      <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 rounded-lg border border-white/15 bg-black/80 backdrop-blur-md p-2.5 text-xs opacity-0 transition-opacity group-hover:pointer-events-auto group-hover:opacity-100 z-10">
        <ul className="space-y-1.5">
          {Object.entries(METHOD_META).map(([key, meta]) => (
            <li key={key} className="flex items-start gap-1.5">
              <span
                className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full"
                style={{ backgroundColor: meta.color }}
              />
              <span>
                <span className="font-medium text-white/90">{meta.name}</span>
                <span className="text-white/50">: {meta.description}</span>
              </span>
            </li>
          ))}
        </ul>
      </span>
    </span>
  );
}

type Props = {
  list: AreaDetails["status"]["speciesList"];
};

export default function SpeciesTable({ list }: Props) {
  return (
    <div className="rounded-xl bg-white/5 p-4 h-full flex flex-col">
      <h3 className="text-[11px] text-white/50 mb-2">
        <span className="inline-flex items-center">이식 종별 현황</span>
      </h3>

      {/* ✅ 헤더 (스크롤 밖) */}
      <div className="rounded-lg">
        <table className="w-full text-sm table-fixed">
          <colgroup>
            <col className="w-[42%]" />
            <col className="w-[38%]" />
            <col className="w-[20%]" />
          </colgroup>

          <thead>
            <tr className="text-white/50 text-xs border-b border-white/10">
              <th className="text-left py-2 px-2 font-medium">종명</th>
              <th className="text-left py-2 px-2 font-medium">
                <span className="inline-flex items-center">
                  이식 단위
                  <MethodTooltip />
                </span>
              </th>
              <th className="text-right py-2 px-2 font-medium">수량</th>
            </tr>
          </thead>
        </table>

        {/* ✅ 바디만 스크롤 */}
        <div className={`max-h-[160px] overflow-y-auto ${styles.scrollbar}`}>
          <table className="w-full text-sm table-fixed">
            <colgroup>
              <col className="w-[42%]" />
              <col className="w-[38%]" />
              <col className="w-[20%]" />
            </colgroup>

            <tbody>
              {list.map((s, i) => {
                const meta = getMethodMeta(s.method);
                return (
                  <tr key={i} className="border-b border-white/5 last:border-0">
                    <td className="py-2 px-2">{s.speciesName}</td>
                    <td className="py-2 px-2 text-white/70">{meta.name}</td>
                    <td className="py-2 px-2 text-right">
                      {s.quantity.toLocaleString()}
                      <span className="text-white/50 ml-1">{s.unit}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
