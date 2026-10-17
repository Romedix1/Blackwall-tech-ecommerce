import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Redis } from '@upstash/redis'

export async function GET(request: Request) {
  if (
    request.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const results: Record<string, string> = {}

  try {
    await prisma.$queryRaw`SELECT 1`
    results.database = 'active'
  } catch (error) {
    results.database = `error: ${(error as Error).message}`
  }

  try {
    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    })
    await redis.set('keep-alive-ping', Date.now(), { ex: 60 * 60 * 24 * 7 })
    results.redis = 'active'
  } catch (error) {
    results.redis = `error: ${(error as Error).message}`
  }

  try {
    const ref = process.env.SUPABASE_PROJECT_REF
    if (ref) {
      const res = await fetch(`https://${ref}.supabase.co/storage/v1/version`, {
        cache: 'no-store',
      })
      results.supabase = res.ok ? 'active' : `status ${res.status}`
    } else {
      results.supabase = 'skipped: no SUPABASE_PROJECT_REF'
    }
  } catch (error) {
    results.supabase = `error: ${(error as Error).message}`
  }

  return NextResponse.json({
    ok: true,
    timestamp: new Date().toISOString(),
    results,
  })
}
