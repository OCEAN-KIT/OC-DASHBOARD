import axiosInstance from "@/utils/axiosinstance";

/**
 * 작업 영역 상세 조회 API
 * @param {string|number} id - 작업 영역 ID (예: 'pohang-1' -> 1 로 변환하여 호출)
 */
export async function fetchAreaDetail(id) {
  // 프론트의 ID(예: "pohang-1")에서 숫자만 추출하여 백엔드 ID로 사용
  const numericId = String(id).replace(/[^0-9]/g, "");
  
  if (!numericId) {
    throw new Error("Invalid Area ID");
  }

  const res = await axiosInstance.get(`/api/dashboard/areas/${numericId}`);
  return res.data; // ApiData 객체 반환 ({ result, data, message })
}

/**
 * [수정] 뷰포트(BBox) 내 마커 조회 API
 * - 지도의 현재 화면 좌표(minLat, minLon, maxLat, maxLon)를 받아 해당 영역 마커만 조회합니다.
 * - 백엔드: GET /api/dashboard/markers/bbox
 */
export async function fetchMarkersInBBox({ minLat, minLon, maxLat, maxLon }) {
  const params = { minLat, minLon, maxLat, maxLon };
  const res = await axiosInstance.get("/api/dashboard/markers/bbox", { params });
  return res.data; // ApiData 객체 반환
}