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
import {
  BLOG_THEME_PALETTES,
  BLOG_THEME_CUSTOM_COLOR_STORAGE_KEY,
  BLOG_THEME_STORAGE_KEY,
  BLOG_THEME_USER_SET_STORAGE_KEY,
  BLOG_THEME_VALUES,
  CUSTOM_THEME_DARK_SURFACE,
  CUSTOM_THEME_LIGHT_SURFACE,
  DEFAULT_BLOG_THEME,
  MINIMUM_TEXT_CONTRAST,
} from '@/lib/blogThemes'
import {
  CODE_THEME_STORAGE_KEY,
  CODE_THEME_STYLE_TEXT,
  CODE_THEME_VALUES,
} from '@/lib/codeThemes'
import {
  ALL_FONT_WEIGHTS,
  DEFAULT_FONT_THEME,
  FONT_THEME_WEIGHT_MAP,
  FONT_THEME_STORAGE_KEY,
  FONT_THEME_VALUES,
  getFontThemeStack,
} from '@/lib/fontThemes'
import {
  DEFAULT_READING_PREFERENCES,
  READING_FONT_SIZE_CSS,
  READING_FONT_SIZE_OPTIONS,
  READING_LINE_HEIGHT_CSS,
  READING_LINE_HEIGHT_OPTIONS,
  READING_PREFERENCE_STORAGE_KEYS,
} from '@/lib/readingPreferences'
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
    const theme = localStorage.getItem(${JSON.stringify(CODE_THEME_STORAGE_KEY)});
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
    const stored = localStorage.getItem(${JSON.stringify(FONT_THEME_STORAGE_KEY)});
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

const readingPreferencesBootScript = `(() => {
  const defaults = ${JSON.stringify(DEFAULT_READING_PREFERENCES)};
  const keys = ${JSON.stringify(READING_PREFERENCE_STORAGE_KEYS)};
  const fontSizes = ${JSON.stringify(READING_FONT_SIZE_CSS)};
  const lineHeights = ${JSON.stringify(READING_LINE_HEIGHT_CSS)};
  const supportedFontSizes = ${JSON.stringify(
    READING_FONT_SIZE_OPTIONS.map(({ value }) => value)
  )};
  const supportedLineHeights = ${JSON.stringify(
    READING_LINE_HEIGHT_OPTIONS.map(({ value }) => value)
  )};
  const allFontWeights = ${JSON.stringify(ALL_FONT_WEIGHTS)};
  const fontWeightMap = ${JSON.stringify(FONT_THEME_WEIGHT_MAP)};
  const root = document.documentElement;

  const apply = (preferences) => {
    root.setAttribute('data-reading-font-weight', String(preferences.fontWeight));
    root.setAttribute('data-reading-font-size', preferences.fontSize);
    root.setAttribute('data-reading-line-height', preferences.lineHeight);
    root.style.setProperty('--reading-font-weight', String(preferences.fontWeight));
    root.style.setProperty('--reading-font-size', fontSizes[preferences.fontSize]);
    root.style.setProperty('--reading-line-height', lineHeights[preferences.lineHeight]);
    if (preferences.reducedMotion) {
      root.setAttribute('data-reduced-motion', 'true');
    } else {
      root.removeAttribute('data-reduced-motion');
    }
  };

  try {
    const fontTheme = root.getAttribute('data-font-theme') || ${JSON.stringify(
      DEFAULT_FONT_THEME
    )};
    const supportedWeights = fontWeightMap[fontTheme] || [defaults.fontWeight];
    const storedWeightValue = localStorage.getItem(keys.fontWeight);
    const storedWeight = Number(storedWeightValue);
    const requestedWeight = storedWeightValue && allFontWeights.includes(storedWeight)
      ? storedWeight
      : defaults.fontWeight;
    const fontWeight = supportedWeights.reduce((closest, weight) =>
      Math.abs(weight - requestedWeight) < Math.abs(closest - requestedWeight)
        ? weight
        : closest
    );
    const storedFontSize = localStorage.getItem(keys.fontSize);
    const storedLineHeight = localStorage.getItem(keys.lineHeight);

    apply({
      fontWeight,
      fontSize: supportedFontSizes.includes(storedFontSize)
        ? storedFontSize
        : defaults.fontSize,
      lineHeight: supportedLineHeights.includes(storedLineHeight)
        ? storedLineHeight
        : defaults.lineHeight,
      reducedMotion: localStorage.getItem(keys.reducedMotion) === 'true',
    });
  } catch {
    apply(defaults);
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

  const isHexColor = (value) => /^#[0-9a-f]{6}$/i.test(value || '');
  const minimumTextContrast = ${JSON.stringify(MINIMUM_TEXT_CONTRAST)};
  const lightSurface = ${JSON.stringify(CUSTOM_THEME_LIGHT_SURFACE)};
  const darkSurface = ${JSON.stringify(CUSTOM_THEME_DARK_SURFACE)};
  const parseHexColor = (color) => [
    Number.parseInt(color.slice(1, 3), 16),
    Number.parseInt(color.slice(3, 5), 16),
    Number.parseInt(color.slice(5, 7), 16),
  ];
  const formatHexColor = (channels) => '#' + channels
    .map((channel) => channel.toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase();
  const mixHexColors = (background, foreground, foregroundRatio) => {
    const backgroundChannels = parseHexColor(background);
    const foregroundChannels = parseHexColor(foreground);
    return formatHexColor(backgroundChannels.map((channel, index) =>
      Math.round(
        channel * (1 - foregroundRatio) +
        foregroundChannels[index] * foregroundRatio
      )
    ));
  };
  const getRelativeLuminance = (color) => {
    const channels = parseHexColor(color).map((channel) => {
      const normalized = channel / 255;
      return normalized <= 0.04045
        ? normalized / 12.92
        : ((normalized + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
  };
  const getContrastRatio = (foreground, background) => {
    const foregroundLuminance = getRelativeLuminance(foreground);
    const backgroundLuminance = getRelativeLuminance(background);
    return (
      Math.max(foregroundLuminance, backgroundLuminance) + 0.05
    ) / (
      Math.min(foregroundLuminance, backgroundLuminance) + 0.05
    );
  };
  const ensureContrast = (color, background) => {
    if (getContrastRatio(color, background) >= minimumTextContrast) return color;
    const target = getContrastRatio('#000000', background) >= getContrastRatio('#FFFFFF', background)
      ? '#000000'
      : '#FFFFFF';
    let lowerBound = 0;
    let upperBound = 1;
    let bestColor = target;
    for (let index = 0; index < 24; index += 1) {
      const ratio = (lowerBound + upperBound) / 2;
      const candidate = mixHexColors(color, target, ratio);
      if (getContrastRatio(candidate, background) >= minimumTextContrast) {
        bestColor = candidate;
        upperBound = ratio;
      } else {
        lowerBound = ratio;
      }
    }
    return bestColor;
  };
  const createCustomPalette = (color) => {
    const accent = color.toUpperCase();
    const lightText = ensureContrast(accent, lightSurface);
    const darkText = ensureContrast(accent, darkSurface);
    const lightInlineText = ensureContrast(
      accent,
      mixHexColors(lightSurface, accent, 0.1)
    );
    const darkInlineText = ensureContrast(
      accent,
      mixHexColors(darkSurface, accent, 0.22)
    );
    return {
      accent: lightText,
      accentDark: darkText,
      selection: \`color-mix(in srgb, \${accent} 24%, transparent)\`,
      progressStart: \`color-mix(in srgb, \${accent} 76%, #111827)\`,
      progressMid: accent,
      progressEnd: \`color-mix(in srgb, \${accent} 45%, #ffffff)\`,
      progressGlow: \`color-mix(in srgb, \${accent} 34%, transparent)\`,
      progressDarkStart: \`color-mix(in srgb, \${accent} 78%, #ffffff)\`,
      progressDarkMid: \`color-mix(in srgb, \${accent} 88%, #ffffff)\`,
      progressDarkEnd: \`color-mix(in srgb, \${accent} 42%, #ffffff)\`,
      progressDarkGlow: \`color-mix(in srgb, \${accent} 28%, transparent)\`,
      inlineCodeBg: \`color-mix(in srgb, \${accent} 10%, transparent)\`,
      inlineCodeBorder: \`color-mix(in srgb, \${accent} 28%, transparent)\`,
      inlineCodeText: lightInlineText,
      inlineCodeDarkBg: \`color-mix(in srgb, \${accent} 22%, transparent)\`,
      inlineCodeDarkBorder: \`color-mix(in srgb, \${accent} 44%, transparent)\`,
      inlineCodeDarkText: darkInlineText,
    };
  };

  try {
    const supportedThemes = ${JSON.stringify(BLOG_THEME_VALUES)};
    const defaultTheme = ${JSON.stringify(DEFAULT_BLOG_THEME)};
    const palettes = ${JSON.stringify(BLOG_THEME_PALETTES)};
    const stored = localStorage.getItem(${JSON.stringify(BLOG_THEME_STORAGE_KEY)});
    const customColor = localStorage.getItem(${JSON.stringify(
      BLOG_THEME_CUSTOM_COLOR_STORAGE_KEY
    )});
    const isUserSetTheme = localStorage.getItem(${JSON.stringify(
      BLOG_THEME_USER_SET_STORAGE_KEY
    )}) === 'true';
    if (isUserSetTheme && stored === 'custom' && isHexColor(customColor)) {
      applyTheme('custom', createCustomPalette(customColor));
      return;
    }
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
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.png', type: 'image/png', sizes: '1024x1024' },
    ],
    shortcut: [{ url: '/favicon.ico', sizes: 'any' }],
    apple: [{ url: '/apple-icon.png', type: 'image/png', sizes: '180x180' }],
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
        <meta name="color-scheme" content="light dark" />
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
        <Script id="reading-preferences-init" strategy="beforeInteractive">
          {readingPreferencesBootScript}
        </Script>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <QueryProvider>
            <BodyScrollbars />
            <SmoothScrollProvider />
            <Header />
            <main className="max-w-3xl mx-auto px-4 pt-8 pb-16">{children}</main>
          </QueryProvider>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
