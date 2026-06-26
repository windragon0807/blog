/* eslint-disable @next/next/no-img-element */

import { forwardRef, useId } from 'react'
import {
  resumeLinks,
  resumeProfile,
  resumeSections,
  resumeTechnologies,
  type ResumeEntry,
  type ResumeHighlight,
  type ResumeSection,
  type ResumeText,
} from '../resume-data'
import {
  RESUME_DOCUMENT_HEIGHT,
  RESUME_DOCUMENT_WIDTH,
} from '../constants'
import styles from './ResumeDocument.module.css'

function renderRichText(text: ResumeText) {
  const emphasis = text.emphasis ?? []

  if (emphasis.length === 0) {
    return text.text
  }

  const parts: { value: string; strong: boolean }[] = []
  let cursor = 0

  while (cursor < text.text.length) {
    let nextIndex = -1
    let nextPhrase = ''

    for (const phrase of emphasis) {
      const index = text.text.indexOf(phrase, cursor)

      if (index !== -1 && (nextIndex === -1 || index < nextIndex)) {
        nextIndex = index
        nextPhrase = phrase
      }
    }

    if (nextIndex === -1) {
      parts.push({ value: text.text.slice(cursor), strong: false })
      break
    }

    if (nextIndex > cursor) {
      parts.push({ value: text.text.slice(cursor, nextIndex), strong: false })
    }

    parts.push({ value: nextPhrase, strong: true })
    cursor = nextIndex + nextPhrase.length
  }

  return parts.map((part, index) =>
    part.strong ? (
      <strong key={`${part.value}-${index}`}>{part.value}</strong>
    ) : (
      <span key={`${part.value}-${index}`}>{part.value}</span>
    )
  )
}

function ResumeTextBlock({
  text,
  className,
}: {
  text: ResumeText
  className?: string
}) {
  return <p className={className}>{renderRichText(text)}</p>
}

function TechnologyTag({ label }: { label: string }) {
  return <span className={styles.entryTechnology}>{label}</span>
}

function ResumeValueLinkIcon() {
  const gradientId = `resume-link-value-gradient-${useId().replaceAll(':', '')}`

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={styles.linkValueIcon}
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id={gradientId}
          x1="3"
          x2="21"
          y1="3"
          y2="21"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#6d69e8" />
          <stop offset="47%" stopColor="#b461cf" />
          <stop offset="100%" stopColor="#e48792" />
        </linearGradient>
      </defs>
      <g className={styles.linkValueIconBase} stroke="currentColor">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
      </g>
      <g
        className={styles.linkValueIconGradient}
        stroke={`url(#${gradientId})`}
      >
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
      </g>
    </svg>
  )
}

function getKoreaYearMonth() {
  const koreaNow = new Date(Date.now() + 9 * 60 * 60 * 1000)

  return {
    year: koreaNow.getUTCFullYear(),
    month: koreaNow.getUTCMonth() + 1,
  }
}

function formatDurationFrom(start: { year: number; month: number }) {
  const now = getKoreaYearMonth()
  const totalMonths = Math.max(
    0,
    (now.year - start.year) * 12 + (now.month - start.month) + 1
  )
  const years = Math.floor(totalMonths / 12)
  const months = totalMonths % 12
  const parts: string[] = []

  if (years > 0) {
    parts.push(`${years}년`)
  }

  if (months > 0) {
    parts.push(`${months}개월`)
  }

  return parts.length > 0 ? parts.join(' ') : '0개월'
}

function getSectionSummary(section: ResumeSection) {
  if (section.durationStart) {
    return `총 ${formatDurationFrom(section.durationStart)}`
  }

  return section.summary
}

function Highlight({ highlight }: { highlight: ResumeHighlight }) {
  return (
    <div className={styles.highlight}>
      {highlight.title && (
        <div className={styles.highlightTitleRow}>
          {highlight.icon && (
            <span className={styles.highlightIconFrame}>
              <img
                src={highlight.icon}
                alt={highlight.iconAlt ?? ''}
                className={styles.highlightIcon}
              />
            </span>
          )}
          <ResumeTextBlock
            text={highlight.title}
            className={styles.highlightTitle}
          />
        </div>
      )}
      {highlight.paragraphs?.map((paragraph) => (
        <ResumeTextBlock
          key={paragraph.text}
          text={paragraph}
          className={styles.bodyParagraph}
        />
      ))}
      {highlight.bullets && (
        <ul className={styles.bulletList}>
          {highlight.bullets.map((bullet) => (
            <li key={bullet.text}>
              <ResumeTextBlock text={bullet} className={styles.bulletText} />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function ScreenshotStrip({ screenshots, name }: { screenshots: readonly string[]; name: string }) {
  return (
    <div className={styles.screenshotStrip} aria-label={`${name} 앱 스크린샷`}>
      {screenshots.map((screenshot, index) => (
        <img
          key={screenshot}
          src={screenshot}
          alt={`${name} 스크린샷 ${index + 1}`}
          className={styles.projectScreenshot}
        />
      ))}
    </div>
  )
}

function ResumeEntryBlock({ entry }: { entry: ResumeEntry }) {
  return (
    <article
      className={`${styles.entry} ${entry.compact ? styles.compactEntry : ''}`.trim()}
    >
      <span className={styles.entryDot} aria-hidden="true" />
      <aside className={styles.entryMeta}>
        <p className={styles.period}>{entry.period}</p>
        <div className={styles.organization}>
          <img src={entry.logo} alt={entry.logoAlt} className={styles.organizationLogo} />
          <div className={styles.organizationText}>
            <h3>{entry.name}</h3>
            {entry.role && <p>{entry.role}</p>}
          </div>
        </div>
      </aside>
      <div className={styles.entryBody}>
        {entry.technologies && (
          <div className={styles.entryTechnologies}>
            {entry.technologies.map((technology) => (
              <TechnologyTag key={technology} label={technology} />
            ))}
          </div>
        )}
        {entry.paragraphs?.map((paragraph) => (
          <ResumeTextBlock
            key={paragraph.text}
            text={paragraph}
            className={styles.bodyParagraph}
          />
        ))}
        {entry.screenshots && (
          <ScreenshotStrip screenshots={entry.screenshots} name={entry.name} />
        )}
        {entry.highlights?.map((highlight, index) => (
          <Highlight key={`${entry.id}-${index}`} highlight={highlight} />
        ))}
      </div>
    </article>
  )
}

const ResumeDocument = forwardRef<HTMLDivElement>(function ResumeDocument(_, ref) {
  return (
    <div
      ref={ref}
      className={styles.document}
      data-resume-document
      style={{
        width: RESUME_DOCUMENT_WIDTH,
        minHeight: RESUME_DOCUMENT_HEIGHT,
      }}
    >
      <header className={styles.hero}>
        <div className={styles.heroAura} aria-hidden="true" />
        <div className={styles.profilePhotoFrame}>
          <img
            src={resumeProfile.photo}
            alt={`${resumeProfile.name} 프로필 사진`}
            className={styles.profilePhoto}
          />
        </div>
        <div className={styles.identity}>
          <h1>{resumeProfile.name}</h1>
          <p>{resumeProfile.role}</p>
        </div>
        <dl className={styles.basicInfo}>
          {resumeProfile.basics.map((item) => (
            <div key={item.label}>
              <dt>{item.label}</dt>
              <dd>{item.value}</dd>
            </div>
          ))}
        </dl>
        <div className={styles.skillCloud}>
          {resumeTechnologies.map((technology) => (
            <span key={technology.label} className={styles.skillPill}>
              {technology.icon && (
                <img
                  src={technology.icon}
                  alt=""
                  className={styles.skillIcon}
                  aria-hidden="true"
                />
              )}
              {technology.label}
            </span>
          ))}
        </div>
        <div className={styles.linkCards}>
          {resumeLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={styles.linkCard}
              target="_blank"
              rel="noreferrer"
            >
              <span className={styles.linkIconFrame}>
                <img src={link.icon} alt="" className={styles.linkIcon} aria-hidden="true" />
              </span>
              <span>
                <span className={styles.linkLabel}>{link.label}</span>
                <span className={styles.linkValue}>
                  {link.value}
                  <ResumeValueLinkIcon />
                </span>
              </span>
            </a>
          ))}
        </div>
      </header>

      <main className={styles.sectionStack}>
        {resumeSections.map((section) => {
          const sectionSummary = getSectionSummary(section)

          return (
            <section
              key={section.id}
              className={`${styles.section} ${
                section.id === 'career' ? styles.careerSection : ''
              } ${
                section.id === 'project' ? styles.projectSection : ''
              }`.trim()}
            >
              <span className={styles.sectionDot} aria-hidden="true" />
              <div className={styles.sectionHeader}>
                <h2>{section.title}</h2>
                {sectionSummary && <span>{sectionSummary}</span>}
              </div>
              <div className={styles.entryList}>
                {section.entries.map((entry) => (
                  <ResumeEntryBlock key={entry.id} entry={entry} />
                ))}
              </div>
            </section>
          )
        })}
      </main>
      <div className={styles.bottomFade} aria-hidden="true" />
    </div>
  )
})

export { ResumeDocument }
