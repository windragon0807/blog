import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import Script from 'next/script'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { ThemeProvider } from 'next-themes'
import { BodyScrollbars } from '@/components/BodyScrollbars'
import { Header } from '@/components/Header'
import { QueryProvider } from '@/components/providers/QueryProvider'
import { SmoothScrollProvider } from '@/components/SmoothScrollProvider'
import { ScrollToTopButton } from '@/components/ScrollToTopButton'
import {
  BLOG_THEME_PALETTES,
  BLOG_THEME_VALUES,
  DEFAULT_BLOG_THEME,
} from '@/lib/blogThemes'
import { CODE_THEME_STYLE_TEXT, CODE_THEME_VALUES } from '@/lib/codeThemes'
import {
  DEFAULT_FONT_THEME,
  FONT_THEME_VALUES,
  getFontThemeStack,
} from '@/lib/fontThemes'
import {
  SITE_AUTHOR,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
  ogImageUrl,
} from '@/lib/seo'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

const codeThemeBootScript = `(() => {
  try {
    const supportedThemes = ${JSON.stringify(CODE_THEME_VALUES)};
    const theme = localStorage.getItem('code-theme');
    if (theme && supportedThemes.includes(theme)) {
      document.documentElement.setAttribute('data-code-theme', theme);
    }
  } catch {}
})();`

const fontThemeBootScript = `(() => {
  try {
    const supportedThemes = ${JSON.stringify(FONT_THEME_VALUES)};
    const defaultTheme = ${JSON.stringify(DEFAULT_FONT_THEME)};
    const fontStacks = ${JSON.stringify(
      Object.fromEntries(
        FONT_THEME_VALUES.map((theme) => [theme, getFontThemeStack(theme)])
      )
    )};
    const stored = localStorage.getItem('font-theme');
    const theme = stored && supportedThemes.includes(stored) ? stored : defaultTheme;
    const root = document.documentElement;
    const stack = fontStacks[theme] || fontStacks[defaultTheme];
    root.setAttribute('data-font-theme', theme);
    root.style.setProperty('--font-user', stack);
    document.body?.style.setProperty('font-family', stack);
  } catch {
    const root = document.documentElement;
    root.setAttribute('data-font-theme', ${JSON.stringify(DEFAULT_FONT_THEME)});
    const stack = ${JSON.stringify(getFontThemeStack(DEFAULT_FONT_THEME))};
    root.style.setProperty('--font-user', stack);
    document.body?.style.setProperty('font-family', stack);
  }
})();`

const blogThemeBootScript = `(() => {
  const applyTheme = (theme, palette) => {
    const root = document.documentElement;
    root.setAttribute('data-blog-theme', theme);
    root.style.setProperty('--theme-accent', palette.accent);
    root.style.setProperty('--theme-accent-dark', palette.accentDark);
    root.style.setProperty('--theme-selection-bg', palette.selection);
    root.style.setProperty('--theme-progress-start', palette.progressStart);
    root.style.setProperty('--theme-progress-mid', palette.progressMid);
    root.style.setProperty('--theme-progress-end', palette.progressEnd);
    root.style.setProperty('--theme-progress-glow', palette.progressGlow);
    root.style.setProperty('--theme-progress-dark-start', palette.progressDarkStart);
    root.style.setProperty('--theme-progress-dark-mid', palette.progressDarkMid);
    root.style.setProperty('--theme-progress-dark-end', palette.progressDarkEnd);
    root.style.setProperty('--theme-progress-dark-glow', palette.progressDarkGlow);
    root.style.setProperty('--theme-inline-code-bg', palette.inlineCodeBg);
    root.style.setProperty('--theme-inline-code-border', palette.inlineCodeBorder);
    root.style.setProperty('--theme-inline-code-text', palette.inlineCodeText);
    root.style.setProperty('--theme-inline-code-dark-bg', palette.inlineCodeDarkBg);
    root.style.setProperty('--theme-inline-code-dark-border', palette.inlineCodeDarkBorder);
    root.style.setProperty('--theme-inline-code-dark-text', palette.inlineCodeDarkText);
  };

  try {
    const supportedThemes = ${JSON.stringify(BLOG_THEME_VALUES)};
    const defaultTheme = ${JSON.stringify(DEFAULT_BLOG_THEME)};
    const palettes = ${JSON.stringify(BLOG_THEME_PALETTES)};
    const stored = localStorage.getItem('blog-theme');
    const isUserSetTheme = localStorage.getItem('blog-theme-user-set') === 'true';
    const isLegacyExplicitTheme = stored && supportedThemes.includes(stored) && stored !== 'moss';
    const theme = (isUserSetTheme || isLegacyExplicitTheme) && stored && supportedThemes.includes(stored)
      ? stored
      : defaultTheme;
    const palette = palettes[theme] || palettes[defaultTheme];
    applyTheme(theme, palette);
  } catch {
    applyTheme(${JSON.stringify(DEFAULT_BLOG_THEME)}, ${JSON.stringify(
      BLOG_THEME_PALETTES[DEFAULT_BLOG_THEME]
    )});
  }
})();`

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  authors: [{ name: SITE_AUTHOR }],
  creator: SITE_AUTHOR,
  keywords: [
    '프론트엔드',
    'Next.js',
    'React',
    'UI 컴포넌트',
    '개발 블로그',
  ],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    type: 'website',
    locale: 'ko_KR',
    url: '/',
    siteName: SITE_NAME,
    images: [
      {
        url: ogImageUrl(SITE_NAME, ['Frontend', 'React', 'Next.js']),
        width: 1200,
        height: 630,
        alt: SITE_NAME,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: [ogImageUrl(SITE_NAME, ['Frontend', 'React', 'Next.js'])],
  },
  icons: {
    icon: [{ url: '/icon.png', type: 'image/png' }],
    shortcut: [{ url: '/icon.png', type: 'image/png' }],
    apple: [{ url: '/apple-icon.png', type: 'image/png' }],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <style id="code-theme-style-map">{CODE_THEME_STYLE_TEXT}</style>
      </head>
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-background text-foreground antialiased`}
      >
        <Script id="code-theme-init" strategy="beforeInteractive">
          {codeThemeBootScript}
        </Script>
        <Script id="blog-theme-init" strategy="beforeInteractive">
          {blogThemeBootScript}
        </Script>
        <Script id="font-theme-init" strategy="beforeInteractive">
          {fontThemeBootScript}
        </Script>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <QueryProvider>
            <BodyScrollbars />
            <SmoothScrollProvider />
            <Header />
            <main className="max-w-3xl mx-auto px-4 pt-8 pb-16">{children}</main>
            <ScrollToTopButton />
          </QueryProvider>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
