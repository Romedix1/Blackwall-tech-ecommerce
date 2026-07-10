import OrderDetailsPage from '@/app/dashboard/(dashboard)/(fullscreen)/directive/[id]/page'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { Session } from 'next-auth'
import { redirect } from 'next/navigation'
import { Order } from '../../../../../../../generated/prisma'
import { screen } from '@testing-library/dom'
import { render } from '@testing-library/react'

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}))

vi.mock('@/lib/prisma', () => ({
  prisma: {
    order: {
      findFirst: vi.fn(),
    },
  },
}))

const mockedAuth = vi.mocked(auth as unknown as () => Promise<Session | null>)

const adminSession: Session = {
  user: { id: '2', name: 'John', email: 'John@test.pl', role: 'admin' },
  expires: '9999',
}

const userSession: Session = {
  ...adminSession,
  user: { ...adminSession.user, role: 'user' },
}

type OrderWithItems = Order & {
  items: {
    id: string
    name: string
    quantity: number
    price: number
  }[]
}

const mockedOrder: OrderWithItems = {
  id: '1',
  userId: 'usr_8f7d9a',
  orderToken: 'tok_1N3k8a',
  email: 'john.doe@example.com',
  fullName: 'John Doe',
  phoneNumber: '+1-555-0198',
  totalAmount: 1450.0,
  address: '123 Blackwall Blvd',
  city: 'New York',
  zipCode: '10001',
  stripeSessionId: 'cs_test_a1b2c3',
  status: 'paid',
  createdAt: new Date('2026-07-10T08:00:00Z'),
  items: [
    {
      id: 'prod_991',
      name: 'Blackwall Tech Neural Processor v2',
      quantity: 1,
      price: 1200.0,
    },
    {
      id: 'prod_992',
      name: 'High-Speed Quantum RAM 64GB',
      quantity: 2,
      price: 125.0,
    },
  ],
}

describe('Directives page', () => {
  it('Should redirect when user is not logged', async () => {
    mockedAuth.mockResolvedValue(null)

    await OrderDetailsPage({
      params: Promise.resolve({ id: '1' }),
    })

    expect(redirect).toHaveBeenCalled()
    expect(prisma.order.findFirst).not.toHaveBeenCalled()
  })

  it('Should redirect when user is not admin', async () => {
    mockedAuth.mockResolvedValue(userSession)

    await OrderDetailsPage({
      params: Promise.resolve({ id: '1' }),
    })

    expect(redirect).toHaveBeenCalled()
    expect(prisma.order.findFirst).not.toHaveBeenCalled()
  })

  it('Should return order not found page', async () => {
    mockedAuth.mockResolvedValue(adminSession)
    vi.mocked(prisma.order.findFirst).mockResolvedValue(null)

    const pageElement = await OrderDetailsPage({
      params: Promise.resolve({ id: '1' }),
    })

    render(pageElement)

    expect(screen.getByText(/Directive Not Found/i)).toBeInTheDocument()
  })

  it('Should correctly display orders', async () => {
    mockedAuth.mockResolvedValue(adminSession)

    vi.mocked(prisma.order.findFirst).mockResolvedValue(mockedOrder)

    const pageElement = await OrderDetailsPage({
      params: Promise.resolve({ id: '1' }),
    })

    render(pageElement)

    expect(screen.getByText(/John Doe/i)).toBeInTheDocument()
    expect(screen.getByText(/New York/i)).toBeInTheDocument()
    expect(screen.getByText(/paid/i)).toBeInTheDocument()
    expect(
      screen.getByText(/Blackwall Tech Neural Processor v2/i),
    ).toBeInTheDocument()
  })
})
