/**
 * 카메라를 지정 위치로 자연스럽게 이동시키는 함수
 * @param {object} map - mapboxgl.Map 인스턴스
 * @param {object} newLocation - 이동할 위치 객체 (예: region 또는 area)
 * @param {Array<number>} newLocation.center - [lng, lat]
 * @param {number} [newLocation.zoom] - 선택적 커스텀 줌 레벨
 */
export default function changeCameraView(map, newLocation) {
  const center = newLocation?.center ?? (newLocation?.lon != null ? [newLocation.lon, newLocation.lat] : null);
  if (!map || !center) return;

  const [lng, lat] = center;

  const isArea = typeof newLocation.id === "number";
  const zoom = newLocation.zoom ?? (isArea ? 12.5 : 10.3);

  // 애니메이션 효과
  map.flyTo({
    center: [lng, lat],
    zoom,
    pitch: 55, // 약간 기울여서 입체감
    bearing: isArea ? -90 : 0, // 작업영역일 육지쪽 뷰
    speed: 1.3,
    curve: 1.8, // 궤적 곡률
    easing: (t) => t,
    essential: true, // 유저 설정 무시 방지 옵션
  });
}
