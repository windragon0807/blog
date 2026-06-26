import { readFile } from 'node:fs/promises'
import path from 'node:path'

export const runtime = 'nodejs'

const fontPath = path.join(
  process.cwd(),
  'node_modules/pretendard/dist/public/static/alternative/Pretendard-Regular.ttf'
)

export async function GET() {
  const fontBytes = await readFile(fontPath)

  return new Response(new Uint8Array(fontBytes), {
    headers: {
      'Cache-Control': 'public, max-age=31536000, immutable',
      'Content-Type': 'font/ttf',
    },
  })
}
