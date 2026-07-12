import { auth } from '@/auth'
import EditProductPage from '@/app/dashboard/(dashboard)/(fullscreen)/inventory/(product-management)/edit/[id]/page'
import { redirect } from 'next/navigation'
import { Session } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { screen } from '@testing-library/dom'
import { render } from '@testing-library/react'
import { adminSession, userSession } from '@tests/mocks'

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
    },
  },
}))

const mockedAuth = vi.mocked(auth as unknown as () => Promise<Session | null>)

describe('Edit product page', () => {
  it('Should redirect when user is not logged', async () => {
    vi.mocked(mockedAuth).mockResolvedValue(null)

    await EditProductPage({ params: Promise.resolve({ id: 'test-id' }) })

    expect(redirect).toHaveBeenCalledWith('/')
  })

  it('Should redirect when user is not admin', async () => {
    mockedAuth.mockResolvedValue(userSession)

    await EditProductPage({ params: Promise.resolve({ id: 'test-id' }) })

    expect(redirect).toHaveBeenCalledWith('/')
  })

  it("Should render ProductNotFound if product doesn't exists", async () => {
    mockedAuth.mockResolvedValue(adminSession)

    vi.mocked(prisma.product.findFirst).mockResolvedValue(null)

    const jsx = await EditProductPage({
      params: Promise.resolve({ id: 'test-id' }),
    })

    render(jsx)

    expect(screen.getByText(/Return_to_list/i)).toBeInTheDocument()
  })
})
