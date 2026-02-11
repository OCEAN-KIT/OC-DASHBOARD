// RegionPopup.jsx
"use client";

import { STAGE_META, getStageColor } from "@/constants/stageMeta";

// ----- 작은 색 유틸: hex → rgba, lighten -----
function hexToRgb(hex) {
  if (!hex) return null;
  const h = hex.replace("#", "");
  if (![3, 6].includes(h.length)) return null;
  const v =
    h.length === 3
      ? h
          .split("")
          .map((c) => c + c)
          .join("")
      : h;
  const r = parseInt(v.slice(0, 2), 16);
  const g = parseInt(v.slice(2, 4), 16);
  const b = parseInt(v.slice(4, 6), 16);
  return { r, g, b };
}

function rgba(hex, alpha = 1) {
  const rgb = hexToRgb(hex);
  if (!rgb) return `rgba(229,231,235,${alpha})`; // fallback slate-200
  const { r, g, b } = rgb;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
/** 흰색과 섞어서 밝게 만들기 (t: 0~1) */
function lighten(hex, t = 0.35) {
  const rgb = hexToRgb(hex) ?? { r: 229, g: 231, b: 235 }; // slate-200 fallback
  const mix = (c) => Math.round(c + (255 - c) * t);
  return `rgb(${mix(rgb.r)}, ${mix(rgb.g)}, ${mix(rgb.b)})`;
}

/** stage → 팝업 스타일 계산 (constants는 그대로) **/
function getPopupStyle(stage) {
  const base = getStageColor(stage); // STAGE_META의 color 사용
  const text = base; // 텍스트는 base 컬러
  const bg = rgba(base, 0.15); // 배경칩은 투명도 0.15
  const dot = lighten(base, 0.35); // 도트는 살짝 밝게
  return { text, bg, dot };
}

function formatDate(ymd) {
  if (!Array.isArray(ymd)) return "-";
  const [y, m, d] = ymd;
  if (!y || !m || !d) return "-";
  return `${y}년 ${m}월 ${d}일`;
}

export default function RegionPopup({ region, onOpen }) {
  if (!region) return null;

  const { name, startDate, level, depth, habitat } = region;
  const stageCfg = getPopupStyle(level);

  return (
    <div
      style={{
        background:
          "linear-gradient(180deg, rgba(15,23,42,.92) 0%, rgba(2,6,23,.88) 100%)",
        color: "#e5e7eb",
        borderRadius: 14,
        padding: "12px 14px",
        fontSize: 13.5,
        lineHeight: 1.35,
        boxShadow: "0 12px 32px rgba(0,0,0,.45)",
        border: "1px solid rgba(148,163,184,.25)",
        backdropFilter: "saturate(160%) blur(10px)",
        WebkitBackdropFilter: "saturate(160%) blur(10px)",
        minWidth: 220,
        maxWidth: 300,
      }}
    >
      {/* 헤더 */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 8,
        }}
      >
        <span
          aria-hidden
          style={{
            width: 10,
            height: 10,
            borderRadius: "9999px",
            background: stageCfg.dot,
            boxShadow: `0 0 0 4px ${stageCfg.bg}`,
          }}
        />
        <div style={{ fontWeight: 700, fontSize: 15, color: "#fff" }}>
          {name ?? "-"}
        </div>
        <span
          style={{
            marginLeft: "auto",
            fontSize: 12,
            fontWeight: 700,
            color: stageCfg.text,
            background: stageCfg.bg,
            padding: "4px 8px",
            borderRadius: 999,
            border: `1px solid ${rgba(stageCfg.text, 0.13)}`,
          }}
        >
          {STAGE_META[level] ? level : "단계 미지정"}
        </span>
      </div>

      {/* 구분선 */}
      <div
        style={{
          height: 1,
          background:
            "linear-gradient(90deg, transparent, rgba(148,163,184,.35), transparent)",
          margin: "6px 0 10px",
        }}
      />

      {/* 본문 */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "88px 1fr",
          rowGap: 6,
          columnGap: 12,
          alignItems: "center",
        }}
      >
        <div style={{ color: "#94a3b8" }}>복원 시작일</div>
        <div style={{ fontWeight: 600 }}>{formatDate(startDate)}</div>

        <div style={{ color: "#94a3b8" }}>수심</div>
        <div style={{ fontWeight: 600 }}>
          {depth != null ? `${depth} m` : "-"}
        </div>

        <div style={{ color: "#94a3b8" }}>해역 유형</div>
        <div style={{ fontWeight: 600 }}>{habitat ?? "-"}</div>
      </div>

      {/* 장식 라인 */}
      <div
        aria-hidden
        style={{
          marginTop: 10,
          height: 2,
          borderRadius: 999,
          background:
            "linear-gradient(90deg, transparent, rgba(96,165,250,.5), rgba(167,139,250,.55), rgba(16,185,129,.55), transparent)",
          filter: "blur(.2px)",
        }}
      />

      {/* 자세히 보러가기 버튼 */}
      <div
        style={{ marginTop: 10, display: "flex", justifyContent: "flex-end" }}
      >
        <button
          type="button"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 3,
            fontSize: 12,
            fontWeight: 600,
            color: "#e5e7eb",
            cursor: "pointer",
            transition:
              "transform 120ms ease, box-shadow 120ms ease, background 120ms ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow =
              "inset 0 1px 0 rgba(255,255,255,.08), 0 10px 22px rgba(67,56,202,.35)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow =
              "inset 0 1px 0 rgba(255,255,255,.06), 0 6px 16px rgba(67,56,202,.25)";
          }}
          onClick={onOpen}
        >
          <span>상세 보기</span>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" />
          </svg>
        </button>
      </div>
    </div>
  );
}
