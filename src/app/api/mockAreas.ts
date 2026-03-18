import type { AreaDetails, AreaSummary, RegionId } from "./types";

type MockSeed = {
  id: number;
  name: string;
  level: AreaSummary["level"];
  lat: number;
  lon: number;
  startDate: [number, number, number];
  endDate: [number, number, number] | null;
  habitat: string;
  depth: number;
  areaSize: number;
  currentStatusDescription: string;
  areaAttachmentStatus: AreaDetails["ecology"]["areaAttachmentStatus"];
  environment: AreaDetails["environment"]["last3MonthsSummary"];
};

const seeds: MockSeed[] = [
  {
    id: 101,
    name: "포항 영일만 북측 A-01",
    level: "관측",
    lat: 36.0912,
    lon: 129.4298,
    startDate: [2024, 4, 12],
    endDate: null,
    habitat: "외해 암반 지대",
    depth: 8,
    areaSize: 1400,
    currentStatusDescription: "기초 생육 관찰중",
    areaAttachmentStatus: "안정",
    environment: {
      visibility: "양호",
      current: "보통",
      surge: "보통",
      wave: "보통",
    },
  },
  {
    id: 102,
    name: "포항 영일만 북측 A-02",
    level: "정착",
    lat: 36.1125,
    lon: 129.4512,
    startDate: [2024, 6, 3],
    endDate: null,
    habitat: "사질-암반 혼합",
    depth: 10,
    areaSize: 1700,
    currentStatusDescription: "정착률 모니터링중",
    areaAttachmentStatus: "일부 감소",
    environment: {
      visibility: "보통",
      current: "양호",
      surge: "보통",
      wave: "보통",
    },
  },
  {
    id: 103,
    name: "포항 송도 앞바다 B-01",
    level: "성장",
    lat: 36.0668,
    lon: 129.3924,
    startDate: [2023, 11, 21],
    endDate: null,
    habitat: "완경사 암반",
    depth: 12,
    areaSize: 2200,
    currentStatusDescription: "성장 구간 관찰중",
    areaAttachmentStatus: "안정",
    environment: {
      visibility: "양호",
      current: "양호",
      surge: "보통",
      wave: "좋음",
    },
  },
  {
    id: 104,
    name: "포항 구룡포 외측 B-02",
    level: "관리",
    lat: 36.1186,
    lon: 129.5238,
    startDate: [2023, 5, 18],
    endDate: null,
    habitat: "조류 강한 사면",
    depth: 14,
    areaSize: 2600,
    currentStatusDescription: "유지관리 모니터링중",
    areaAttachmentStatus: "안정",
    environment: {
      visibility: "보통",
      current: "보통",
      surge: "양호",
      wave: "보통",
    },
  },
  {
    id: 105,
    name: "포항 칠포 앞바다 C-01",
    level: "관측",
    lat: 36.1462,
    lon: 129.4788,
    startDate: [2025, 1, 7],
    endDate: null,
    habitat: "완만한 사질 지대",
    depth: 7,
    areaSize: 900,
    currentStatusDescription: "초기 군집 관찰중",
    areaAttachmentStatus: "일부 감소",
    environment: {
      visibility: "보통",
      current: "좋음",
      surge: "보통",
      wave: "나쁨",
    },
  },
  {
    id: 106,
    name: "포항 호미곶 남측 C-02",
    level: "정착",
    lat: 36.1778,
    lon: 129.4995,
    startDate: [2024, 8, 28],
    endDate: null,
    habitat: "암반 경계 구간",
    depth: 11,
    areaSize: 1800,
    currentStatusDescription: "정착 단계 관찰중",
    areaAttachmentStatus: "불안정",
    environment: {
      visibility: "양호",
      current: "보통",
      surge: "나쁨",
      wave: "나쁨",
    },
  },
  {
    id: 107,
    name: "포항 장기면 해역 D-01",
    level: "성장",
    lat: 36.1332,
    lon: 129.4564,
    startDate: [2023, 9, 4],
    endDate: null,
    habitat: "암초 분포 해역",
    depth: 13,
    areaSize: 2400,
    currentStatusDescription: "성장 상태 모니터링중",
    areaAttachmentStatus: "안정",
    environment: {
      visibility: "좋음",
      current: "양호",
      surge: "보통",
      wave: "보통",
    },
  },
  {
    id: 108,
    name: "포항 영일대 연안 D-02",
    level: "관리",
    lat: 36.0745,
    lon: 129.5033,
    startDate: [2022, 12, 2],
    endDate: null,
    habitat: "연안 저층 암반",
    depth: 9,
    areaSize: 2100,
    currentStatusDescription: "사후 점검 모니터링중",
    areaAttachmentStatus: "안정",
    environment: {
      visibility: "양호",
      current: "좋음",
      surge: "양호",
      wave: "보통",
    },
  },
];

const monthLabels: [number, number, number][] = [
  [2025, 9, 1],
  [2025, 10, 1],
  [2025, 11, 1],
  [2025, 12, 1],
  [2026, 1, 1],
  [2026, 2, 1],
];

const toSummary = (seed: MockSeed): AreaSummary => ({
  id: seed.id,
  name: seed.name,
  restorationRegion: "포항",
  startDate: seed.startDate,
  endDate: seed.endDate,
  habitat: seed.habitat,
  depth: seed.depth,
  areaSize: seed.areaSize,
  level: seed.level,
  attachmentStatus: seed.areaAttachmentStatus,
  lat: seed.lat,
  lon: seed.lon,
  updatedAt: "2026-02-20",
});

const stageSpeciesMap: Record<
  AreaSummary["level"],
  { speciesName: string; quantity: number }[]
> = {
  관측: [
    { speciesName: "감태", quantity: 210 },
    { speciesName: "곰피", quantity: 150 },
    { speciesName: "모자반", quantity: 90 },
  ],
  정착: [
    { speciesName: "감태", quantity: 260 },
    { speciesName: "대황", quantity: 180 },
    { speciesName: "모자반", quantity: 120 },
  ],
  성장: [
    { speciesName: "감태", quantity: 320 },
    { speciesName: "대황", quantity: 240 },
    { speciesName: "곰피", quantity: 190 },
  ],
  관리: [
    { speciesName: "감태", quantity: 360 },
    { speciesName: "대황", quantity: 290 },
    { speciesName: "곰피", quantity: 230 },
  ],
};

const stageWorkMap: Record<AreaSummary["level"], number[]> = {
  관측: [2, 3, 2, 4, 3, 2],
  정착: [3, 4, 5, 4, 3, 4],
  성장: [4, 5, 5, 6, 5, 4],
  관리: [2, 3, 3, 4, 3, 3],
};

const stageGrowthMap: Record<AreaSummary["level"], number[]> = {
  관측: [18, 22, 25, 28, 30, 33],
  정착: [24, 28, 31, 35, 37, 40],
  성장: [30, 34, 39, 43, 46, 49],
  관리: [34, 37, 41, 44, 46, 48],
};

const stageTempMap: Record<AreaSummary["level"], number[]> = {
  관측: [17.2, 16.4, 15.1, 13.6, 12.9, 13.5],
  정착: [17.5, 16.8, 15.6, 14.1, 13.1, 13.9],
  성장: [17.9, 17.1, 15.8, 14.5, 13.3, 14.2],
  관리: [18.1, 17.2, 16.1, 14.8, 13.8, 14.5],
};

const stageMethodDistribution: Record<AreaSummary["level"], Record<string, number>>
  = {
    관측: {
      SEEDLING_STRING: 40,
      ROPE: 30,
      ROCK_FIXATION: 20,
      TRANSPLANT_MODULE: 10,
    },
    정착: {
      SEEDLING_STRING: 30,
      ROPE: 35,
      ROCK_FIXATION: 20,
      TRANSPLANT_MODULE: 15,
    },
    성장: {
      SEEDLING_STRING: 25,
      ROPE: 30,
      ROCK_FIXATION: 25,
      TRANSPLANT_MODULE: 20,
    },
    관리: {
      SEEDLING_STRING: 20,
      ROPE: 30,
      ROCK_FIXATION: 30,
      TRANSPLANT_MODULE: 20,
    },
  };

const stageAttachmentStatuses: Record<
  AreaSummary["level"],
  { method: string; status: string }[]
> = {
  관측: [
    { method: "SEEDLING_STRING", status: "보통" },
    { method: "ROPE", status: "양호" },
    { method: "ROCK_FIXATION", status: "보통" },
  ],
  정착: [
    { method: "SEEDLING_STRING", status: "양호" },
    { method: "ROPE", status: "보통" },
    { method: "TRANSPLANT_MODULE", status: "보통" },
  ],
  성장: [
    { method: "SEEDLING_STRING", status: "양호" },
    { method: "ROPE", status: "양호" },
    { method: "ROCK_FIXATION", status: "양호" },
  ],
  관리: [
    { method: "ROPE", status: "양호" },
    { method: "ROCK_FIXATION", status: "양호" },
    { method: "TRANSPLANT_MODULE", status: "보통" },
  ],
};

const buildDetails = (seed: MockSeed): AreaDetails => {
  const species = stageSpeciesMap[seed.level];
  const workValues = stageWorkMap[seed.level];
  const growthValues = stageGrowthMap[seed.level];
  const tempValues = stageTempMap[seed.level];
  const methodDistribution = stageMethodDistribution[seed.level];

  return {
    id: seed.id,
    overview: {
      name: seed.name,
      areaId: seed.id,
      restorationRegion: "포항",
      startDate: seed.startDate,
      endDate: seed.endDate,
      currentStatus: {
        name: seed.level,
        description: seed.currentStatusDescription,
      },
      areaSize: seed.areaSize,
      avgDepth: seed.depth,
      habitatType: seed.habitat,
      lat: seed.lat,
      lon: seed.lon,
      attachmentStatus: seed.areaAttachmentStatus,
    },
    status: {
      speciesList: [
        {
          speciesName: species[0].speciesName,
          method: "SEEDLING_STRING",
          methodDesc: "종묘줄",
          quantity: species[0].quantity,
          unit: "줄",
        },
        {
          speciesName: species[1].speciesName,
          method: "ROPE",
          methodDesc: "로프",
          quantity: species[1].quantity,
          unit: "m",
        },
        {
          speciesName: species[2].speciesName,
          method: "ROCK_FIXATION",
          methodDesc: "암반 고정",
          quantity: species[2].quantity,
          unit: "지점",
        },
      ],
      methodDistribution,
      accumulated: {
        totalAreaSize: seed.areaSize,
        totalWorkCount: workValues.reduce((acc, cur) => acc + cur, 0),
        lastWorkDate: [2026, 2, ((seed.id % 20) + 8)],
      },
      workHistoryChart: {
        labels: monthLabels,
        values: workValues,
        unit: "회",
        targetSpecies: "",
        targetSpeciesId: 0,
        period: "2025.09 - 2026.02",
      },
    },
    ecology: {
      attachmentStatuses: stageAttachmentStatuses[seed.level],
      areaAttachmentStatus: seed.areaAttachmentStatus,
      representativeGrowthChart: {
        labels: monthLabels,
        values: growthValues,
        unit: "mm",
        targetSpecies: species[0].speciesName,
        targetSpeciesId: seed.id,
        period: "최근 6개월",
      },
    },
    environment: {
      last3MonthsSummary: seed.environment,
      temperatureChart: {
        labels: monthLabels,
        values: tempValues,
        unit: "℃",
        targetSpecies: "",
        targetSpeciesId: 0,
        period: "2025.09 - 2026.02",
      },
    },
    photos: {
      beforeUrl: "/oceanCampusLogo.png",
      afterUrl: "/oceanCampusLogo.png",
      timeline: [
        {
          url: "/oceanCampusLogo.png",
          label: "2025.09.12",
          caption: "정점 카메라 #1",
        },
        {
          url: "/oceanCampusLogo.png",
          label: "2025.11.03",
          caption: "종묘줄 점검",
        },
        {
          url: "/oceanCampusLogo.png",
          label: "2026.01.18",
          caption: "착생 상태 기록",
        },
        {
          url: "/oceanCampusLogo.png",
          label: "2026.02.24",
          caption: "월간 모니터링",
        },
      ],
    },
  };
};

export const MOCK_AREAS: AreaSummary[] = seeds.map(toSummary);

const MOCK_DETAILS_MAP: Map<number, AreaDetails> = new Map(
  seeds.map((seed) => [seed.id, buildDetails(seed)]),
);

export function getMockAreas(region: RegionId): AreaSummary[] {
  if (region !== "POHANG") return [];
  return MOCK_AREAS;
}

export function getMockAreaDetails(id: number): AreaDetails | null {
  return MOCK_DETAILS_MAP.get(id) ?? null;
}
