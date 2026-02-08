import axiosInstance from "@/utils/axiosinstance";
import { AreaSummary, AreasResponse, RegionId } from "./types";

export async function getAreas(region: RegionId): Promise<AreaSummary[]> {
  const res = await axiosInstance.get<AreasResponse>("/api/dashboard/areas", {
    params: { region },
  });
  return res.data.data.content;
}
