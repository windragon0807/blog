# ryong.log 코드 컨벤션

이 문서는 ryong.log의 유지보수 기준입니다. 공개된 토스 기술 문화에서 강조하는 읽기 쉬운 코드, 예측 가능한 책임, 변경 영향의 지역화 원칙을 참고하되, 토스의 사내 규칙을 복제하거나 공식 컨벤션이라고 주장하지 않습니다. 이 저장소의 현재 구조와 회귀 계약에 맞춘 프로젝트 규칙입니다.

## 1. 변경 원칙

- 동작을 짧고 명시적인 이름과 단방향 의존성으로 설명합니다.
- 관련 로직은 가까이 두고, 다른 영역에서 재사용할 때만 안정적인 공개 진입점을 만듭니다.
- 기존 기능, UI, 문구, DOM, 반응형 배치, animation timing을 호환성 계약으로 취급합니다.
- 리팩터링과 동작 변경을 한 변경 묶음에 섞지 않습니다.
- 규칙은 문서만으로 끝내지 않고 `tests/contracts`의 정적 계약으로 가능한 범위까지 검증합니다.

## 2. 공개 facade와 내부 runtime folder

`src/lib`의 기존 공개 경로는 consumer와의 호환성을 위한 facade입니다. 구현을 옮겨도 기존 `@/lib/*` import path와 named export는 유지합니다.

```txt
src/lib/
├─ client/   # 브라우저 전용 구현
├─ server/   # 서버 전용 구현과 환경변수 접근
├─ domain/   # 프레임워크와 런타임에 독립적인 순수 규칙
└─ *.ts      # 기존 public facade 또는 아직 이동하지 않은 legacy module
```

- facade는 명시적인 named re-export만 제공합니다. `export *`로 내부 API를 우연히 공개하지 않습니다.
- 구현 이동만을 이유로 기존 consumer import를 일괄 수정하지 않습니다.
- 새 내부 모듈은 역할에 맞는 runtime folder에 둡니다. 경계가 불분명하면 기존 위치를 유지하고 먼저 계약을 보강합니다.

## 3. runtime 경계

### Client

- `src/lib/client/**`는 `client-only`를 직접 import합니다.
- domain과 shared type에는 의존할 수 있지만 server module에는 직접 또는 간접으로 의존하지 않습니다.
- 브라우저 API는 client 경계 안에서만 사용하고, module import 시점의 부수 효과를 만들지 않습니다.

### Server

- `src/lib/server/**`는 `server-only`를 직접 import합니다.
- domain과 shared type에는 의존할 수 있지만 client module이나 브라우저 global에는 의존하지 않습니다.
- 기존 server-only legacy module도 marker를 직접 import해 잘못된 client bundle 유입을 조기에 실패시킵니다.

### Domain

- `src/lib/domain/**`는 React, Next.js, browser global, `process.env`에 의존하지 않습니다.
- domain module은 domain과 `src/types`만 runtime dependency로 사용합니다.
- 같은 입력에는 같은 출력을 반환하는 순수 로직을 우선하며, I/O와 캐시는 경계 바깥에서 주입합니다.

## 4. import 규칙

- feature 또는 같은 책임의 작은 폴더 내부에서는 가까운 상대 경로 import를 허용합니다.
- feature/runtime 경계를 넘을 때는 `@/` alias 또는 기존 `@/lib/*` facade를 사용합니다.
- 두 단계 이상 상위로 이동하는 `../../` 계열 import는 새로 만들지 않습니다.
- type만 필요한 경우 `import type` 또는 type-only export를 사용해 runtime edge를 만들지 않습니다.
- non-literal dynamic `import()`와 `require()`는 정적 경계 검증을 우회하므로 제품 `src/**`에서 사용하지 않습니다.

## 5. 이름과 export

- React component와 type은 `PascalCase`, hook은 `use` 접두사, 일반 함수와 변수는 `camelCase`를 사용합니다.
- boolean은 의미에 맞게 `is`, `has`, `can`, `should` 접두사를 우선합니다.
- module 수준 상수는 변경되지 않는 설정값일 때 `UPPER_SNAKE_CASE`를 사용합니다.
- 새 내부 source filename은 `kebab-case`를 기본으로 합니다. 기존 public filename은 호환성을 위해 임의로 바꾸지 않습니다.
- 재사용 module은 named export를 기본으로 합니다. Next.js route/page/layout과 도구 설정처럼 framework가 요구하는 default export는 예외입니다.
- 이름은 구현 방식보다 역할과 반환 의미를 드러냅니다. 모호한 `data`, `item`, `handler`, `utils` 범위를 불필요하게 넓히지 않습니다.

## 6. 오류 처리

- 오류를 빈 `catch`로 삼키거나 정상 값처럼 위장하지 않습니다.
- 복구 가능한 오류만 가장 가까운 I/O 경계에서 처리합니다. 복구할 수 없으면 원래 `cause`와 문맥을 보존해 다시 던집니다.
- 외부 API의 불확실한 응답은 server boundary에서 좁히고, 내부 domain에는 검증된 값만 전달합니다.
- 사용자에게 보이는 fallback, loading, error UI는 기존 UX 계약입니다. 리팩터링만으로 문구나 표시 시점을 바꾸지 않습니다.
- 로그에 token, secret, 원문 환경변수 값을 남기지 않습니다.

## 7. 환경변수

- 제품 `src/**`의 raw `process.env` 접근은 `src/lib/server/env.ts`에서만 합니다.
- getter는 값을 변환하지 않고 호출 시점마다 읽습니다. trim, fallback, 필수값 검증은 기존 consumer의 의미와 평가 시점을 유지합니다.
- 새 환경변수는 같은 변경에서 `.env.example`에도 추가합니다.
- secret에는 `NEXT_PUBLIC_` 접두사를 사용하지 않습니다.
- `NEXT_PUBLIC_SITE_URL`처럼 surface별 fallback이 다른 값은 임의로 하나로 합치지 않습니다.

## 8. UI와 visual contract

- CSS, JSX, semantic tag, 접근성 속성, focus 처리, animation을 바꾸기 전 관련 visual/interaction contract를 먼저 준비합니다.
- 접근성 개선도 기존 시각 결과를 보존합니다. 새 focus ring, 간격, 줄바꿈, 색상, motion 변화가 필요하면 별도 UI 변경으로 검토합니다.
- style 정리와 component 분리는 screenshot baseline과 keyboard/pointer interaction 계약을 통과해야 합니다.
- 성능 최적화 때문에 animation, 콘텐츠, 접근 가능한 이름을 제거하거나 화면 구조를 단순화하지 않습니다.

## 9. formatting과 성능 최적화

- repo 전체 Prettier 적용이나 global format rewrite를 하지 않습니다. 수정한 파일은 기존 인접 코드 스타일을 따르고, 기계적 formatting은 기능 리팩터링과 분리합니다.
- `memo`, `useMemo`, `useCallback`, cache, lazy loading, prefetch를 측정 근거 없이 추가하지 않습니다.
- 최적화 전 병목과 요청 중복을 재현하고, 적용 후 render 수, 요청 수, 응답 시간 또는 bundle 변화를 같은 조건에서 비교합니다.
- prefetch는 사용자 intent, 네트워크 상태, 중복 제거, 동시성 제한을 고려하며 실제 navigation을 막지 않습니다.
- 성능 개선이 UI/UX 계약을 바꾸면 최적화가 아니라 별도 제품 변경으로 다룹니다.

## 10. 검증 기준

변경 범위에 따라 아래 검증을 조합합니다.

```bash
pnpm typecheck
pnpm lint
pnpm test:contracts
pnpm test:browser
git diff --check
```

build와 dev server 조작은 작업 범위와 사용자 승인 없이 실행하지 않습니다.
