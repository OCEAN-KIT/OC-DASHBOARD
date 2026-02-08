export type RegionId = "POHANG" | "ULJIN";

export type LevelStage =
  | "OBSERVATION"
  | "SETTLEMENT"
  | "GROWTH"
  | "MANAGEMENT";

export type AreaSummary = {
  id: number;
  name: string;
  restorationRegion: string;
  startDate: string;
  endDate: string;
  habitat: string;
  depth: number;
  areaSize: number;
  level: LevelStage;
  attachmentStatus: string;
  lat: number;
  lon: number;
};

export type AreasResponse = {
  success: boolean;
  data: {
    content: AreaSummary[];
    page: number;
    size: number;
    totalPages: number;
    totalElements: number;
    first: boolean;
    last: boolean;
    hasNext: boolean;
    hasPrevious: boolean;
  };
};
