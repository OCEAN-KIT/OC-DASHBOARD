export type RegionId = "POHANG" | "ULJIN";

export type LevelStage = "OBSERVATION" | "SETTLEMENT" | "GROWTH" | "MANAGEMENT";

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

export type ChartData = {
  labels: string[];
  values: number[];
  unit: string;
  targetSpecies: string;
  targetSpeciesId: number;
  period: string;
};

export type AreaDetails = {
  id: number;
  overview: {
    name: string;
    areaId: number;
    restorationRegion: string;
    startDate: string;
    endDate: string;
    currentStatus: {
      name: string;
      description: string;
    };
    areaSize: number;
    avgDepth: number;
    habitatType: string;
    lat: number;
    lon: number;
    attachmentStatus: string;
  };
  status: {
    speciesList: {
      speciesName: string;
      method: string;
      methodDesc: string;
      quantity: number;
      unit: string;
    }[];
    methodDistribution: Record<string, number>;
    accumulated: {
      totalAreaSize: number;
      totalWorkCount: number;
      lastWorkDate: string;
    };
    workHistoryChart: ChartData;
  };
  ecology: {
    attachmentStatuses: {
      method: string;
      status: string;
    }[];
    survivalStatus: string;
    representativeGrowthChart: ChartData;
  };
  environment: {
    last3MonthsSummary: {
      visibility: string;
      current: string;
      surge: string;
      wave: string;
    };
    temperatureChart: ChartData;
  };
  photos: {
    beforeUrl: string;
    afterUrl: string;
    timeline: {
      url: string;
      label: string;
      caption: string;
    }[];
  };
};

export type AreaDetailsResponse = {
  success: boolean;
  data: AreaDetails;
};
