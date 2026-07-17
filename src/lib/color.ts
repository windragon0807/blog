export type HsvColor = {
  h: number
  s: number
  v: number
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function normalizeHue(value: number) {
  if (!Number.isFinite(value)) return 0
  return ((value % 360) + 360) % 360
}

export function hexToHsv(hex: string): HsvColor {
  const normalized = hex.trim().replace(/^#/, '')
  if (!/^[0-9A-Fa-f]{6}$/.test(normalized)) {
    return { h: 0, s: 0, v: 0 }
  }

  const red = Number.parseInt(normalized.slice(0, 2), 16) / 255
  const green = Number.parseInt(normalized.slice(2, 4), 16) / 255
  const blue = Number.parseInt(normalized.slice(4, 6), 16) / 255
  const max = Math.max(red, green, blue)
  const min = Math.min(red, green, blue)
  const delta = max - min

  let hue = 0
  if (delta > 0) {
    if (max === red) hue = 60 * (((green - blue) / delta) % 6)
    if (max === green) hue = 60 * ((blue - red) / delta + 2)
    if (max === blue) hue = 60 * ((red - green) / delta + 4)
  }

  return {
    h: normalizeHue(hue),
    s: max === 0 ? 0 : delta / max,
    v: max,
  }
}

export function hsvToHex({ h, s, v }: HsvColor): string {
  const hue = normalizeHue(h)
  const saturation = clamp(Number.isFinite(s) ? s : 0, 0, 1)
  const value = clamp(Number.isFinite(v) ? v : 0, 0, 1)
  const chroma = value * saturation
  const segment = hue / 60
  const secondary = chroma * (1 - Math.abs((segment % 2) - 1))
  const match = value - chroma

  let rgb: [number, number, number]
  if (segment < 1) rgb = [chroma, secondary, 0]
  else if (segment < 2) rgb = [secondary, chroma, 0]
  else if (segment < 3) rgb = [0, chroma, secondary]
  else if (segment < 4) rgb = [0, secondary, chroma]
  else if (segment < 5) rgb = [secondary, 0, chroma]
  else rgb = [chroma, 0, secondary]

  return `#${rgb
    .map((channel) =>
      Math.round((channel + match) * 255)
        .toString(16)
        .padStart(2, '0')
    )
    .join('')}`.toUpperCase()
}
