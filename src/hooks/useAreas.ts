import { useQuery } from "@tanstack/react-query";
import { getAreaDetails, getAreas } from "@/app/api/areas";
import type { RegionId } from "@/app/api/types";

export function useAreas(region: RegionId | null) {
  return useQuery({
    queryKey: ["areas", region],
    queryFn: () => getAreas(region!),
    enabled: !!region,
    staleTime: 5 * 60 * 1000,
  });
}

export function useAreaDetails(id: number | null) {
  return useQuery({
    queryKey: ["areaDetail", id],
    queryFn: () => getAreaDetails(id!),
    enabled: id !== null,
    staleTime: 5 * 60 * 1000,
  });
}
