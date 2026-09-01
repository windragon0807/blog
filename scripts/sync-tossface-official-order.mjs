import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OFFICIAL_PATH = path.join(ROOT, 'scripts', 'data', 'tossface-official-categories.json');
const METADATA_PATH = path.join(ROOT, 'scripts', 'data', 'tossface-metadata.json');
const CACHE_DIR = path.join('/tmp', 'tossface-sync');

const CLDR_URLS = {
  base: 'https://raw.githubusercontent.com/unicode-org/cldr-json/main/cldr-json/cldr-annotations-full/annotations/ko/annotations.json',
  derived:
    'https://raw.githubusercontent.com/unicode-org/cldr-json/main/cldr-json/cldr-annotations-derived-full/annotationsDerived/ko/annotations.json',
};

const CATEGORY_ORDER = [
  'smileys-people',
  'animals-nature',
  'food-drink',
  'activity',
  'travel-places',
  'objects',
  'symbols',
  'flags',
];

const SKIN_SUFFIXES = [
  '하얀 피부',
  '연한 갈색 피부',
  '갈색 피부',
  '진한 갈색 피부',
  '검은색 피부',
  '밝은 피부색',
  '어두운 피부색',
];

const TTS_ALIASES = new Map([
  ['키 캡: #', '키 캡 샵'],
  ['키 캡: *', '키 캡 별표'],
  ['일본어 "봉사료" 버튼', '일본어 봉사료 버튼'],
  ['일본어 "여기" 버튼', '일본어 여기 버튼'],
  ['녹음/녹화 버튼', '녹음 녹화 버튼'],
]);

function stripSkinSuffix(name) {
  for (const suffix of SKIN_SUFFIXES) {
    const token = ` ${suffix}`;
    if (name.endsWith(token)) {
      return name.slice(0, -token.length);
    }
  }
  return name;
}

function normalizeName(name) {
  return name
    .replaceAll('"', '')
    .replaceAll('/', ' ')
    .replaceAll(':', ' ')
    .replaceAll('-', ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function nameKeys(name) {
  const keys = new Set([name, normalizeName(name), name.replaceAll(' ', '')]);
  const normalized = normalizeName(name);
  keys.add(normalized.replaceAll(' ', ''));

  if (normalized.startsWith('깃발 ')) {
    keys.add(normalized.slice(3));
    keys.add(`깃발: ${normalized.slice(3)}`);
  }

  if (name.startsWith('깃발: ')) {
    keys.add(`깃발 ${name.slice(4)}`);
    keys.add(name.slice(4));
  }

  return keys;
}

async function readJsonCache(filename, url, picker) {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
  const cachePath = path.join(CACHE_DIR, filename);

  if (!fs.existsSync(cachePath)) {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to download ${url}: ${response.status}`);
    }
    fs.writeFileSync(cachePath, await response.text());
  }

  return picker(JSON.parse(fs.readFileSync(cachePath, 'utf8')));
}

function lookupTts(emoji, annotations) {
  const candidates = [emoji, emoji.replaceAll('\uFE0F', ''), `${emoji}\uFE0F`];

  for (const candidate of candidates) {
    const entry = annotations.get(candidate);
    if (entry?.tts?.[0]) {
      return entry.tts[0];
    }
  }

  return null;
}

function findMetadataItem(tts, byKey, used) {
  const names = [tts, TTS_ALIASES.get(tts)].filter(Boolean);

  for (const name of names) {
    for (const key of nameKeys(name)) {
      const item = byKey.get(key);
      if (item && !used.has(item.name)) {
        return item;
      }
    }
  }

  return null;
}

function compareSkinTone(left, right) {
  const leftIndex = SKIN_SUFFIXES.findIndex((suffix) => left.endsWith(suffix));
  const rightIndex = SKIN_SUFFIXES.findIndex((suffix) => right.endsWith(suffix));
  return (leftIndex === -1 ? 99 : leftIndex) - (rightIndex === -1 ? 99 : rightIndex);
}

async function main() {
  const official = JSON.parse(fs.readFileSync(OFFICIAL_PATH, 'utf8'));
  const metadata = JSON.parse(fs.readFileSync(METADATA_PATH, 'utf8'));

  const [baseAnnotations, derivedAnnotations] = await Promise.all([
    readJsonCache('cldr-ko-annotations.json', CLDR_URLS.base, (payload) => {
      return payload.annotations.annotations;
    }),
    readJsonCache('cldr-ko-annotations-derived.json', CLDR_URLS.derived, (payload) => {
      return payload.annotationsDerived.annotations;
    }),
  ]);

  const annotations = new Map([
    ...Object.entries(baseAnnotations),
    ...Object.entries(derivedAnnotations),
  ]);

  const byKey = new Map();
  const byName = new Map();
  for (const item of metadata) {
    byName.set(item.name, item);
    for (const key of nameKeys(item.name)) {
      if (!byKey.has(key)) {
        byKey.set(key, item);
      }
    }
  }

  const used = new Set();
  const officialByCategory = new Map(CATEGORY_ORDER.map((category) => [category, []]));
  const unmatched = [];
  const skippedDuplicates = [];

  for (const category of CATEGORY_ORDER) {
    const seenEmojis = new Set();

    for (const emoji of official[category]) {
      if (seenEmojis.has(emoji)) {
        skippedDuplicates.push({ category, emoji, reason: 'repeat-in-category' });
        continue;
      }
      seenEmojis.add(emoji);

      if (
        emoji === '\u200D\u{1F37C}' ||
        ([...emoji].length === 1 && /\p{Regional_Indicator}/u.test(emoji))
      ) {
        skippedDuplicates.push({ category, emoji, reason: 'broken-official-entry' });
        continue;
      }

      const tts = lookupTts(emoji, annotations);
      const item = tts ? findMetadataItem(tts, byKey, used) : null;

      if (!item) {
        const alreadyUsed = tts
          ? [...nameKeys(tts), ...nameKeys(TTS_ALIASES.get(tts) ?? '')]
              .map((key) => byKey.get(key))
              .find(Boolean)
          : null;

        if (alreadyUsed && used.has(alreadyUsed.name)) {
          skippedDuplicates.push({
            category,
            emoji,
            tts,
            name: alreadyUsed.name,
            reason: 'already-used',
          });
          continue;
        }

        unmatched.push({ category, emoji, tts });
        continue;
      }

      used.add(item.name);
      officialByCategory.get(category).push(item.name);
    }
  }

  const remaining = metadata.filter((item) => !used.has(item.name));
  const extrasByCategory = new Map(CATEGORY_ORDER.map((category) => [category, []]));
  const officialBaseIndex = new Map();

  for (const [category, names] of officialByCategory) {
    names.forEach((name, index) => {
      officialBaseIndex.set(name, { category, index });
    });
  }

  for (const item of remaining) {
    const baseName = stripSkinSuffix(item.name);
    const parent = officialBaseIndex.get(baseName);
    const category = parent?.category ?? item.category;
    extrasByCategory.get(category).push({
      name: item.name,
      parentIndex: parent?.index ?? Number.MAX_SAFE_INTEGER,
      isSkin: baseName !== item.name,
    });
  }

  for (const extras of extrasByCategory.values()) {
    extras.sort((left, right) => {
      if (left.parentIndex !== right.parentIndex) {
        return left.parentIndex - right.parentIndex;
      }
      if (left.isSkin !== right.isSkin) {
        return left.isSkin ? -1 : 1;
      }
      const skinDiff = compareSkinTone(left.name, right.name);
      if (skinDiff !== 0) {
        return skinDiff;
      }
      return left.name.localeCompare(right.name, 'ko');
    });
  }

  const nextMetadata = [];
  for (const category of CATEGORY_ORDER) {
    let order = 0;
    for (const name of officialByCategory.get(category)) {
      nextMetadata.push({ name, category, order });
      order += 1;
    }
    for (const extra of extrasByCategory.get(category)) {
      nextMetadata.push({ name: extra.name, category, order });
      order += 1;
    }
  }

  const svgTitles = new Set(
    fs
      .readdirSync(path.join(ROOT, 'public', 'emoticons', 'tossface'))
      .filter((filename) => filename.endsWith('.svg'))
      .map((filename) =>
        filename
          .replace(/\.svg$/i, '')
          .replace(/[-_]+/g, ' ')
          .replace(/\s+/g, ' ')
          .trim(),
      ),
  );

  for (const item of nextMetadata) {
    if (!svgTitles.has(item.name) && svgTitles.has(normalizeName(item.name))) {
      item.name = normalizeName(item.name);
    }
  }

  const names = nextMetadata.map((item) => item.name);
  if (new Set(names).size !== names.length) {
    throw new Error('Duplicate metadata names after sync');
  }
  if (nextMetadata.length !== metadata.length) {
    throw new Error(`Metadata count changed: ${metadata.length} -> ${nextMetadata.length}`);
  }

  fs.writeFileSync(METADATA_PATH, `${JSON.stringify(nextMetadata, null, 2)}\n`);

  const report = {
    officialCounts: Object.fromEntries(
      CATEGORY_ORDER.map((category) => [category, officialByCategory.get(category).length]),
    ),
    extraCounts: Object.fromEntries(
      CATEGORY_ORDER.map((category) => [category, extrasByCategory.get(category).length]),
    ),
    unmatched,
    skippedDuplicates: skippedDuplicates.filter((item) => item.reason === 'broken-official-entry'),
    firstItems: Object.fromEntries(
      CATEGORY_ORDER.map((category) => [category, officialByCategory.get(category).slice(0, 8)]),
    ),
  };

  console.log(JSON.stringify(report, null, 2));
}

await main();
