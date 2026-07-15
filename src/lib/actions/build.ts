'use server'

import { auth } from '@/auth'
import { generateBuildName } from '@/lib/builder'
import { createLog } from '@/lib/logger'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { isRedirectError } from 'next/dist/client/components/redirect-error'
import { redirect } from 'next/navigation'

type SaveBuildInput = {
  items: { slug: string; quantity: number }[]
  status: string
}

export async function saveBuildToDb(data: SaveBuildInput, buildId: string) {
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/login')
  }

  const userId = session.user.id

  try {
    const existingBuild = await prisma.build.findUnique({
      where: { id: buildId },
      select: { userId: true },
    })

    if (existingBuild && existingBuild.userId !== userId) {
      return { error: 'Unauthorized' }
    }

    await prisma.build.upsert({
      where: { id: buildId },
      update: {
        status: data.status,
        items: {
          deleteMany: {},
          create: data.items.map((item) => ({
            productSlug: item.slug,
            quantity: item.quantity,
          })),
        },
      },
      create: {
        userId: userId,
        status: data.status,
        name: 'tempname',
        items: {
          create: data.items.map((item) => ({
            productSlug: item.slug,
            quantity: item.quantity,
          })),
        },
      },
    })

    return { success: true }
  } catch (error) {
    if (isRedirectError(error)) {
      throw error
    }

    if (process.env.NODE_ENV === 'development') {
      console.error('[ BUILD_SAVING_ERROR ]:', error)
    }

    return { error: 'INTERNAL_SERVER_ERROR' }
  }
}

export async function fetchBuildFromDb(buildId: string) {
  try {
    const session = await auth()

    if (!session) {
      return []
    }

    const userId = session.user.id

    const build = await prisma.build.findFirst({
      where: { id: buildId, userId: userId },
      include: {
        items: {
          include: {
            product: {
              include: {
                category: true,
              },
            },
          },
        },
      },
    })

    if (!build || !build.items.length) {
      return []
    }

    return build.items.map((item) => ({
      slug: item.productSlug,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
      imgSrc: null,
      category: item.product.category.slug,
      technical: item.product.technical as Record<string, string>,
      stock: item.product.quantity,
    }))
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[ FETCH_BUILD_ERROR ]:', error)
    }
    return []
  }
}

export async function initiateBuildConfig() {
  const session = await auth()

  if (!session) {
    const guestId = crypto.randomUUID()
    redirect(`/pc-builder/cpu/${guestId}`)
  }

  const newBuild = await prisma.build.create({
    data: {
      name: generateBuildName(),
      userId: session.user.id,
      status: 'idle',
    },
    select: { id: true },
  })

  await createLog(
    'Created build',
    `Successfully created build by user: ${session.user.username}`,
    session.user.id,
  )

  redirect(`/pc-builder/cpu/${newBuild.id}`)
}

export async function toggleBuildVisibility(buildId: string) {
  const COOLDOWN_MS = 5000

  const build = await prisma.build.findUnique({
    where: { id: buildId },
    select: {
      updatedAt: true,
      name: true,
      public: true,
      userId: true,
      createdBy: {
        select: {
          username: true,
        },
      },
    },
  })

  if (!build) throw new Error('Build not found')

  const now = new Date().getTime()
  const lastUpdate = new Date(build.updatedAt).getTime()

  if (now - lastUpdate < COOLDOWN_MS) {
    throw new Error(
      'RECALIBRATING_SYSTEM: Please wait before next broadcast change',
    )
  }

  const updatedBuild = await prisma.build.update({
    where: { id: buildId },
    data: { public: !build.public },
  })

  await createLog(
    'Switched build visibility',
    `Successfully switched build ${build.name} visibility to ${!build.public ? 'public' : 'private'} by user: ${build.createdBy.username}`,
    build.userId,
  )

  return updatedBuild
}

export async function deleteBuild(buildId: string) {
  const session = await auth()

  if (!session) {
    return []
  }

  const userId = session.user.id

  try {
    const build = await prisma.build.findUnique({
      where: { id: buildId },
      select: { name: true },
    })

    await prisma.build.delete({
      where: { id: buildId, AND: { userId } },
    })

    await createLog(
      'Build deleted',
      `Build ${build?.name} was deleted by user ${session.user.username}`,
      userId,
    )

    revalidatePath('/dashboard/builds')
    return { success: true }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[ DELETE_BUILD_ERROR ]:', error)
    }

    return { success: false }
  }
}

export async function updateBuildName(
  buildId: string,
  userId: string,
  name: string,
) {
  const session = await auth()

  if (!session?.user?.id) {
    return { error: 'Unauthorized' }
  }

  const updatedBuild = await prisma.build.update({
    where: { id: buildId, userId: userId },
    data: { name },
  })

  await createLog(
    'Build name updated',
    `Build name was updated to ${name} by user ${session.user.username}`,
    userId,
  )

  return updatedBuild
}
