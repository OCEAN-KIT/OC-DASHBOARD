import axiosInstance from "@/utils/axiosinstance";
import {
  AreaDetails,
  AreaDetailsResponse,
  AreaSummary,
  AreasResponse,
  RegionId,
} from "./types";

export async function getAreas(region: RegionId): Promise<AreaSummary[]> {
  const res = await axiosInstance.get<AreasResponse>("/api/dashboard/areas", {
    params: { region },
  });
  return res.data.data.content;
}

export async function getAreaDetails(id: number): Promise<AreaDetails> {
  const res = await axiosInstance.get<AreaDetailsResponse>(
    `/api/dashboard/areas/${id}`
  );

  return res.data.data;
}
