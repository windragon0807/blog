export type ResumeText = {
  text: string;
  emphasis?: readonly string[];
};

export type ResumeTechnology = {
  label: string;
  icon?: string;
};

export type ResumeProject = {
  title: string;
  icon?: string;
  iconAlt?: string;
  technologies?: readonly string[];
  facts?: readonly { label: string; value: string }[];
  sections?: readonly {
    label: string;
    items?: readonly ResumeText[];
    groups?: readonly { label: string; items: readonly string[] }[];
  }[];
  body?: readonly ResumeText[];
};

export type ResumeBulletItem = ResumeText | { project: ResumeProject };

export type ResumeHighlight = {
  icon?: string;
  iconAlt?: string;
  title?: ResumeText;
  paragraphs?: readonly ResumeText[];
  bullets?: readonly ResumeBulletItem[];
  sections?: readonly { label: string; items: readonly ResumeText[] }[];
};

export type ResumeEntry = {
  id: string;
  period: string;
  name: string;
  subtitle?: string;
  role?: string;
  logo: string;
  logoAlt: string;
  technologies?: readonly string[];
  paragraphs?: readonly ResumeText[];
  highlights?: readonly ResumeHighlight[];
  screenshots?: readonly string[];
  compact?: boolean;
};

export type ResumeSection = {
  id: string;
  title: string;
  durationStart?: {
    year: number;
    month: number;
  };
  entries: readonly ResumeEntry[];
};

const t = (text: string, emphasis?: readonly string[]): ResumeText => ({
  text,
  emphasis,
});

export const resumeProfile = {
  name: '정승룡',
  role: 'Product Engineer',
  photo: '/resume/profile/avatar.jpg',
} as const;

export const resumeIntroduction = {
  title: '자기소개',
  text: '5년차 개발자로, 에듀테크 도메인에서 유저들의 불편사항을 기술로 빠르게 해결해왔습니다. 현재는 토피아라이브에서 FE를 리딩하며, 대학원에서 스터디 중인 AI를 활용하여 기존에 해결하지 못했던 문제들을 자동화하는데 기여하고 있습니다.\n\n주어진 개발보다 도메인 안에서 발생하는 문제들을 직접 발견하고, 가설을 세워서 이를 검증하고 성과를 공유하는 경험을 쌓아왔습니다. 그 과정에서 복잡하고 흩어져 있는 맥락을 단순한 문제로 추상화하며, 다양한 강점을 가진 분들과 협력하는 가치를 중시합니다.',
} as const;

export const resumeMotivation = {
  title: '지원 동기',
  text: '오프라인 교육 현장의 문제를 온라인으로 푸는 에듀테크 스타트업의 초기 멤버로 참여했습니다. 서비스를 밑바닥부터 구축하고 운영을 자동화하여 현장의 불편을 성공적으로 개선했던 경험이 있습니다.\n\n또한, 민원 서식 키오스크를 개발하여 제주도청, 성동구청 등에 도입해 운영했던 경험이 있습니다. 시각장애인이 스크린 리딩으로 서식을 작성할 수 있도록, 시맨틱 태그와 키보드 포커스를 맞춰 접근성을 챙기며 개발했습니다.\n\n위 경험들을 기반으로, 토스플레이스에서 매장마다 달라 복잡해진 주문·결제 현장의 문제를 단순한 문제로 풀어 기술로 해결하는 일에 기여하고 싶습니다.',
} as const;

export const resumeTechnologies: readonly ResumeTechnology[] = [
  { label: 'Next.js', icon: '/resume/skills/nextjs.svg' },
  { label: 'React', icon: '/resume/skills/react.svg' },
  { label: 'TypeScript', icon: '/resume/skills/typescript.svg' },
  { label: 'React Query', icon: '/resume/skills/react-query.svg' },
  { label: 'Zustand', icon: '/resume/skills/zustand.svg' },
  { label: 'Tailwind CSS', icon: '/resume/skills/tailwind.svg' },
  { label: 'Emotion', icon: '/resume/skills/emotion.svg' },
  { label: 'Playwright', icon: '/resume/skills/playwright.svg' },
  { label: 'Storybook', icon: '/resume/skills/storybook.svg' },
  { label: 'Sentry', icon: '/resume/skills/sentry.svg' },
  { label: 'Google Analytics', icon: '/resume/skills/google-analytics.svg' },
  { label: 'React Native (Expo)', icon: '/resume/skills/react.svg' },
  { label: 'Express', icon: '/resume/skills/express.svg' },
  { label: 'MariaDB', icon: '/resume/skills/mariadb.svg' },
];

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
          'Tailwind CSS',
          'Emotion',
          'Flutter',
          'Express',
          'MariaDB',
          'Playwright',
        ],
        highlights: [
          {
            title: t('실시간 온라인 영어교육 플랫폼 TOPIA Live 전체 서비스 개발 및 운영', [
              'TOPIA Live',
            ]),
            bullets: [
              t(
                '24년 1월 33명에서 26년 9월 동시 재원생 700+명까지 유저 수를 유치하고, 손익분기점(BEP) 달성에 기여했습니다.',
                ['33명', '700+명', '손익분기점(BEP)'],
              ),
              {
                project: {
                  title: 'TOPIA Growth AI Agents 개발',
                  icon: '/resume/logos/topia-growth.png',
                  iconAlt: 'TOPIA Growth',
                  technologies: [
                    'Python',
                    'FastAPI',
                    'LangChain',
                    'LangGraph',
                    'OpenAI',
                    'MariaDB Vector',
                  ],
                  sections: [
                    {
                      label: '배경 및 문제',
                      items: [
                        t(
                          '할당된 학생이 많아 강사가 모든 학생 데이터를 확인하고 정량 평가를 작성하기 부담되는 상황',
                        ),
                        t(
                          '자녀의 구체적인 성장 내용을 잦은 주기로 피드백을 원하는 학부모의 요구에 대응이 어려운 상황',
                        ),
                        t(
                          '학생들이 Writing 과제를 AI에 통째로 맡기고 검토 없이 제출해서 걱정이라는 CS 문의가 증가',
                          ['AI에 통째로 맡기고'],
                        ),
                        t(
                          '서비스 이용 전에 익혀야 할 서비스 정보와 외부 서비스 접근 방법이 복잡하여 사용자가 적응에 어려움을 겪고 이탈하는 상황',
                        ),
                      ],
                    },
                    {
                      label: '해결',
                      items: [
                        t(
                          '학생별 학습 데이터를 수집·분석해, LLM이 주간·학기별 성장 리포트를 작성하는 Report Agent 개발',
                          ['Report Agent'],
                        ),
                        t(
                          '지난 Writing 과제와 첨삭 내용을 분석해, 학생이 스스로 생각하면서 새 과제를 작성하도록 돕는 Writing Tutor Agent 개발',
                          ['Writing Tutor Agent'],
                        ),
                        t(
                          '흩어진 서비스 도메인 지식과 온보딩 가이드를 통합한 RAG 기반 Agent 구축',
                          ['RAG 기반 Agent'],
                        ),
                      ],
                    },
                    {
                      label: '결과',
                      items: [
                        t('전체 발행 리포트 대비 좋아요 20%, 댓글 5%', ['좋아요 20%', '댓글 5%']),
                        t(
                          '내용이 정확하고 더 자주 받고 싶다는 네이버 블로그 학부모 후기 5건 이상',
                          ['학부모 후기 5건 이상'],
                        ),
                        t('Writing 과제 할당 학생의 60%가 사용, 1인당 주당 평균 10회', [
                          '60%',
                          '주당 평균 10회',
                        ]),
                        t('배포 후 AI로 과제를 대신 작성했다는 학부모 문의 0건', [
                          '학부모 문의 0건',
                        ]),
                        t('서비스 이용에 대한 CS 문의 대폭 감소', ['대폭 감소']),
                      ],
                    },
                  ],
                },
              },
              {
                project: {
                  title: 'Zoom 수업 통합 및 출석 자동화',
                  icon: '/resume/logos/zoom.png',
                  iconAlt: 'Zoom',
                  sections: [
                    {
                      label: '배경 및 문제',
                      items: [
                        t(
                          '수업이 별도 Zoom Client에서 열려, 서비스 창을 오가며 진행해야 하는 불편',
                          ['Zoom Client'],
                        ),
                        t(
                          '외부 Zoom Client와 자사 서비스의 유저 프로필 매칭이 되지 않아 출석 확인에 한계',
                          ['프로필 매칭'],
                        ),
                      ],
                    },
                    {
                      label: '해결',
                      items: [
                        t(
                          'Zoom SDK를 활용하여 수업을 서비스 안에 내재화하고 출석체크 시스템 자동화 구축',
                          ['Zoom SDK'],
                        ),
                        t('매니저의 Zoom 수업 관제 시스템 개발', ['Zoom 수업 관제 시스템']),
                        t(
                          'Zoom 수업 동영상·transcript를 S3에 배치로 저장해 학생 성장 분석에 활용할 데이터 수집',
                          ['S3'],
                        ),
                      ],
                    },
                    {
                      label: '결과',
                      items: [
                        t('Zoom 수업이 열리지 않는다는 원격 지원 0건', ['원격 지원 0건']),
                        t(
                          '수업마다 링크에 들어가 관제하던 것을, 서비스 안에서 관제하며 수업 분위기 파악 가능',
                          ['수업 분위기 파악'],
                        ),
                      ],
                    },
                  ],
                },
              },
              {
                project: {
                  title: 'PSPDFKit을 대체한 과제 첨삭 에디터 개발',
                  icon: '/resume/logos/pdf.svg',
                  iconAlt: 'PDF',
                  sections: [
                    {
                      label: '배경 및 문제',
                      items: [
                        t('학생의 PDF 과제 수행과 첨삭에 쓰이던 PSPDFKit 구독료가 부담되는 상황', [
                          'PSPDFKit 구독료',
                        ]),
                        t('에디터를 처음부터 개발하면 구현·유지보수 범위가 커지는 상황'),
                      ],
                    },
                    {
                      label: '해결',
                      items: [
                        t(
                          '오픈소스 pdf.js를 포크해 서비스에 필요한 기능을 선별·재구축하는 방식 선택',
                          ['pdf.js'],
                        ),
                        t(
                          '불필요한 기능을 제거하고, 서비스 디자인에 맞게 에디터를 직접 디자인해 단독으로 개편',
                          ['직접 디자인'],
                        ),
                        t('PDF와 학생이 제출한 사진을 같은 에디터에서 첨삭할 수 있도록 개발', [
                          '사진을 같은 에디터에서',
                        ]),
                      ],
                    },
                    {
                      label: '결과',
                      items: [
                        t('PSPDFKit 구독 해지로 지출 예산 절약', ['지출 예산 절약']),
                        t('현재 전체 학생이 과제 첨삭에 직접 만든 에디터를 사용', ['전체 학생']),
                      ],
                    },
                  ],
                },
              },
              {
                project: {
                  title: 'Shadowing 녹음 구조 개선 및 발음평가 결과 수신 시간 단축',
                  icon: '/resume/logos/topia-live.png',
                  iconAlt: 'TOPIA Live',
                  sections: [
                    {
                      label: '배경 및 문제',
                      items: [
                        t(
                          '기존 레거시 코드의 간헐적인 이슈 제보에 대해 수정 대응 후에도 디바이스·브라우저별 오류가 반복되어 유저의 컨플레인이 지속되는 상황',
                          ['디바이스·브라우저별 오류'],
                        ),
                        t('모든 테스트 기기를 확보하기 어려운 환경'),
                        t(
                          '녹음·발음평가 로직이 여러 훅에 흩어져 있어 수정과 유지보수가 어려운 구조',
                          ['여러 훅'],
                        ),
                      ],
                    },
                    {
                      label: '해결',
                      items: [
                        t(
                          'Sentry 에러 로깅 환경을 구축해 오류가 발생한 디바이스·브라우저 정보 수집',
                          ['Sentry'],
                        ),
                        t(
                          '녹음·발음평가 로직을 선언적으로 사용할 수 있는 공통 훅으로 통합하고 웹 녹음 호환성 개선',
                          ['공통 훅'],
                        ),
                        t(
                          '녹음 파일을 S3에 업로드 이후 백엔드가 파일을 다시 내려받아 Azure 발음평가를 요청하던 비효율적인 워크플로우 전면 개선',
                        ),
                      ],
                    },
                    {
                      label: '결과',
                      items: [
                        t(
                          '프론트엔드 단에서 낙관적 업데이트를 반영하여 실제 발음평가 결과 수신 시간을 4초에서 0.5초로 단축',
                          ['4초에서 0.5초'],
                        ),
                        t('관련 커밋 배포 이후 약 3개월 간 관련 이슈 제보 0건', ['이슈 제보 0건']),
                      ],
                    },
                  ],
                },
              },
              {
                project: {
                  title: 'CRA to Next.js 마이그레이션 및 홈 화면 최적화',
                  icon: '/resume/skills/nextjs.svg',
                  iconAlt: 'Next.js',
                  sections: [
                    {
                      label: '배경 및 문제',
                      items: [
                        t(
                          'CRA·CSR 구조에서 페이지 성격에 따라 렌더링 전략을 다양화할 수 있도록 Next.js 마이그레이션 결정',
                          ['Next.js'],
                        ),
                        t(
                          '첫 화면인 홈에서 최적화되지 않은 API와 useEffect 내부 fetch로 Network Waterfall 지연 발생',
                          ['Network Waterfall'],
                        ),
                      ],
                    },
                    {
                      label: '해결',
                      items: [
                        t(
                          '클라이언트 컴포넌트부터 점진적으로 전환하는 방식으로 마이그레이션을 단독으로 수행',
                          ['점진적으로 전환'],
                        ),
                        t(
                          '화면 구성에 맞춰진 API를 걷어내 단순화한 뒤, BFF에서 애플리케이션 사이드 조인으로 변경',
                          ['애플리케이션 사이드 조인'],
                        ),
                        t(
                          '클라이언트 네트워크 요청을 React Query를 활용하여 요청마다 다른 캐싱 정책을 적용하여 최적화',
                          ['React Query'],
                        ),
                      ],
                    },
                    {
                      label: '결과',
                      items: [
                        t('1주일 만에 Next.js 마이그레이션 성공 및 안정화', ['1주일']),
                        t('평균 LCP 40% 단축, 클라이언트 JS 번들 크기 50% 감소', [
                          'LCP 40%',
                          '번들 크기 50%',
                        ]),
                        t('Network Waterfall 시간 50% 단축', ['50%']),
                      ],
                    },
                  ],
                },
              },
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
          t(
            '연구소의 STT, TTS 모델을 활용한 AI 기반 서비스의 선행 개발을 담당했습니다. 이후 팀을 옮겨 STT, 발음평가 AI 모델 기반의 RockieTalkie를 개발했습니다.',
            ['STT, TTS 모델', 'RockieTalkie'],
          ),
        ],
        highlights: [
          {
            icon: '/resume/logos/rockie-talkie.png',
            iconAlt: 'RockieTalkie',
            title: t('AI 아동 영어 학습 서비스 RockieTalkie 초기 파운데이션 구축, 개발 및 릴리즈', [
              'RockieTalkie',
            ]),
            sections: [
              {
                label: '배경 및 문제',
                items: [
                  t(
                    'STT 모델을 활용한 영어 학습 서비스로, 음성 입력·분석 과정에서의 성능과 사용성이 핵심 과제',
                    ['STT 모델'],
                  ),
                  t(
                    '음성 처리와 애니메이션·렌더링이 동시에 발생해 메인 스레드 부하와 프레임 드랍이 발생',
                    ['메인 스레드 부하', '프레임 드랍'],
                  ),
                  t(
                    '방대한 컴포넌트와 40여 개의 음성 파일 로드로 1.5초 이상의 지연과 인터랙션 프리징이 발생',
                    ['40여 개의 음성 파일', '1.5초 이상의 지연'],
                  ),
                  t('짧은 배포 주기에서 반복되는 의존성 설치가 CI/CD 파이프라인의 병목', [
                    'CI/CD 파이프라인',
                  ]),
                ],
              },
              {
                label: '해결',
                items: [
                  t(
                    'AudioWorklet 기반 멀티 스레딩으로 음성 처리 로직을 메인 스레드에서 분리하고 선언적으로 추상화',
                    ['AudioWorklet', '멀티 스레딩'],
                  ),
                  t(
                    'Intersection Observer 기반 지연 로딩으로 음성 파일 로드와 화면 프리징을 해소',
                    ['Intersection Observer'],
                  ),
                  t('Yarn Berry와 Zero-Install로 반복 설치를 제거', ['Yarn Berry', 'Zero-Install']),
                  t('칸반 기반 개발 프로세스를 도입하고, TanStack Query로 캐싱해 API 호출을 줄임', [
                    '칸반',
                    'TanStack Query',
                  ]),
                  t('Next.js 기반 렌더링 구조를 정비해 초기 로딩과 유지보수성을 개선', ['Next.js']),
                ],
              },
              {
                label: '결과',
                items: [
                  t('오디오 연산 중에도 초당 60 프레임의 끊김 없는 시각화로 인터랙션 안정성 확보', [
                    '초당 60 프레임',
                  ]),
                  t('TTI를 0.2초 이하로 약 86% 단축', ['TTI를 0.2초 이하', '약 86%']),
                  t(
                    '의존성 용량 약 75% 절감(615MB→155MB), 빌드 시간을 2분 18초에서 47초로 약 66% 단축',
                    ['75% 절감(615MB→155MB)', '약 66%'],
                  ),
                  t('초기 로딩 속도 약 40% 개선', ['약 40%']),
                ],
              },
            ],
          },
          {
            icon: '/resume/logos/kiosk.png',
            iconAlt: '배리어프리 키오스크',
            title: t('음성인식 기반 배리어프리 키오스크 웹 개발', ['배리어프리 키오스크']),
            sections: [
              {
                label: '배경 및 문제',
                items: [
                  t(
                    '시각·신체적 제약이 있는 사용자를 포함해 다양한 사용자군이 접근 가능한 키오스크 UX 필요',
                    ['다양한 사용자군'],
                  ),
                  t('접근성을 기능이 아닌 시스템 차원에서 보장하는 구조 설계 목표'),
                ],
              },
              {
                label: '해결',
                items: [
                  t(
                    'WCAG 2.1 AA 기준을 준수하는 컴포넌트 설계 및 axe-core 기반 접근성 테스트 자동화 구성',
                    ['WCAG 2.1 AA', 'axe-core'],
                  ),
                  t(
                    '실 사용자 피드백과 모니터링을 기반으로 스크린 리딩 속도 조절, 큰 글씨 모드, 휠체어 사용자용 낮은 화면 모드 등 UX 개선',
                    ['스크린 리딩 속도 조절, 큰 글씨 모드, 휠체어 사용자용 낮은 화면 모드'],
                  ),
                  t('RTK(Redux Toolkit)를 도입해 상태 관리 보일러플레이트 약 60% 단순화', [
                    'RTK(Redux Toolkit)',
                    '약 60%',
                  ]),
                ],
              },
              {
                label: '결과',
                items: [
                  t('공공기관(성동구) 및 사회복지관에 도입, 3년 이상 장기 운영', [
                    '공공기관(성동구) 및 사회복지관',
                    '3년 이상',
                  ]),
                  t('접근성 품질 인증 마크 획득', ['접근성 품질 인증 마크']),
                  t('다양한 사용자 환경을 고려한 키오스크 UX 구현'),
                ],
              },
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
            icon: '/resume/logos/lg.png',
            iconAlt: 'LG',
            title: t('반려로봇 안드로이드 앱 PoC (LG) 참여', ['반려로봇 안드로이드 앱 PoC']),
            bullets: [
              t('안드로이드 앱 화면 UI/UX 구현', ['UI/UX']),
              t('Sensory SDK를 활용해 음성 인식 기반의 앱 기능 연동', ['Sensory SDK']),
              t('Firebase를 활용하여 사용자의 상태를 실시간으로 연동', ['Firebase']),
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
        role: 'Full Stack',
        logo: '/resume/logos/openrun.png',
        logoAlt: 'OpenRun',
        technologies: [
          'Next.js',
          'React',
          'TypeScript',
          'React Query',
          'Tailwind CSS',
          'React Native (Expo)',
          'Java',
          'Spring Boot',
          'MySQL',
          'QueryDSL',
          'Web3j',
        ],
        paragraphs: [
          t(
            '오픈런이란 다양한 사람들과 달리기 모임에 참여하고, NFT 아바타를 획득하여 나만의 개성을 표현할 수 있는 커뮤니티 기반 M2E dApp입니다. XRP Ledger(XRPL) 글로벌 해커톤에 참여하여 프로젝트의 독창성을 인정받아 본선 진출 성과를 거두었습니다.',
            ['오픈런', 'NFT 아바타', 'XRP Ledger(XRPL) 글로벌 해커톤', '본선 진출'],
          ),
          t(
            '백엔드 2명, 프론트엔드 1명, 디자이너 1명으로 구성된 팀 프로젝트로 프론트엔드와 앱을 단독 개발하였고, UI/UX 디자인에 기여했습니다.',
            ['프론트엔드와 앱을 단독 개발', 'UI/UX 디자인'],
          ),
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
                '드래그를 놓으면 뚝뚝 끊기던 평균 페이스 휠을, 놓기 직전 100ms의 속도와 마찰, 눈금 스냅을 requestAnimationFrame으로 직접 굴려 iOS Picker처럼 이어지게 했습니다. 이동량은 프레임 수가 아니라 경과 시간에 묶어, 60Hz와 120Hz가 같은 시간에 비슷하게 돌게 했습니다.',
                ['100ms', 'requestAnimationFrame', 'iOS Picker', '60Hz와 120Hz'],
              ),
              t(
                'NFT 민팅에 필요한 지갑 인증이 Web2 OAuth보다 복잡해, SSO 방식의 Wallet Connect로 같은 체감의 연결을 만들고 진입 장벽을 낮췄습니다.',
                ['Web2 OAuth', 'Wallet Connect'],
              ),
              t(
                '서버 컴포넌트와 클라이언트에 흩어진 시간 변환을 렌더링 직전으로 모으고, Intl.DateTimeFormat으로 사용자 로컬 타임에 맞춰 나라마다 표시 시간이 어긋나지 않게 했습니다.',
                ['Intl.DateTimeFormat', '로컬 타임'],
              ),
              t(
                '화면마다 WebView를 새로 띄우면 캐시가 갈라지고 전환이 느려졌습니다. 스택 관리 대신 iOS 제스처(allowsBackForwardNavigationGestures)로 추가 리소스 없이 뒤로 가기를 연결했습니다.',
                ['allowsBackForwardNavigationGestures'],
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
        id: 'korea-university-ai',
        period: '2026.09 ~ 재학 중',
        name: '고려대학교',
        subtitle: 'SW·AI융합대학원',
        role: '인공지능융합학과',
        logo: '/resume/logos/korea-university.png',
        logoAlt: 'Korea University',
      },
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
              t(
                '자료구조, 알고리즘, 데이터베이스, 네트워크, 컴퓨터 구조 등 전반적인 컴퓨터 공학 이론을 학습했습니다.',
              ),
              t(
                '데이터마이닝 연구실의 우수 학부생 연구 지원 프로그램(CURT)에 단독으로 선발되어 팀 프로젝트를 통해 협업에 필요한 커뮤니케이션을 경험했습니다.',
                ['우수 학부생 연구 지원 프로그램(CURT)', '단독으로 선발'],
              ),
              t('졸업 학기에 학점 연계형 인턴십을 병행하여 실무 경험을 체득했습니다.', [
                '학점 연계형 인턴십',
                '실무 경험',
              ]),
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
];
