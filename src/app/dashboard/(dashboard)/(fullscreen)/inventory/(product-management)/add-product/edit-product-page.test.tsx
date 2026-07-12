import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { Session } from 'next-auth'
import AddProductPage from '@/app/dashboard/(dashboard)/(fullscreen)/inventory/(product-management)/add-product/page'
import { prisma } from '@/lib/prisma'
import { userSession } from '@tests/mocks'

vi.mock('@/auth', () => ({
  auth: vi.fn(),
}))

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}))

vi.mock('@/lib/prisma', () => ({
  prisma: {
    product: {
      findFirst: vi.fn(),
      findMany: vi.fn(),
      update: vi.fn(),
      create: vi.fn(),
      delete: vi.fn(),
    },
    category: {
      findMany: vi.fn(),
    },
  },
}))

const mockedAuth = vi.mocked(auth as unknown as () => Promise<Session | null>)

describe('Add product page', () => {
  vi.mocked(prisma.category.findMany).mockResolvedValue([
    { name: 'Graphic cards', id: '1', slug: 'gpu' },
    { name: 'Processors', id: '2', slug: 'cpu' },
  ])

  it('Should redirect when user is not logged', async () => {
    vi.mocked(mockedAuth).mockResolvedValue(null)

    await AddProductPage()

    expect(redirect).toHaveBeenCalledWith('/')
  })

  it('Should redirect when user is not admin', async () => {
    mockedAuth.mockResolvedValue(userSession)

    await AddProductPage()

    expect(redirect).toHaveBeenCalledWith('/')
  })
})
