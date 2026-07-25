# 홈 Client Router Cache 설계

## 목표

- `/` → `/posts/*` → `/` 재방문 시 이전 홈 UI를 즉시 재사용한다.
- 클라이언트 라우터 캐시 TTL은 5분(300초)이다.
- 서버 Notion `unstable_cache` / ISR(`revalidate = 3600`)은 변경하지 않는다.

## 결정

| 항목 | 선택 |
|---|---|
| 접근 | A. Next.js Client Router Cache (`experimental.staleTimes`) |
| TTL | `dynamic: 300`, `static: 300` |
| 서버 posts 캐시 | 기존 1시간 유지 |
| 홈 데이터 소유 | RSC `getPosts()` 유지 (react-query로 이전하지 않음) |
| `loading.tsx` | 유지 (cold start / stale 이후 재요청 시에만 노출) |

## 변경

- `next.config.ts`의 `experimental.staleTimes`에 `dynamic`/`static` 300 설정

## 비범위

- 홈 목록을 react-query로 전환
- `/api/posts` staleTime 변경
- Notion `CACHE_TTL_SECONDS` / page `revalidate` 변경

## 검증

1. `next start`(또는 prod)에서 `/` 로드 → 포스트 진입 → 홈 복귀
2. 5분 이내: 스켈레톤 없이 이전 홈 UI가 바로 보여야 함
3. 5분 경과 후 홈 복귀: Flight 재요청 허용 (`loading.tsx` 가능)
4. `next dev`는 캐시가 약해 보일 수 있으므로 판정 기준에서 제외

## 리스크

- `staleTimes`는 experimental이며 Next 메이저에서 API가 바뀔 수 있다.
- 5분 동안 홈 UI는 클라이언트에 고정되므로, 그 사이 Notion webhook으로 서버 캐시가 갱신돼도 재방문 전에는 반영되지 않는다. (의도된 SWR 성격)
