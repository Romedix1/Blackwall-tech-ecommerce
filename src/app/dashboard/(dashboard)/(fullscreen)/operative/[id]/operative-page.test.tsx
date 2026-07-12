import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { Session } from 'next-auth'
import { redirect } from 'next/navigation'
import { screen } from '@testing-library/dom'
import { render } from '@testing-library/react'
import { adminSession, userSession } from '@tests/mocks'
import OperativeDetailsPage from '@/app/dashboard/(dashboard)/(fullscreen)/operative/[id]/page'

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}))

vi.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findFirst: vi.fn(),
    },
  },
}))

type MockFetchedUserType = {
  id: string
  username: string
  email: string
  role: string
  city: string | null
  shippingAddress: string | null
  zipCode: string | null
  createdAt: Date
  lastActiveAt: Date
  orders: Array<{
    id: string
    orderToken: string
    fullName: string
    totalAmount: number
    status: string
  }>
}

const mockedAuth = vi.mocked(auth as unknown as () => Promise<Session | null>)

const MockFetchedUser: MockFetchedUserType = {
  id: '123',
  username: 'test_user',
  email: 'user@blackwall.tech',
  role: 'user',
  city: 'New York',
  shippingAddress: '123 Tech Boulevard, Apt 404',
  zipCode: '10001',
  createdAt: new Date('2026-01-15T08:30:00.000Z'),
  lastActiveAt: new Date('2026-07-12T19:45:00.000Z'),
  orders: [
    {
      id: 'ord_998877',
      orderToken: 'tok_abc123xyz890',
      fullName: 'John Doe',
      totalAmount: 1450.5,
      status: 'complete',
    },
    {
      id: 'ord_665544',
      orderToken: 'tok_def456uvw123',
      fullName: 'John Doe',
      totalAmount: 299.99,
      status: 'paid',
    },
  ],
}

describe('Operative page', () => {
  it('Should redirect when user is not logged', async () => {
    mockedAuth.mockResolvedValue(null)

    await OperativeDetailsPage({
      params: Promise.resolve({ id: '1' }),
    })

    expect(redirect).toHaveBeenCalled()
    expect(prisma.user.findFirst).not.toHaveBeenCalled()
  })

  it('Should redirect when user is not admin', async () => {
    mockedAuth.mockResolvedValue(userSession)

    await OperativeDetailsPage({
      params: Promise.resolve({ id: '1' }),
    })

    expect(redirect).toHaveBeenCalled()
    expect(prisma.user.findFirst).not.toHaveBeenCalled()
  })

  it('Should return user not found page', async () => {
    mockedAuth.mockResolvedValue(adminSession)
    vi.mocked(prisma.user.findFirst).mockResolvedValue(null)

    const pageElement = await OperativeDetailsPage({
      params: Promise.resolve({ id: '1' }),
    })

    render(pageElement)

    expect(screen.getByText(/Operative Not Found/i)).toBeInTheDocument()
  })

  it('Should correctly display user without orders', async () => {
    mockedAuth.mockResolvedValue(adminSession)

    vi.mocked(prisma.user.findFirst).mockResolvedValue({
      ...MockFetchedUser,
      orders: [],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any)

    const pageElement = await OperativeDetailsPage({
      params: Promise.resolve({ id: '1' }),
    })

    render(pageElement)

    expect(screen.getByText(/test_user/i)).toBeInTheDocument()
    expect(screen.getByText(/10001/i)).toBeInTheDocument()
    expect(
      screen.getByText(/No directives found for this operative/i),
    ).toBeInTheDocument()
  })

  it('Should correctly display user with orders', async () => {
    mockedAuth.mockResolvedValue(adminSession)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.mocked(prisma.user.findFirst).mockResolvedValue(MockFetchedUser as any)

    const pageElement = await OperativeDetailsPage({
      params: Promise.resolve({ id: '1' }),
    })

    render(pageElement)

    expect(screen.getByText(/test_user/i)).toBeInTheDocument()
    expect(screen.getByText(/10001/i)).toBeInTheDocument()
    expect(screen.getByText(/tok_def456uvw123/i)).toBeInTheDocument()
    expect(screen.getByText(/complete/i)).toBeInTheDocument()
  })
})
