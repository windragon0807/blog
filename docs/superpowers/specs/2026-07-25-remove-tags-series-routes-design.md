# Remove orphan `/tags` · `/series` routes

Date: 2026-07-25  
Status: approved (chat) → implement

## Goal

홈에서 진입점이 끊긴 orphan 라우트 `/tags/[tag]`, `/series/[series]`와, 그 전용 UI·집계·사이드이펙트 훅을 제거한다. Notion 실제 스키마에 tags/series 속성이 없어 배지 UI는 사실상 dead path다.

## Scope (Approach A)

### Remove

- Pages: `src/app/tags/[tag]/page.tsx`, `src/app/series/[series]/page.tsx`
- Components: `TagFilter`, `SeriesFilter`, `SeriesTimeline`, `FilterChip`
- Notion helpers: `getPostsByTag`, `getAllTags`, `getPostsBySeries`, `getAllSeries`
- Sitemap tag/series URL entries
- Webhook `revalidatePath` for `/tags/*`, `/series/*` and response fields `revalidatedTags` / `revalidatedSeries`
- PostCard / post detail tag·series badge blocks (including series `Link`)

### Keep

- `Post.tags` / `Post.series` and Notion schema fallback parsing
- SEO/OG usage of `post.tags` (empty array today)
- `Badge variant="series"` (bookmark card in block-renderers)

### Docs

- `docs/PROJECT_FEATURES.md`: drop tag/series routes, fix home description and checklist
- `DESIGN.md`: drop `FilterChip` from common composites

## Non-goals

- Removing tags/series from `Post` type or Notion schema detection
- Changing badge `series` variant used by bookmark UI
- Commit/push (unless separately requested)

## Verification

- `pnpm lint` (and typecheck if available)
- Grep: no remaining `/tags/` or `/series/` app routes or imports of deleted modules
- Do not run `pnpm build` unless requested (dev-server safety)
