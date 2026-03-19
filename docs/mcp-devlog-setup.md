# MCP Notion 자동 문서화 설정 가이드

## 목적

이 서버는 Codex가 현재 브랜치의 작업 내용을 Git에서 수집하고, Notion의 devlog 전용 데이터베이스 안에 KST 기준 하루 1개 페이지로 기록할 수 있도록 돕는 로컬 MCP 서버입니다.

## 1. Notion integration 준비

1. Notion integration을 생성합니다.
2. integration capability에서 최소 아래 권한을 켭니다.
   - `read_content`
   - `update_content`
3. devlog database를 둘 부모 프로젝트 페이지에 integration을 공유합니다.
4. integration secret과 부모 페이지 ID를 준비합니다.

## 2. 환경 변수 추가

프로젝트 루트의 `.env.local`에 아래 값을 추가합니다.

```bash
NOTION_API_KEY=secret_xxx
NOTION_PROJECT_PAGE_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NOTION_DEVLOG_DATA_SOURCE_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

`NOTION_PROJECT_PAGE_ID`는 devlog database를 만들 부모 프로젝트 페이지 ID 또는 URL입니다.

`NOTION_DEVLOG_DATA_SOURCE_ID`는 선택값입니다. 이미 만든 devlog data source를 고정해서 쓰고 싶을 때만 넣습니다. 비워두면 아래 규칙으로 자동 처리합니다.

- 부모 페이지 아래 제목이 `piuda Devlog Calendar`인 data source가 1개면 재사용
- 없으면 첫 append 시 full-page database와 data source를 자동 생성
- 2개 이상이면 오기록 방지를 위해 에러 반환

## 3. 설정 점검

아래 명령으로 Git/Notion 설정을 확인합니다.

```bash
npm run mcp:devlog:doctor
```

정상이라면 현재 브랜치, merge-base, 부모 페이지 접근 결과, devlog data source 해석 결과가 출력됩니다.

## 4. Codex에 MCP 서버 연결

현재 프로젝트 루트에서 아래 명령을 실행합니다.

```bash
codex mcp add devlog -- npm run mcp:devlog
```

추가 후 확인:

```bash
codex mcp list
```

필요하면 Codex 세션을 다시 시작합니다.

## 5. 사용 흐름

Codex에서 다음처럼 요청합니다.

```text
지금까지 작업내용 문서화해줘
```

권장 흐름:

1. Codex가 `validate_notion_target` 호출
2. Codex가 `collect_work_context`, `load_devlog_template` 호출
3. 템플릿에 맞는 한국어 초안을 채팅에 출력
4. 사용자가 초안을 확인
5. 확인되면 Codex가 `append_project_devlog` 호출
6. 서버가 KST 기준 오늘 페이지를 찾고, 없으면 생성한 뒤 그 페이지 하단에 append

## 6. 일일 페이지 동작

- 기준 시간대: `Asia/Seoul`
- 페이지 title: `YYYY-MM-DD`
- `Date` 속성: 같은 날짜 문자열
- 같은 날짜 페이지가 있으면 본문만 append
- 같은 날짜 페이지가 2개 이상이면 중복으로 판단하고 실패

첫 append에서 database가 자동 생성되면 Notion UI에서 calendar view를 한 번만 추가하면 됩니다. 캘린더 뷰 자체는 현재 공개 API 대상이 아닙니다.

## 7. append 시 권장 heading 형식

Notion 누적 섹션 헤딩은 아래 형식을 권장합니다.

```text
## YYYY-MM-DD HH:mm | {branch} | {shortSha}
```

예:

```text
## 2026-03-18 19:10 | feature/mcp-devlog | a1b2c3d
```

## 제공 tool

- `collect_work_context`
  - 현재 브랜치의 merge-base 이후 커밋과 working tree 변경사항 수집
- `load_devlog_template`
  - 저장소의 개발일지 템플릿 로드
- `validate_notion_target`
  - 부모 프로젝트 페이지, devlog data source, 오늘 페이지 해석 가능성 확인
- `append_project_devlog`
  - 확인된 markdown을 KST 기준 오늘의 devlog 페이지 하단에 append

## 구현 메모

- 문서 초안 생성은 별도 OpenAI API가 아니라 Codex가 수행합니다.
- MCP 서버는 Git/Notion 접근과 기록만 담당합니다.
- append는 Notion markdown API의 `insert_content` 방식을 사용해 일일 페이지 끝에 새 섹션을 추가합니다.
- devlog database 생성은 부모 프로젝트 페이지 아래에서 1회 자동 부트스트랩됩니다.
