import { DashboardHeader } from '@/app/dashboard/_components'
import { RenderRecords } from '@/app/dashboard/_components/user/render-records'
import { RenderRecordsSkeleton } from '@/app/dashboard/_components/user/render-records-skeleton'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'

export default async function DashboardHistoryPage() {
  const user = await auth()

  if (!user) {
    redirect('/')
  }

  const userBuilds = await prisma.build.findMany({
    where: { userId: user.user.id },
    select: {
      id: true,
      status: true,
      public: true,
      name: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <>
      <DashboardHeader>
        <span aria-hidden="true">
          {'//'} Saved_builds
          <span className="text-accent"> [{userBuilds.length}]</span>
        </span>
        <span className="sr-only">
          Saved builds, {userBuilds.length} items found
        </span>
      </DashboardHeader>

      <Suspense fallback={<RenderRecordsSkeleton type="build" />}>
        <RenderRecords type="build" records={userBuilds} />
      </Suspense>
    </>
  )
}
