# OC-DASHBOARD

해양 생태 복원 현황을 지도 기반으로 시각화하는 대시보드 웹 애플리케이션입니다.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **Map:** Mapbox GL
- **Chart:** ECharts
- **Data Fetching:** TanStack React Query + Axios

## Getting Started

```bash
npm install
npm run dev
```

`https://localhost:3000`에서 확인할 수 있습니다.

## Environment Variables

`.env.local` 파일에 아래 변수를 설정합니다.

```env
NEXT_PUBLIC_API_BASE_URL=
NEXT_PUBLIC_MAPBOX_TOKEN=
NEXT_PUBLIC_S3_PUBLIC_BASE=
```

## Docker

```bash
docker build \
  --build-arg NEXT_PUBLIC_API_BASE_URL=https://example.com \
  --build-arg NEXT_PUBLIC_MAPBOX_TOKEN=pk.xxx \
  --build-arg NEXT_PUBLIC_S3_PUBLIC_BASE=https://s3.example.com \
  -t oc-dashboard .

docker run -p 3000:3000 oc-dashboard
```

## CI/CD

`main` 브랜치에 push하면 GitHub Actions가 Docker 이미지를 빌드하여 GHCR에 자동 배포합니다.
