import { BuilderSummary } from '@/app/(home)/pc-builder/[category]/[id]/_components'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

type BuilderSummaryContainerProps = {
  buildId: string
}

export const BuilderSummaryContainer = async ({
  buildId,
}: BuilderSummaryContainerProps) => {
  const session = await auth()
  const userId = session?.user.id

  const build = await prisma.build.findUnique({
    where: { id: buildId, AND: { userId } },
    select: {
      name: true,
      public: true,
    },
  })
  await new Promise((resolve) => setTimeout(resolve, 5000))
  return (
    <BuilderSummary
      buildName={build?.name ?? ''}
      isPublic={build?.public ?? false}
    />
  )
}
