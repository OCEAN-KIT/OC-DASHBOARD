/**
 * 백엔드 날짜 포맷 (YYYY-MM-DD or Array)을 차트용 라벨 ('YY.MM)로 변환
 */
const formatDateLabel = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const yy = String(date.getFullYear()).slice(-2);
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  return `‘${yy}.${mm}`;
};

/**
 * [NEW] 지도 마커 리스트 변환 (Backend DTO -> Frontend Map ViewModel)
 * Backend: { id, name, lat, lon, habitat, stage, ... }
 * Frontend: { id, label, center: [lon, lat], ... }
 */
export const mapMarkerListToViewModel = (list) => {
  if (!Array.isArray(list)) return [];

  return list.map((item) => ({
    // 라우팅 및 키 관리를 위해 문자열 ID 사용 (상세 조회 시 숫자만 추출됨)
    id: `area-${item.id}`, 
    // 백엔드 name -> 프론트 label
    label: item.name,      
    // GeoJSON/Mapbox 포맷 [lon, lat]
    center: [item.lon, item.lat], 
    startDate: item.startDate,
    depth: item.depth,
    areaSize: item.areaSize,
    habitat: item.habitat, // 한글 설명 (예: 암반리프)
    stage: item.stage,     // 한글 설명 (예: 이식 완료)
  }));
};

/**
 * 백엔드 API 응답(Entity 구조)을 프론트엔드 UI/Chart용 구조로 변환
 */
export const mapAreaDetailToViewModel = (apiData) => {
  if (!apiData) return null;

  const { basic, transplants, growthLogs, waterLogs, biodiversity, mediaLogs } = apiData;

  // 1. Growth Data 변환
  const growth = {
    months: [],
    attachment: [],
    survival: [],
    growthMM: [],
  };

  if (Array.isArray(growthLogs)) {
    growthLogs.forEach((log) => {
      growth.months.push(formatDateLabel(log.date));
      growth.attachment.push(log.attachmentRate);
      growth.survival.push(log.survivalRate);
      growth.growthMM.push(log.growthLength);
    });
  }

  // 2. Water Data 변환
  const water = Array.isArray(waterLogs)
    ? waterLogs.map((log) => ({
        month: formatDateLabel(log.date),
        temp: log.temperature,
        do: log.dissolvedOxygen,
        nutrient: log.nutrient,
      }))
    : [];

  // 3. Transplant Data 변환
  const transplant = Array.isArray(transplants)
    ? transplants.map((t) => ({
        name: t.species,
        count: t.count,
        area: `${t.area}㎡`,
      }))
    : [];

  // 4. Media Data 변환
  const media = Array.isArray(mediaLogs)
    ? mediaLogs.map((m) => ({
        label: m.caption || formatDateLabel(m.date),
        url: m.url,
      }))
    : [];

  // 5. Biodiversity 구조 맞추기
  const bioData = {
    before: { fish: 0, inverts: 0 },
    after: { fish: 0, inverts: 0 },
    shannon: { before: 0, after: 0 },
  };

  if (biodiversity) {
    if (biodiversity.before) {
      bioData.before.fish = biodiversity.before.fishCount;
      bioData.before.inverts = biodiversity.before.invertCount;
      bioData.shannon.before = biodiversity.before.shannonIndex;
    }
    if (biodiversity.after) {
      bioData.after.fish = biodiversity.after.fishCount;
      bioData.after.inverts = biodiversity.after.invertCount;
      bioData.shannon.after = biodiversity.after.shannonIndex;
    }
  }

  return {
    basic: {
      ...basic,
      areaSize: `${basic.areaSize}㎡`,
    },
    transplant,
    growth,
    biodiversity: bioData,
    water,
    media,
  };
};