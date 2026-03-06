# 대시보드 최적화 하기

## 1. Render-blocking CSS로 인한 FCP 지연

### 문제
Ocean Campus Dashboard의 Lighthouse/PageSpeed Insights에서 다음 경고가 반복됨.

- `렌더링 차단 요청` (Render-blocking resources)
- 대상: `...css/*.css` (특히 mapbox 스타일)
- 결과: 초기 페인트(FCP/LCP) 지연

핵심은 지도 라이브러리 CSS가 초기 렌더링 임계 경로(critical rendering path)에 들어와 있었던 점이다.

### 기존 코드

`src/components/mapBox/mapView.jsx`에서 정적 import를 사용.

```jsx
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
```

JS에서 `mapboxgl`을 직접 `mapbox-gl-*` 클래스로 쓰지 않아도, Mapbox 내부 DOM이 해당 클래스를 생성하므로 CSS가 실제로 필요하다.

### 적용

1. 정적 import 제거
```diff
 import mapboxgl from "mapbox-gl";
 -import "mapbox-gl/dist/mapbox-gl.css";
```

2. 런타임에 `<link rel="stylesheet">` 주입
```jsx
useEffect(() => {
  if (document.getElementById("mapbox-gl-css")) return;
  const linkEl = document.createElement("link");
  linkEl.id = "mapbox-gl-css";
  linkEl.rel = "stylesheet";
  linkEl.href = "/vendor/mapbox-gl.css";
  document.head.appendChild(linkEl);
}, []);
```

이 구조는 초기 렌더 경로에서 `mapbox-gl.css`를 떼어내고, 마운트 시점에 나중으로 로드한다.

---

## 2. Mapbox 텔레메트리 요청(`/events/v2`) 제거

### 문제
초기 네트워크에서 다음 요청이 보였고, 매우 작은 크기지만 지연이 커서 체인 병목이 발생했다.

- `/events/v2?access_token=...` (events.mapbox.com)

### 적용

`events.mapbox.com/events/v2`는 런타임 텔레메트리 경로이다.  
초기에 시도한 코드가 실패한 이유는 `EVENTS_URL`이 setter가 없는 getter-only 프로퍼티였기 때문이다.

```jsx
mapboxgl.config.EVENTS_URL = null; // 실패 (setter 없음)
```

최종 적용한 방식:

```jsx
try {
  Object.defineProperty(mapboxgl.config, "EVENTS_URL", {
    configurable: true,
    enumerable: true,
    get: () => null,
  });
} catch (err) {
  console.warn("[Mapbox] Failed to disable telemetry events URL:", err);
}
```

- `defineProperty`로 `EVENTS_URL` 접근을 가로채 `null`을 반환하게 변경
- 라이브러리 내부에서 `if (index.e.EVENTS_URL)` 형태로 분기하므로 텔레메트리 요청을 막음
