# ryong.log 기능 문서 (2026-06-25)

이 문서는 현재 코드베이스 기준 기능 지도를 제공합니다. 다음 작업(기능 추가/개편) 전에 빠르게 전체 구조를 이해하기 위한 용도입니다.

## 1. 아키텍처 요약

- 프레임워크: Next.js App Router (`src/app`)
- 콘텐츠 소스: Notion Database (`src/lib/notion.ts`)
- 렌더링: ISR + 캐시 태그 재검증
- 이력서: 코드 데이터/컴포넌트 기반 렌더링 + 클라이언트 A4 PDF 생성

## 2. 사용자 라우트

| 경로 | 설명 | 주요 파일 |
|---|---|---|
| `/` | 전체 포스트 목록, 태그/시리즈 필터 | `src/app/page.tsx` |
| `/tags/[tag]` | 태그별 포스트 목록 | `src/app/tags/[tag]/page.tsx` |
| `/series/[series]` | 시리즈별 포스트 목록 | `src/app/series/[series]/page.tsx` |
| `/posts/[slug]` | 포스트 상세, 본문/TOC/댓글/관련글 | `src/app/posts/[slug]/page.tsx` |
| `/portfolio` | 포트폴리오 링크 허브 | `src/app/portfolio/page.tsx` |
| `/resume` | 코드 기반 이력서 및 PDF 다운로드 | `src/app/resume/page.tsx` |

## 3. API 라우트

| 경로 | 메서드 | 설명 | 주요 파일 |
|---|---|---|---|
| `/api/notion-media` | GET | Notion 만료 미디어 URL 재조회(cover/icon) | `src/app/api/notion-media/route.ts` |
| `/api/notion-webhook` | GET/POST | Notion Webhook 검증 및 경로 재검증 | `src/app/api/notion-webhook/route.ts` |
| `/api/og` | GET | OG 이미지 생성 | `src/app/api/og/route.tsx` |

## 4. UI 시스템

### 4.1 헤더 우측 컨트롤

- 검색 오버레이: `HeaderSearchOverlay`
- 앱 런처: `AppLauncherMenu`
- 설정 패널: `ThemeSettingsMenu`
- 공통 아이콘 버튼 UI: `IconControlButton`

### 4.2 검색 UX (현재 동작)

- 돋보기 버튼으로 전역 포털 오버레이 오픈
- 배경 포스트 그리드는 고정 유지
- 검색 결과 카드는 오버레이 내부에서만 필터링/표시
- 단축키 지원:
  - `Cmd/Ctrl + K`: 오픈
  - `/`: 입력 포커스 아님 상태에서 오픈
  - `Esc`: 닫기

### 4.3 포스트 카드/아이콘

- 카드 컴포넌트: `PostCard`
- 아이콘 렌더러: `PostPageIcon`
- Notion 파일 아이콘은 정사각 컨테이너 + `object-contain` 정책 사용

### 4.4 이력서

- 데이터 소스: `src/features/resume/resume-data.ts`
- 렌더러: `src/features/resume/components/ResumeDocument.tsx`
- PDF 생성: `src/features/resume/lib/build-resume-pdf.ts`
- 이미지 자산: `public/resume/*`
- 화면은 하나의 긴 문서로 렌더링하고, 다운로드 시 동일 DOM을 A4 높이로 잘라 PDF를 생성

## 5. 데이터/캐시

### 5.1 Notion 데이터 레이어

- DB 스키마 자동 탐지: `getDatabaseSchema*`
- 포스트 목록 조회: `getPosts`
- 상세 조회: `getPostBySlug`, `getPostByPageId`
- 블록 조회: `getPageBlocks`

### 5.2 캐시 전략

- 기본 ISR: 1시간 (`revalidate = 3600`)
- 개발 캐시 TTL은 운영보다 짧게 설정
- `NOTION_CACHE_TAGS`로 schema/posts/blocks 태그 분리
- Webhook/수동 API에서 태그+경로 재검증

## 6. 이력서 관리

- PDF 업로드 관리자 흐름은 사용하지 않음
- 문구/섹션/기술 스택 수정은 `resume-data.ts`에서 진행
- 프로필 사진, 회사 로고, 프로젝트 스크린샷, 기술 아이콘은 `public/resume/*`에 파일로 보관
- `/resume`의 다운로드 버튼은 `html-to-image`와 `pdf-lib`로 현재 DOM을 PDF로 변환

## 7. 환경변수

- 콘텐츠:
  - `NOTION_API_KEY`
  - `NOTION_DATABASE_ID`
  - `NOTION_WEBHOOK_VERIFICATION_TOKEN` (옵션)
  - `NOTION_REVALIDATE_SECRET` (수동 재검증 사용 시)
- 사이트:
  - `NEXT_PUBLIC_SITE_URL`

## 8. 운영 체크리스트

배포 전:

1. `npm run lint`
2. `npm run build`
3. 홈/태그/시리즈/상세 렌더 확인
4. 헤더 검색 오버레이 동작 확인
5. `/resume` 화면 렌더링과 PDF 다운로드 확인

장애 의심 시:

1. Notion 토큰/DB 권한 확인
2. Webhook 서명 토큰 일치 확인
3. 이력서 이미지 자산 경로와 PDF 생성 콘솔 오류 확인
