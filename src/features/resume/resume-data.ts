export type ResumeText = {
  text: string
  emphasis?: readonly string[]
}

export type ResumeTechnology = {
  label: string
  icon?: string
}

export type ResumeLink = {
  label: string
  value: string
  href: string
  icon: string
}

export type ResumeHighlight = {
  icon?: string
  iconAlt?: string
  title?: ResumeText
  paragraphs?: readonly ResumeText[]
  bullets?: readonly ResumeText[]
}

export type ResumeEntry = {
  id: string
  period: string
  name: string
  role?: string
  logo: string
  logoAlt: string
  technologies?: readonly string[]
  paragraphs?: readonly ResumeText[]
  highlights?: readonly ResumeHighlight[]
  screenshots?: readonly string[]
  compact?: boolean
}

export type ResumeSection = {
  id: string
  title: string
  summary?: string
  durationStart?: {
    year: number
    month: number
  }
  entries: readonly ResumeEntry[]
}

const t = (text: string, emphasis?: readonly string[]): ResumeText => ({
  text,
  emphasis,
})

export const resumeProfile = {
  name: '정승룡',
  role: 'Product Engineer',
  photo: '/resume/profile/avatar-square.jpg',
  basics: [
    { label: '나이', value: '1995년' },
    { label: '주소', value: '서울시 서대문구' },
    { label: '이메일', value: 'tmdfyd95@naver.com' },
  ],
} as const

export const resumeBirthDate = {
  year: 1995,
  month: 2,
  day: 2,
} as const

export const resumeTechnologies: readonly ResumeTechnology[] = [
  { label: 'Next.js', icon: '/resume/skills/nextjs.svg' },
  { label: 'React', icon: '/resume/skills/react.svg' },
  { label: 'TypeScript', icon: '/resume/skills/typescript.svg' },
  { label: 'React Query', icon: '/resume/skills/react-query.svg' },
  { label: 'Zustand', icon: '/resume/skills/zustand.svg' },
  { label: 'Redux', icon: '/resume/skills/redux.svg' },
  { label: 'Tailwind', icon: '/resume/skills/tailwind.svg' },
  { label: 'Emotion', icon: '/resume/skills/emotion.svg' },
  { label: 'Playwright', icon: '/resume/skills/playwright.svg' },
  { label: 'Storybook', icon: '/resume/skills/storybook.svg' },
  { label: 'Sentry', icon: '/resume/skills/sentry.svg' },
  { label: 'Google Analytics', icon: '/resume/skills/google-analytics.svg' },
  { label: 'React Native (Expo)', icon: '/resume/skills/react.svg' },
  { label: 'Express', icon: '/resume/skills/express.svg' },
  { label: 'MySQL', icon: '/resume/skills/mysql.svg' },
]

export const resumeLinks: readonly ResumeLink[] = [
  {
    label: 'Github',
    value: 'github.com/windragon0807',
    href: 'https://github.com/windragon0807',
    icon: '/resume/logos/github.png',
  },
  {
    label: 'Blog',
    value: 'ryong.blog',
    href: 'https://ryong.blog/',
    icon: '/resume/logos/notion.png',
  },
]

export const resumeSections: readonly ResumeSection[] = [
  {
    id: 'career',
    title: '경력',
    durationStart: {
      year: 2022,
      month: 1,
    },
    entries: [
      {
        id: 'topia',
        period: '2024.01 ~ 재직 중',
        name: '토피아에드테크',
        role: 'Full Stack',
        logo: '/resume/logos/topia.png',
        logoAlt: 'TOPIA EdTech',
        technologies: [
          'Next.js',
          'React',
          'TypeScript',
          'React Query',
          'Zustand',
          'Tailwind',
          'Emotion',
          'Flutter',
          'Express',
          'MySQL',
          'Playwright',
        ],
        highlights: [
          {
            icon: '/resume/logos/topia-live.png',
            iconAlt: 'TOPIA Live',
            title: t('실시간 온라인 영어교육 플랫폼 TOPIA Live 전체 서비스 개발 및 운영', [
              'TOPIA Live',
            ]),
            bullets: [
              t('24년 1월 33명에서 26년 3월 동시 재원생 700+명까지 유저 수 유치에 기여했습니다.', [
                '33명',
                '700+명',
              ]),
              t(
                '서비스 특성에 최적화된 다양한 렌더링 전략을 확보하기 위해 CRA to Next.js 마이그레이션을 독자적으로 진행하였습니다. Next.js 기반 아키텍처 변경 및 클라이언트 컴포넌트 중심의 점진적 전환을 통해 단 1주일 만에 안정적인 배포를 완료했습니다.',
                ['CRA to Next.js 마이그레이션', '단 1주일 만에 안정적인 배포']
              ),
              t(
                '기존의 CSR 기반 구조에서 데이터 페칭 권한을 서버로 위임하는 Server-first 아키텍처로 리팩토링했습니다. 이 과정에서 컴포넌트별로 산재했던 중복 API 호출과 Network Waterfall 문제를 근본적으로 해결하였으며, 평균 LCP 40% 단축 및 클라이언트 JS 번들 크기 50% 감소라는 성과를 거두었습니다.',
                [
                  'Server-first 아키텍처',
                  'Network Waterfall 문제',
                  '평균 LCP 40% 단축',
                  '클라이언트 JS 번들 크기 50% 감소',
                ]
              ),
              t(
                '외부 서비스인 Zoom API를 내부 시스템과 연동하여 실시간 수업 관제 및 출석 자동화 시스템을 구축하고, 학생별 VTT 자막 데이터 기반의 발화 통계 분석 기능을 구현했습니다. 이를 통해 이전에는 수동으로 대응했었던 출석 시스템을 자동화하고, 학생 개별 발화 데이터를 기반으로 맞춤형 피드백을 제공할 수 있는 기반을 마련했습니다.',
                ['Zoom API', '출석 자동화 시스템', '발화 통계 분석 기능']
              ),
              t(
                '내부 재현이 불가능했던 발화 기반 서비스의 간헐적 데이터 유실 문제를 해결하고자, 기존 Playwright E2E 테스트 커버리지를 확장했습니다. 하지만 정적 파일을 업로드하는 테스트 방식의 한계로 인해 실시간 환경의 가변적 변수를 재현하는 데는 어려움이 있었습니다. 이를 해결하고자 Sentry 실시간 로그 분석으로 디바이스 환경을 역추적하여 재현 불가능했던 결함을 근본적으로 해결했습니다.',
                ['Playwright E2E 테스트 커버리지', 'Sentry 실시간 로그 분석']
              ),
              t(
                '부족한 QA 리소스로 인한 테스트 병목을 해결하고자 독립적인 검증 환경을 제공하는 사내 DevTools를 개발했습니다. 선형적인 프로세스에 묶여있던 레벨테스트의 단계별 의존성을 제거하여 특정 문항으로 즉시 진입하는 기능을 구현하고, 실제 수업 스케줄과 강사 계정에 종속적이었던 강의실 생성 및 입장 로직을 독립적인 테스트 모드로 분리했습니다. 이를 통해 외부 제약 없는 상시 테스트 환경을 구축하여 QA 소요 시간을 획기적으로 단축하고 개발 생산성(DX)을 개선했습니다.',
                ['사내 DevTools', 'QA 소요 시간을 획기적으로 단축', '개발 생산성(DX)']
              ),
              t(
                '잦은 컨텐츠 변경과 학생 반 이동으로 인한 시스템의 가변성에 대응하고자 유연한 프론트엔드 아키텍처를 설계했습니다. 또한 신속한 대응과 안정적인 코드 품질을 확보하기 위해 AI 기반의 코드 생성 및 검증 워크플로우를 도입했으며, 그 결과 신규 요구사항 대응 시간을 50% 이상으로 크게 단축시켰습니다.',
                ['유연한 프론트엔드 아키텍처', 'AI 기반의 코드 생성 및 검증 워크플로우', '50% 이상']
              ),
            ],
          },
        ],
      },
      {
        id: 'mediazen',
        period: '2022.01 ~ 2023.12',
        name: '미디어젠',
        role: 'Frontend',
        logo: '/resume/logos/mediazen.png',
        logoAlt: 'Mediazen',
        technologies: [
          'React',
          'TypeScript',
          'React Query',
          'Redux',
          'Styled Components',
          'Playwright',
        ],
        paragraphs: [
          t('연구소의 STT, TTS 모델을 활용한 AI 기반 서비스의 선행 개발을 담당했습니다. 이후 팀을 옮겨 STT, 발음평가 AI 모델 기반의 RockieTalkie를 개발했습니다.', [
            'STT, TTS 모델',
            'RockieTalkie',
          ]),
        ],
        highlights: [
          {
            icon: '/resume/logos/rockie-talkie.png',
            iconAlt: 'RockieTalkie',
            title: t('AI 아동 영어 학습 서비스 RockieTalkie 초기 파운데이션 구축, 개발 및 릴리즈', [
              'RockieTalkie',
            ]),
            bullets: [
              t(
                '실시간 음성 데이터 처리 시 발생하는 메인 스레드 부하와 프레임 드랍 문제를 해결하기 위해, AudioWorklet 기반의 멀티 스레딩 방식으로 음성 데이터 처리 로직을 메인 스레드에서 분리하고 선언적으로 활용할 수 있도록 추상화했습니다. 이에 따라, 오디오 연산 중에도 초당 60 프레임의 끊김 없는 시각화 애니메이션을 구현하여 안정적인 UX를 제공했습니다.',
                ['AudioWorklet', '멀티 스레딩', '초당 60 프레임']
              ),
              t(
                '방대한 컴포넌트와 40여 개의 음성 파일 로드로 인해 발생하던 1.5초 이상의 지연과 인터랙션 프리징 현상을 Intersection Observer 기반의 지연 로딩 구조로 해결했습니다. 그 결과, TTI를 0.2초 이하로 약 86% 단축시켰습니다.',
                ['40여 개의 음성 파일', '1.5초 이상의 지연', 'Intersection Observer', 'TTI를 0.2초 이하']
              ),
              t(
                '배포 주기가 짧은 팀의 특성상, 반복되는 의존성 설치가 CI/CD 파이프라인의 병목이 되어 빈번한 코드 변경사항 반영과 속도를 저해하고 있었습니다. 이를 해결하고자 패키지 매니저를 Yarn Berry로 전환하고 Zero-Install 구조를 도입했습니다. 이를 통해 의존성 용량을 약 75% 절감(615MB→155MB)하고, 반복되는 설치 과정을 제거하여 전체 빌드 시간을 2분 18초에서 47초로 약 66% 단축하였습니다.',
                ['Yarn Berry', 'Zero-Install', '75% 절감(615MB→155MB)', '66% 단축']
              ),
            ],
          },
          {
            title: t('음성인식 기반 배리어프리 키오스크 서비스 개발, 3곳의 기관에 도입하여 사회적 가치 창출', [
              '배리어프리 키오스크',
              '3곳의 기관',
            ]),
            bullets: [
              t(
                '복잡한 민원 서식에서 스크린 리더 사용자의 흐름이 끊기는 문제를 해결하기 위해, 비논리적인 포커스 이동 로직을 선언적 포커스 관리 구조로 추상화하였습니다. 그 결과 Lighthouse 접근성 점수 100점 달성 및 W3C(WCAG) 가이드라인의 모든 항목을 완벽히 충족했습니다.',
                ['선언적 포커스 관리 구조', 'Lighthouse 접근성 점수 100점', 'W3C(WCAG)']
              ),
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'experience',
    title: '경험',
    entries: [
      {
        id: 'mediazen-internship',
        period: '2021.06 ~ 2021.12',
        name: '미디어젠',
        role: 'Internship',
        logo: '/resume/logos/mediazen.png',
        logoAlt: 'Mediazen',
        technologies: ['Android', 'Kotlin', 'Firebase', 'Sensory SDK', 'Google Protobuf'],
        highlights: [
          {
            title: t('반려로봇 안드로이드 앱 PoC (LG) 참여', ['반려로봇 안드로이드 앱 PoC']),
            bullets: [
              t(
                'Sensory SDK를 활용해 음성 인식 기반의 앱 기능을 연동하고, Firebase로 사용자의 상태를 실시간 동기화하는 시스템을 구축했습니다. 이 과정에서 외부 전문 SDK를 프로젝트 요구사항에 맞춰 최적화하고 인터페이스로 추상화하는 경험을 했습니다.',
                ['Sensory SDK', 'Firebase', '외부 전문 SDK']
              ),
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'project',
    title: '프로젝트',
    entries: [
      {
        id: 'openrun',
        period: '2025.01 ~ 진행 중',
        name: '오픈런',
        role: 'Frontend ∙ App',
        logo: '/resume/logos/openrun.png',
        logoAlt: 'OpenRun',
        technologies: ['Next.js', 'React', 'TypeScript', 'React Query', 'Tailwind', 'React Native (Expo)'],
        paragraphs: [
          t('오픈런이란 다양한 사람들과 달리기 모임에 참여하고, NFT 아바타를 획득하여 나만의 개성을 표현할 수 있는 커뮤니티 기반 M2E dApp입니다. XRP Ledger(XRPL) 글로벌 해커톤에 참여하여 프로젝트의 독창성을 인정받아 본선 진출 성과를 거두었습니다.', [
            '오픈런',
            'NFT 아바타',
            'XRP Ledger(XRPL) 글로벌 해커톤',
            '본선 진출',
          ]),
          t('백엔드 2명, 프론트엔드 1명, 디자이너 1명으로 구성된 팀 프로젝트로 프론트엔드와 앱을 단독 개발하였고, UI/UX 디자인에 기여했습니다.', [
            '프론트엔드와 앱을 단독 개발',
            'UI/UX 디자인',
          ]),
        ],
        screenshots: [
          '/resume/projects/openrun/01.png',
          '/resume/projects/openrun/02.png',
          '/resume/projects/openrun/03.png',
          '/resume/projects/openrun/04.png',
        ],
        highlights: [
          {
            bullets: [
              t(
                '서비스가 고도화됨에 따라 운영 문서가 지속적으로 늘어났고, 과거에 정의된 사양을 팀원이 정확히 파악하지 못하거나, 관련 내용이 여러 문서에 분산되어 필요한 정보를 찾는 데 불필요한 시간이 소요되는 문제가 반복되었습니다. 이를 해결하기 위해 LangChain과 ChromaDB 기반의 RAG 챗봇 서버를 구축하여, 자연어 질문만으로 관련 문서를 검색하고 출처와 함께 답변을 제공하는 기능을 개발하였습니다. 문서의 최신성을 보장하기 위해 비동기 파일 감시 시스템으로 변경 사항을 벡터 DB에 자동 반영하고, 프론트엔드 코드 변경 시에는 크로스 레포지토리 CI/CD 파이프라인을 통해 GPT가 변경 내역을 분석하여 문서 수정 PR을 자동 생성하도록 구성함으로써, 코드와 문서 간의 불일치를 사전에 방지했습니다.',
                ['LangChain', 'ChromaDB', 'RAG 챗봇 서버', '크로스 레포지토리 CI/CD 파이프라인']
              ),
              t(
                'NFT 민팅을 위해 필수적인 지갑 주소 기반 인증은 사용자에게 익숙한 Web2 OAuth와 달리 복잡한 연동 과정을 필요하여 ‘누구에게나 친숙하게 사용하는 Web3 경험’이라는 서비스의 모토와 상충되었습니다. 이를 해결하기 위해 SSO 방식의 Wallet Connect를 도입하여, 사용자가 기존 Web2 OAuth와 동일한 체감으로 지갑을 연결하고 서비스를 이용할 수 있도록 하여 진입 장벽을 낮췄습니다.',
                ['NFT 민팅', 'Web2 OAuth', 'Wallet Connect']
              ),
              t(
                '서버 컴포넌트와 클라이언트 컴포넌트가 혼재된 구조에서 데이터 변환 시점이 파편화됨에 따라, 사용자 입력 시간과 배포 환경의 표시 시간이 일치하지 않는 문제를 마주했습니다. 이를 해결하기 위해 시간 변환 책임을 최종 출력 단계인 클라이언트 컴포넌트로 일원화하고, Intl.DateTimeFormat을 활용해 렌더링 직전 사용자의 로컬 타임으로 변환하도록 로직을 재설계했습니다. 그 결과 다국가 환경에서도 일관된 사용자 경험을 제공할 수 있었습니다.',
                ['데이터 변환 시점', 'Intl.DateTimeFormat', '로컬 타임']
              ),
              t(
                'WebView 기반 스택 네비게이션 UX를 제공하기 위해 Native Stack 내부에 WebView를 배치하는 등 다양한 구조적 시도를 거듭했으나, 공통 데이터 캐싱 동기화 및 페이지 전환 시의 로딩 지연이라는 성능적 한계에 부딪혔습니다. 이를 해결하기 위해 복잡한 스택 관리 로직 대신 iOS 네이티브 제스처(allowsBackForwardNavigationGestures)를 도입하여, 추가 리소스 소모 없이 네이티브와 동일한 수준의 부드러운 뒤로 가기 경험을 구현하였습니다.',
                ['WebView 기반 스택 네비게이션', 'iOS 네이티브 제스처', 'allowsBackForwardNavigationGestures']
              ),
            ],
          },
        ],
      },
      {
        id: 'moong-trip',
        period: '2024.02 ~ 2024.06',
        name: 'Moong Trip',
        role: 'Frontend',
        logo: '/resume/logos/moong-trip.png',
        logoAlt: 'Moong Trip',
        technologies: ['React', 'TypeScript', 'React Query', 'Emotion', 'Firebase'],
        paragraphs: [
          t('Moong Trip이란 숙소 검색부터 결제까지의 전 과정을 매끄러운 사용자 경험(UX)으로 구현한 숙소 예약 플랫폼 개인 프로젝트입니다.', [
            'Moong Trip',
            '숙소 예약 플랫폼 개인 프로젝트',
          ]),
        ],
        screenshots: [
          '/resume/projects/moong/01.png',
          '/resume/projects/moong/02.png',
          '/resume/projects/moong/03.png',
          '/resume/projects/moong/04.png',
        ],
        highlights: [
          {
            bullets: [
              t(
                '무한 스크롤 방식을 통해 다수의 숙소 데이터를 노출하는 과정에서, 고화질 이미지와 정보가 포함된 리스트 요소들이 지속적으로 누적되며 메모리 과부하 및 화면 버벅임(Jank) 현상이 발생하는 문제를 겪었습니다. 이를 해결하기 위해 react-virtuoso 라이브러리를 도입하여 윈도잉(Windowing) 기법을 적용, 사용자의 현재 뷰포트에 보이는 요소들만 동적으로 렌더링하도록 구조를 개선했습니다. 그 결과, 수백 개의 숙소 데이터가 스크롤되는 환경에서도 불필요한 DOM 요소 생성을 억제하여 렌더링 성능을 확보했으며, 끊김 없는 매끄러운 사용자 경험을 제공할 수 있었습니다.',
                ['무한 스크롤', 'react-virtuoso', '윈도잉(Windowing)', '렌더링 성능']
              ),
              t(
                'Firebase의 전반적인 생태계를 스터디하여 Auth, Firestore, Storage를 연동한 통합 백엔드 환경을 직접 구축했습니다. 리소스 효율을 위해 대용량 이미지와 데이터베이스 관리를 분리하여 설계했으며, 특히 Query Cursor(Snapshot) 방식의 무한 스크롤을 구현해 대량의 숙소 데이터를 성능 저하 없이 안정적으로 불러오도록 쿼리를 최적화했습니다.',
                ['Firebase', 'Auth, Firestore, Storage', 'Query Cursor(Snapshot)']
              ),
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'education',
    title: '학력',
    entries: [
      {
        id: 'korea-university',
        period: '2016.03 ~ 2022.02 (4년)',
        name: '고려대학교 (세종)',
        role: '컴퓨터 정보학과 (4.0/4.5)',
        logo: '/resume/logos/korea-university.png',
        logoAlt: 'Korea University Sejong Campus',
        highlights: [
          {
            bullets: [
              t('자료구조, 알고리즘, 데이터베이스, 네트워크, 컴퓨터 구조 등 전반적인 컴퓨터 공학 이론을 학습했습니다.'),
              t('데이터마이닝 연구실의 우수 학부생 연구 지원 프로그램(CURT)에 유일하게 선발되어 팀 프로젝트를 통해 협업에 필요한 커뮤니케이션을 경험했습니다.', [
                '우수 학부생 연구 지원 프로그램(CURT)',
                '유일하게 선발',
              ]),
              t('졸업 학기에 학점 연계형 인턴십을 병행하여 실무 경험을 체득했습니다.'),
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'certification',
    title: '자격',
    entries: [
      {
        id: 'engineer-information-processing',
        period: '2021.11.26',
        name: '정보처리기사',
        role: '한국산업인력공단',
        logo: '/resume/logos/hrdk.png',
        logoAlt: 'HRDK',
        compact: true,
      },
    ],
  },
]
