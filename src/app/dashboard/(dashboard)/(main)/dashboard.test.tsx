import UserDashboardPage from '@/app/dashboard/(dashboard)/(main)/page'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { screen } from '@testing-library/dom'
import { render } from '@testing-library/react'
import { userSession } from '@tests/mocks'
import { Session } from 'next-auth'
import { redirect } from 'next/navigation'

vi.mock('@/auth', () => ({
  auth: vi.fn(),
}))

vi.mock('@/lib/prisma', () => ({
  prisma: { order: { findMany: vi.fn() } },
}))

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}))

vi.mock('@/app/dashboard/_components', () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  DashboardHeader: ({ children }: any) => (
    <div data-testid="dashboard-header">{children}</div>
  ),
  UserActivity: () => <div>User Activity</div>,
  RecordBlock: () => <div>Record</div>,
  RenderMetrics: () => <div>Metrics</div>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  RenderRecords: (props: any) => (
    <div data-testid="render-records">
      {props.records && props.records.length === 0
        ? 'No_orders_found_in_history'
        : 'Orders_List'}
    </div>
  ),
}))

const mockedAuth = vi.mocked(auth as unknown as () => Promise<Session | null>)

describe('Main dashboard view', () => {
  it('Should redirect if session is null', async () => {
    mockedAuth.mockResolvedValue(null)

    await UserDashboardPage()

    expect(redirect).toHaveBeenCalledWith('/')
    expect(prisma.order.findMany).not.toBeCalled()
  })

  it('Should render dashboard and fetch orders if session is valid', async () => {
    mockedAuth.mockResolvedValue(userSession)

    const mockOrders = [
      { id: 'ord_1', status: 'delivered', createdAt: new Date() },
    ]

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.mocked(prisma.order.findMany).mockResolvedValue(mockOrders as any)

    const jsx = await UserDashboardPage()
    render(jsx)

    expect(prisma.order.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { userId: userSession?.user?.id },
        take: 3,
      }),
    )
    expect(screen.getByText(/John/i)).toBeInTheDocument()
  })

  it('Should display no orders text if there are zero orders in database', async () => {
    mockedAuth.mockResolvedValue(userSession)

    vi.mocked(prisma.order.findMany).mockResolvedValue([])

    const jsx = await UserDashboardPage()
    render(jsx)

    expect(screen.getByText(/No_orders_found_in_history/i)).toBeInTheDocument()
  })
})
