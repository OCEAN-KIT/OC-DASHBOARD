import { getMockAreaDetails, getMockAreas } from "./mockAreas";
import { AreaDetails, AreaSummary, RegionId } from "./types";

export async function getAreas(region: RegionId): Promise<AreaSummary[]> {
  return getMockAreas(region);
}

export async function getAreaDetails(id: number): Promise<AreaDetails> {
  const numericId = Number(id);
  const data = getMockAreaDetails(numericId);

  if (!data) {
    throw new Error(`Mock area detail not found for id=${id}`);
  }

  return data;
}
