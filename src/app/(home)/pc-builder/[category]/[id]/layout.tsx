import {
  BuilderNav,
  BuilderSummaryContainer,
  BuilderSummarySkeleton,
  BuildInitializer,
} from '@/app/(home)/pc-builder/[category]/[id]/_components'
import { fetchBuildFromDb } from '@/lib/actions'
import { Suspense } from 'react'

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ id: string }>
}) {
  const { id: buildId } = await params

  const initialItems = await fetchBuildFromDb(buildId)

  return (
    <div className="container mx-auto mt-16 lg:flex lg:items-start lg:gap-8 lg:border lg:p-10 xl:max-w-450">
      <BuildInitializer buildId={buildId} items={initialItems} />
      <aside className="hidden min-w-0 lg:block lg:flex-2">
        <BuilderNav />
      </aside>

      <main className="min-w-0 flex-1 lg:flex-6">{children}</main>

      <aside className="mt-6 flex min-w-0 flex-col gap-6 uppercase lg:flex-3">
        <Suspense fallback={<BuilderSummarySkeleton />}>
          <BuilderSummaryContainer buildId={buildId} />
        </Suspense>
      </aside>
    </div>
  )
}
