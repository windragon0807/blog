/* eslint-disable @next/next/no-img-element */

import Link from 'next/link'
import {
  resumeBirthDate,
  resumeLinks,
  resumeProfile,
  resumeSections,
  resumeTechnologies,
  type ResumeEntry,
  type ResumeHighlight,
  type ResumeSection,
  type ResumeText,
} from '../resume-data'
import styles from './ResumeReadableView.module.css'

function getKoreaDate() {
  const koreaNow = new Date(Date.now() + 9 * 60 * 60 * 1000)

  return {
    day: koreaNow.getUTCDate(),
    month: koreaNow.getUTCMonth() + 1,
    year: koreaNow.getUTCFullYear(),
  }
}

function getKoreaYearMonth() {
  const koreaNow = new Date(Date.now() + 9 * 60 * 60 * 1000)

  return {
    month: koreaNow.getUTCMonth() + 1,
    year: koreaNow.getUTCFullYear(),
  }
}

function formatKoreanAge(birthDate: {
  day: number
  month: number
  year: number
}) {
  const today = getKoreaDate()
  const birthdayPassed =
    today.month > birthDate.month ||
    (today.month === birthDate.month && today.day >= birthDate.day)
  const age = today.year - birthDate.year - (birthdayPassed ? 0 : 1)

  return Math.max(0, age)
}

function formatDurationFrom(start: { month: number; year: number }) {
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

function getProfileBasicValue(item: (typeof resumeProfile.basics)[number]) {
  if (item.label !== '나이') {
    return item.value
  }

  return `${resumeBirthDate.year}년 (만 ${formatKoreanAge(resumeBirthDate)}세)`
}

function getSectionSummary(section: ResumeSection) {
  if (section.durationStart) {
    return `총 ${formatDurationFrom(section.durationStart)}`
  }

  return section.summary
}

function renderRichText(text: ResumeText) {
  const emphasis = text.emphasis ?? []

  if (emphasis.length === 0) {
    return text.text
  }

  const parts: { strong: boolean; value: string }[] = []
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
      parts.push({ strong: false, value: text.text.slice(cursor) })
      break
    }

    if (nextIndex > cursor) {
      parts.push({ strong: false, value: text.text.slice(cursor, nextIndex) })
    }

    parts.push({ strong: true, value: nextPhrase })
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

function TextBlock({ text }: { text: ResumeText }) {
  return <p>{renderRichText(text)}</p>
}

function HighlightBlock({ highlight }: { highlight: ResumeHighlight }) {
  return (
    <div className={styles.highlight}>
      {highlight.title && (
        <div className={styles.highlightTitle}>
          {highlight.icon && (
            <img src={highlight.icon} alt={highlight.iconAlt ?? ''} />
          )}
          <TextBlock text={highlight.title} />
        </div>
      )}
      {highlight.paragraphs?.map((paragraph) => (
        <TextBlock key={paragraph.text} text={paragraph} />
      ))}
      {highlight.bullets && (
        <ul className={styles.bulletList}>
          {highlight.bullets.map((bullet) => (
            <li key={bullet.text}>
              <TextBlock text={bullet} />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function EntryBlock({ entry }: { entry: ResumeEntry }) {
  return (
    <article className={styles.entry}>
      <div className={styles.entryMeta}>
        <p className={styles.period}>{entry.period}</p>
        <div className={styles.organization}>
          <img src={entry.logo} alt={entry.logoAlt} />
          <div>
            <h3>{entry.name}</h3>
            {entry.role && <p>{entry.role}</p>}
          </div>
        </div>
      </div>
      <div className={styles.entryBody}>
        {entry.technologies && (
          <ul className={styles.technologyList} aria-label={`${entry.name} 기술 스택`}>
            {entry.technologies.map((technology) => (
              <li key={technology}>{technology}</li>
            ))}
          </ul>
        )}
        {entry.paragraphs?.map((paragraph) => (
          <TextBlock key={paragraph.text} text={paragraph} />
        ))}
        {entry.screenshots && (
          <div className={styles.screenshotGrid}>
            {entry.screenshots.map((screenshot, index) => (
              <img
                key={screenshot}
                src={screenshot}
                alt={`${entry.name} 스크린샷 ${index + 1}`}
              />
            ))}
          </div>
        )}
        {entry.highlights?.map((highlight, index) => (
          <HighlightBlock key={`${entry.id}-${index}`} highlight={highlight} />
        ))}
      </div>
    </article>
  )
}

export function ResumeReadableView() {
  return (
    <div className={styles.shell}>
      <article className={styles.document} data-resume-readable-document>
        <header className={styles.hero}>
          <div className={styles.profile}>
            <img
              src={resumeProfile.photo}
              alt={`${resumeProfile.name} 프로필 사진`}
            />
            <div>
              <p className={styles.role}>{resumeProfile.role}</p>
              <h1>{resumeProfile.name}</h1>
            </div>
          </div>
          <Link className={styles.pdfLink} href="/resume">
            PDF 보기
          </Link>
        </header>

        <dl className={styles.basicInfo}>
          {resumeProfile.basics.map((item) => (
            <div key={item.label}>
              <dt>{item.label}</dt>
              <dd>{getProfileBasicValue(item)}</dd>
            </div>
          ))}
        </dl>

        <section className={styles.topSection} aria-labelledby="resume-readable-skills">
          <h2 id="resume-readable-skills">기술 스택</h2>
          <ul className={styles.skillList}>
            {resumeTechnologies.map((technology) => (
              <li key={technology.label}>
                {technology.icon && (
                  <img src={technology.icon} alt="" aria-hidden="true" />
                )}
                {technology.label}
              </li>
            ))}
          </ul>
        </section>

        <section className={styles.topSection} aria-labelledby="resume-readable-links">
          <h2 id="resume-readable-links">링크</h2>
          <ul className={styles.linkList}>
            {resumeLinks.map((link) => (
              <li key={link.label}>
                <a href={link.href} target="_blank" rel="noreferrer">
                  <span>{link.label}</span>
                  <strong>{link.value}</strong>
                </a>
              </li>
            ))}
          </ul>
        </section>

        <div className={styles.sectionStack}>
          {resumeSections.map((section) => {
            const summary = getSectionSummary(section)

            return (
              <section key={section.id} className={styles.section}>
                <div className={styles.sectionHeader}>
                  <span aria-hidden="true" />
                  <div>
                    <h2>{section.title}</h2>
                    {summary && <p>{summary}</p>}
                  </div>
                </div>
                <div className={styles.entryList}>
                  {section.entries.map((entry) => (
                    <EntryBlock key={entry.id} entry={entry} />
                  ))}
                </div>
              </section>
            )
          })}
        </div>
      </article>
    </div>
  )
}
