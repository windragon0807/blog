import { NextResponse } from 'next/server'
import { getPosts } from '@/lib/notion'

export const revalidate = 3600

export async function GET() {
  try {
    const posts = await getPosts()

    return NextResponse.json(
      { posts },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        },
      }
    )
  } catch (error) {
    console.error('[api/posts] failed to load posts', error)

    return NextResponse.json(
      { error: 'Failed to load posts' },
      { status: 500 }
    )
  }
}
