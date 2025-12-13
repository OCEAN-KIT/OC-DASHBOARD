// src/constants/areaDetails.js
// 모든 이미지 임시 동일 경로
const IMG = "/images/underSea.jpg";

/**
 * 각 areaId 별 더미 데이터 (DEFAULT 없음)
 * basic / transplant / growth / biodiversity / water / media 구조 고정
 */
export const AREA_DETAILS = {
  // ───────────── 포항 ─────────────
  "pohang-1": {
    basic: {
      startDate: "2025-07-15",
      habitat: "암반",
      depth: 8,
      areaSize: "2,100㎡",
      center: [129.44326182424885, 36.076249497155146],
      stage: "이식 완료",
    },
    transplant: [
      { name: "감태", count: 2100, area: "1,100㎡" },
      { name: "다시마", count: 700, area: "650㎡" },
      { name: "곰피", count: 380, area: "350㎡" },
    ],
    growth: {
      attachment: [60, 65, 71, 77, 80, 82],
      survival: [92, 90, 89, 88, 86, 85],
      growthMM: [1.0, 1.2, 1.5, 1.8, 2.0, 2.3],
      months: ["‘25.01", "02", "03", "04", "05", "06"],
    },
    biodiversity: {
      before: { fish: 5, inverts: 10 },
      after: { fish: 11, inverts: 18 },
      shannon: { before: 1.12, after: 1.78 },
    },
    water: [
      { month: "‘25.01", temp: 9.6, do: 8.6, nutrient: 0.29 },
      { month: "02", temp: 10.0, do: 8.4, nutrient: 0.26 },
      { month: "03", temp: 11.3, do: 8.2, nutrient: 0.24 },
      { month: "04", temp: 13.7, do: 8.0, nutrient: 0.22 },
      { month: "05", temp: 16.1, do: 7.8, nutrient: 0.21 },
    ],
    media: [
      { label: "2025.07", url: IMG },
      { label: "2025.08", url: IMG },
      { label: "2025.09", url: IMG },
      { label: "2025.10", url: IMG },
    ],
  },

  "pohang-2": {
    basic: {
      startDate: "2025-08-02",
      habitat: "혼합",
      depth: 12,
      areaSize: "2,400㎡",
      center: [129.5094049361261, 36.082747077980684],
      stage: "성장 중",
    },
    transplant: [
      { name: "감태", count: 2400, area: "1,200㎡" },
      { name: "다시마", count: 900, area: "780㎡" },
      { name: "곰피", count: 420, area: "380㎡" },
    ],
    growth: {
      attachment: [58, 63, 69, 74, 79, 83],
      survival: [90, 89, 88, 87, 86, 85],
      growthMM: [1.1, 1.3, 1.6, 1.9, 2.2, 2.5],
      months: ["‘25.01", "02", "03", "04", "05", "06"],
    },
    biodiversity: {
      before: { fish: 6, inverts: 9 },
      after: { fish: 12, inverts: 17 },
      shannon: { before: 1.1, after: 1.72 },
    },
    water: [
      { month: "‘25.01", temp: 9.9, do: 8.4, nutrient: 0.28 },
      { month: "02", temp: 10.3, do: 8.2, nutrient: 0.25 },
      { month: "03", temp: 11.6, do: 8.0, nutrient: 0.23 },
      { month: "04", temp: 14.1, do: 7.8, nutrient: 0.22 },
      { month: "05", temp: 16.6, do: 7.6, nutrient: 0.21 },
    ],
    media: [
      { label: "2025.07", url: IMG },
      { label: "2025.08", url: IMG },
      { label: "2025.09", url: IMG },
      { label: "2025.10", url: IMG },
    ],
  },

  "pohang-3": {
    basic: {
      startDate: "2025-06-20",
      habitat: "모래",
      depth: 18,
      areaSize: "1,950㎡",
      center: [129.5815005278194, 35.949910138964285],
      stage: "모니터링 중",
    },
    transplant: [
      { name: "감태", count: 1900, area: "1,000㎡" },
      { name: "다시마", count: 600, area: "650㎡" },
      { name: "곰피", count: 320, area: "300㎡" },
    ],
    growth: {
      attachment: [55, 61, 67, 72, 76, 79],
      survival: [89, 88, 87, 86, 85, 84],
      growthMM: [0.9, 1.2, 1.4, 1.7, 2.0, 2.2],
      months: ["‘25.01", "02", "03", "04", "05", "06"],
    },
    biodiversity: {
      before: { fish: 4, inverts: 8 },
      after: { fish: 10, inverts: 15 },
      shannon: { before: 1.02, after: 1.6 },
    },
    water: [
      { month: "‘25.01", temp: 9.4, do: 8.3, nutrient: 0.3 },
      { month: "02", temp: 9.8, do: 8.1, nutrient: 0.27 },
      { month: "03", temp: 11.0, do: 7.9, nutrient: 0.25 },
      { month: "04", temp: 13.5, do: 7.7, nutrient: 0.23 },
      { month: "05", temp: 16.0, do: 7.6, nutrient: 0.22 },
    ],
    media: [
      { label: "2025.07", url: IMG },
      { label: "2025.08", url: IMG },
      { label: "2025.09", url: IMG },
      { label: "2025.10", url: IMG },
    ],
  },

  "pohang-4": {
    basic: {
      startDate: "2024-11-10",
      habitat: "암반",
      depth: 10,
      areaSize: "2,250㎡",
      center: [129.40140806078313, 36.224121065386555],
      stage: "안정화 구역",
    },
    transplant: [
      { name: "감태", count: 2200, area: "1,150㎡" },
      { name: "다시마", count: 750, area: "700㎡" },
      { name: "곰피", count: 360, area: "340㎡" },
    ],
    growth: {
      attachment: [64, 68, 73, 79, 82, 84],
      survival: [93, 92, 91, 90, 89, 88],
      growthMM: [1.2, 1.4, 1.7, 2.0, 2.3, 2.5],
      months: ["‘25.01", "02", "03", "04", "05", "06"],
    },
    biodiversity: {
      before: { fish: 7, inverts: 12 },
      after: { fish: 13, inverts: 20 },
      shannon: { before: 1.25, after: 1.88 },
    },
    water: [
      { month: "‘25.01", temp: 9.7, do: 8.6, nutrient: 0.28 },
      { month: "02", temp: 10.2, do: 8.4, nutrient: 0.26 },
      { month: "03", temp: 11.7, do: 8.2, nutrient: 0.24 },
      { month: "04", temp: 14.3, do: 8.0, nutrient: 0.22 },
      { month: "05", temp: 16.7, do: 7.9, nutrient: 0.21 },
    ],
    media: [
      { label: "2024.12", url: IMG },
      { label: "2025.01", url: IMG },
      { label: "2025.02", url: IMG },
      { label: "2025.03", url: IMG },
    ],
  },

  "pohang-5": {
    basic: {
      startDate: "2025-07-28",
      habitat: "혼합",
      depth: 9,
      areaSize: "1,880㎡",
      center: [129.47, 36.05],
      stage: "성장 중",
    },
    transplant: [
      { name: "감태", count: 1850, area: "980㎡" },
      { name: "다시마", count: 640, area: "600㎡" },
      { name: "곰피", count: 300, area: "300㎡" },
    ],
    growth: {
      attachment: [57, 62, 67, 73, 78, 82],
      survival: [91, 90, 88, 87, 86, 85],
      growthMM: [1.0, 1.2, 1.6, 1.9, 2.1, 2.4],
      months: ["‘25.01", "02", "03", "04", "05", "06"],
    },
    biodiversity: {
      before: { fish: 5, inverts: 9 },
      after: { fish: 11, inverts: 16 },
      shannon: { before: 1.08, after: 1.66 },
    },
    water: [
      { month: "‘25.01", temp: 9.5, do: 8.3, nutrient: 0.29 },
      { month: "02", temp: 9.9, do: 8.2, nutrient: 0.26 },
      { month: "03", temp: 11.2, do: 8.0, nutrient: 0.24 },
      { month: "04", temp: 13.8, do: 7.8, nutrient: 0.23 },
      { month: "05", temp: 16.2, do: 7.7, nutrient: 0.21 },
    ],
    media: [
      { label: "2025.07", url: IMG },
      { label: "2025.08", url: IMG },
      { label: "2025.09", url: IMG },
      { label: "2025.10", url: IMG },
    ],
  },

  "pohang-6": {
    basic: {
      startDate: "2025-05-30",
      habitat: "모래",
      depth: 14,
      areaSize: "2,020㎡",
      center: [129.52, 36.02],
      stage: "모니터링 중",
    },
    transplant: [
      { name: "감태", count: 2000, area: "1,050㎡" },
      { name: "다시마", count: 680, area: "640㎡" },
      { name: "곰피", count: 310, area: "300㎡" },
    ],
    growth: {
      attachment: [54, 60, 66, 71, 75, 78],
      survival: [90, 89, 88, 87, 86, 84],
      growthMM: [0.9, 1.1, 1.4, 1.7, 2.0, 2.2],
      months: ["‘25.01", "02", "03", "04", "05", "06"],
    },
    biodiversity: {
      before: { fish: 4, inverts: 8 },
      after: { fish: 9, inverts: 15 },
      shannon: { before: 1.0, after: 1.58 },
    },
    water: [
      { month: "‘25.01", temp: 9.2, do: 8.2, nutrient: 0.3 },
      { month: "02", temp: 9.7, do: 8.0, nutrient: 0.27 },
      { month: "03", temp: 10.9, do: 7.9, nutrient: 0.25 },
      { month: "04", temp: 13.3, do: 7.7, nutrient: 0.23 },
      { month: "05", temp: 15.8, do: 7.6, nutrient: 0.22 },
    ],
    media: [
      { label: "2025.05", url: IMG },
      { label: "2025.06", url: IMG },
      { label: "2025.07", url: IMG },
      { label: "2025.08", url: IMG },
    ],
  },

  "pohang-7": {
    basic: {
      startDate: "2025-08-12",
      habitat: "암반",
      depth: 7,
      areaSize: "1,740㎡",
      center: [129.55, 36.1],
      stage: "이식 완료",
    },
    transplant: [
      { name: "감태", count: 1700, area: "920㎡" },
      { name: "다시마", count: 600, area: "560㎡" },
      { name: "곰피", count: 290, area: "260㎡" },
    ],
    growth: {
      attachment: [62, 67, 72, 78, 83, 86],
      survival: [93, 92, 91, 90, 89, 88],
      growthMM: [1.2, 1.5, 1.8, 2.1, 2.4, 2.6],
      months: ["‘25.01", "02", "03", "04", "05", "06"],
    },
    biodiversity: {
      before: { fish: 7, inverts: 11 },
      after: { fish: 14, inverts: 20 },
      shannon: { before: 1.22, after: 1.9 },
    },
    water: [
      { month: "‘25.01", temp: 9.8, do: 8.5, nutrient: 0.27 },
      { month: "02", temp: 10.4, do: 8.3, nutrient: 0.25 },
      { month: "03", temp: 11.9, do: 8.1, nutrient: 0.23 },
      { month: "04", temp: 14.4, do: 7.9, nutrient: 0.22 },
      { month: "05", temp: 16.9, do: 7.7, nutrient: 0.21 },
    ],
    media: [
      { label: "2025.08", url: IMG },
      { label: "2025.09", url: IMG },
      { label: "2025.10", url: IMG },
      { label: "2025.11", url: IMG },
    ],
  },

  "pohang-8": {
    basic: {
      startDate: "2024-12-22",
      habitat: "혼합",
      depth: 11,
      areaSize: "2,060㎡",
      center: [129.39, 36.14],
      stage: "안정화 구역",
    },
    transplant: [
      { name: "감태", count: 2050, area: "1,060㎡" },
      { name: "다시마", count: 720, area: "660㎡" },
      { name: "곰피", count: 330, area: "310㎡" },
    ],
    growth: {
      attachment: [65, 70, 75, 80, 84, 86],
      survival: [94, 93, 92, 91, 90, 89],
      growthMM: [1.3, 1.6, 1.9, 2.2, 2.5, 2.7],
      months: ["‘25.01", "02", "03", "04", "05", "06"],
    },
    biodiversity: {
      before: { fish: 8, inverts: 12 },
      after: { fish: 15, inverts: 21 },
      shannon: { before: 1.3, after: 1.96 },
    },
    water: [
      { month: "‘25.01", temp: 9.9, do: 8.6, nutrient: 0.27 },
      { month: "02", temp: 10.5, do: 8.4, nutrient: 0.25 },
      { month: "03", temp: 12.0, do: 8.2, nutrient: 0.23 },
      { month: "04", temp: 14.6, do: 8.0, nutrient: 0.22 },
      { month: "05", temp: 17.0, do: 7.8, nutrient: 0.2 },
    ],
    media: [
      { label: "2024.12", url: IMG },
      { label: "2025.01", url: IMG },
      { label: "2025.02", url: IMG },
      { label: "2025.03", url: IMG },
    ],
  },

  // ───────────── 울진 ─────────────
  "uljin-1": {
    basic: {
      startDate: "2025-07-30",
      habitat: "암반",
      depth: 7,
      areaSize: "1,680㎡",
      center: [129.43187534029522, 37.036791123643326],
      stage: "성장 중",
    },
    transplant: [
      { name: "감태", count: 1680, area: "900㎡" },
      { name: "다시마", count: 600, area: "550㎡" },
      { name: "곰피", count: 280, area: "230㎡" },
    ],
    growth: {
      attachment: [59, 64, 70, 75, 80, 84],
      survival: [92, 91, 90, 88, 87, 86],
      growthMM: [1.1, 1.3, 1.6, 1.9, 2.2, 2.5],
      months: ["‘25.01", "02", "03", "04", "05", "06"],
    },
    biodiversity: {
      before: { fish: 6, inverts: 10 },
      after: { fish: 12, inverts: 18 },
      shannon: { before: 1.18, after: 1.82 },
    },
    water: [
      { month: "‘25.01", temp: 9.3, do: 8.5, nutrient: 0.28 },
      { month: "02", temp: 9.8, do: 8.3, nutrient: 0.26 },
      { month: "03", temp: 11.2, do: 8.1, nutrient: 0.24 },
      { month: "04", temp: 13.6, do: 7.9, nutrient: 0.22 },
      { month: "05", temp: 16.0, do: 7.7, nutrient: 0.21 },
    ],
    media: [
      { label: "2025.07", url: IMG },
      { label: "2025.08", url: IMG },
      { label: "2025.09", url: IMG },
      { label: "2025.10", url: IMG },
    ],
  },

  "uljin-2": {
    basic: {
      startDate: "2024-09-18",
      habitat: "혼합",
      depth: 9,
      areaSize: "1,920㎡",
      center: [129.42255431160834, 36.96206604857409],
      stage: "안정화 구역",
    },
    transplant: [
      { name: "감태", count: 1900, area: "1,020㎡" },
      { name: "다시마", count: 680, area: "600㎡" },
      { name: "곰피", count: 300, area: "300㎡" },
    ],
    growth: {
      attachment: [66, 71, 76, 81, 85, 87],
      survival: [95, 94, 93, 92, 91, 90],
      growthMM: [1.4, 1.7, 2.0, 2.3, 2.6, 2.8],
      months: ["‘25.01", "02", "03", "04", "05", "06"],
    },
    biodiversity: {
      before: { fish: 8, inverts: 12 },
      after: { fish: 15, inverts: 21 },
      shannon: { before: 1.34, after: 1.98 },
    },
    water: [
      { month: "‘25.01", temp: 9.7, do: 8.6, nutrient: 0.26 },
      { month: "02", temp: 10.1, do: 8.4, nutrient: 0.24 },
      { month: "03", temp: 11.6, do: 8.2, nutrient: 0.22 },
      { month: "04", temp: 14.0, do: 8.0, nutrient: 0.21 },
      { month: "05", temp: 16.3, do: 7.8, nutrient: 0.2 },
    ],
    media: [
      { label: "2024.09", url: IMG },
      { label: "2024.10", url: IMG },
      { label: "2024.11", url: IMG },
      { label: "2024.12", url: IMG },
    ],
  },

  "uljin-3": {
    basic: {
      startDate: "2025-05-05",
      habitat: "암반",
      depth: 6,
      areaSize: "1,550㎡",
      center: [129.45126050382464, 37.036791123643326],
      stage: "이식 완료",
    },
    transplant: [
      { name: "감태", count: 1500, area: "820㎡" },
      { name: "다시마", count: 550, area: "520㎡" },
      { name: "곰피", count: 260, area: "210㎡" },
    ],
    growth: {
      attachment: [61, 66, 71, 77, 82, 86],
      survival: [93, 92, 91, 90, 89, 88],
      growthMM: [1.2, 1.5, 1.8, 2.1, 2.4, 2.6],
      months: ["‘25.01", "02", "03", "04", "05", "06"],
    },
    biodiversity: {
      before: { fish: 6, inverts: 10 },
      after: { fish: 13, inverts: 19 },
      shannon: { before: 1.2, after: 1.86 },
    },
    water: [
      { month: "‘25.01", temp: 9.4, do: 8.5, nutrient: 0.27 },
      { month: "02", temp: 9.8, do: 8.3, nutrient: 0.25 },
      { month: "03", temp: 11.1, do: 8.1, nutrient: 0.23 },
      { month: "04", temp: 13.7, do: 7.9, nutrient: 0.22 },
      { month: "05", temp: 16.1, do: 7.8, nutrient: 0.2 },
    ],
    media: [
      { label: "2025.05", url: IMG },
      { label: "2025.06", url: IMG },
      { label: "2025.07", url: IMG },
      { label: "2025.08", url: IMG },
    ],
  },

  "uljin-4": {
    basic: {
      startDate: "2025-08-08",
      habitat: "혼합",
      depth: 13,
      areaSize: "1,800㎡",
      center: [129.42, 37.01],
      stage: "모니터링 중",
    },
    transplant: [
      { name: "감태", count: 1750, area: "950㎡" },
      { name: "다시마", count: 620, area: "580㎡" },
      { name: "곰피", count: 280, area: "270㎡" },
    ],
    growth: {
      attachment: [56, 61, 66, 71, 75, 78],
      survival: [90, 89, 88, 87, 86, 85],
      growthMM: [1.0, 1.2, 1.5, 1.8, 2.0, 2.3],
      months: ["‘25.01", "02", "03", "04", "05", "06"],
    },
    biodiversity: {
      before: { fish: 5, inverts: 9 },
      after: { fish: 11, inverts: 16 },
      shannon: { before: 1.06, after: 1.64 },
    },
    water: [
      { month: "‘25.01", temp: 9.1, do: 8.3, nutrient: 0.29 },
      { month: "02", temp: 9.6, do: 8.1, nutrient: 0.27 },
      { month: "03", temp: 10.9, do: 7.9, nutrient: 0.25 },
      { month: "04", temp: 13.4, do: 7.7, nutrient: 0.23 },
      { month: "05", temp: 15.9, do: 7.6, nutrient: 0.22 },
    ],
    media: [
      { label: "2025.08", url: "/images/sea1.jpeg" },
      { label: "2025.09", url: "/images/sea2.jpeg" },
      { label: "2025.10", url: "/images/sea3.jpeg" },
      { label: "2025.11", url: "/images/sea4.jpeg" },
    ],
  },

  "uljin-6": {
    basic: {
      startDate: "2025-07-10",
      habitat: "암반",
      depth: 6,
      areaSize: "1,520㎡",
      center: [129.46, 36.98],
      stage: "이식 완료",
    },
    transplant: [
      { name: "감태", count: 1500, area: "800㎡" },
      { name: "다시마", count: 540, area: "500㎡" },
      { name: "곰피", count: 240, area: "220㎡" },
    ],
    growth: {
      attachment: [60, 65, 70, 76, 81, 85],
      survival: [93, 92, 91, 90, 89, 88],
      growthMM: [1.1, 1.4, 1.7, 2.0, 2.3, 2.5],
      months: ["‘25.01", "02", "03", "04", "05", "06"],
    },
    biodiversity: {
      before: { fish: 6, inverts: 10 },
      after: { fish: 13, inverts: 19 },
      shannon: { before: 1.19, after: 1.85 },
    },
    water: [
      { month: "‘25.01", temp: 9.5, do: 8.4, nutrient: 0.27 },
      { month: "02", temp: 10.0, do: 8.2, nutrient: 0.25 },
      { month: "03", temp: 11.4, do: 8.0, nutrient: 0.23 },
      { month: "04", temp: 13.9, do: 7.8, nutrient: 0.22 },
      { month: "05", temp: 16.3, do: 7.7, nutrient: 0.21 },
    ],
    media: [
      { label: "2025.07", url: IMG },
      { label: "2025.08", url: IMG },
      { label: "2025.09", url: IMG },
      { label: "2025.10", url: IMG },
    ],
  },

  "uljin-7": {
    basic: {
      startDate: "2024-11-28",
      habitat: "암반",
      depth: 12,
      areaSize: "1,980㎡",
      center: [129.42, 37.05],
      stage: "안정화 구역",
    },
    transplant: [
      { name: "감태", count: 1950, area: "1,020㎡" },
      { name: "다시마", count: 700, area: "650㎡" },
      { name: "곰피", count: 320, area: "310㎡" },
    ],
    growth: {
      attachment: [67, 72, 76, 81, 85, 88],
      survival: [95, 94, 93, 92, 91, 90],
      growthMM: [1.4, 1.7, 2.0, 2.3, 2.6, 2.8],
      months: ["‘25.01", "02", "03", "04", "05", "06"],
    },
    biodiversity: {
      before: { fish: 8, inverts: 12 },
      after: { fish: 15, inverts: 21 },
      shannon: { before: 1.33, after: 1.98 },
    },
    water: [
      { month: "‘25.01", temp: 9.8, do: 8.6, nutrient: 0.26 },
      { month: "02", temp: 10.2, do: 8.4, nutrient: 0.24 },
      { month: "03", temp: 11.7, do: 8.2, nutrient: 0.22 },
      { month: "04", temp: 14.2, do: 8.0, nutrient: 0.21 },
      { month: "05", temp: 16.5, do: 7.8, nutrient: 0.2 },
    ],
    media: [
      { label: "2024.11", url: IMG },
      { label: "2024.12", url: IMG },
      { label: "2025.01", url: IMG },
      { label: "2025.02", url: IMG },
    ],
  },
};
