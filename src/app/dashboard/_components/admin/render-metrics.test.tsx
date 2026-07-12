import { RenderMetrics } from '@/app/dashboard/_components/admin/render-metrics'
import { prisma } from '@/lib/prisma'
import { render, screen } from '@testing-library/react'

vi.mock('@/lib/prisma', () => ({
  prisma: {
    order: { aggregate: vi.fn() },
    build: { count: vi.fn() },
    product: { count: vi.fn() },
    user: { count: vi.fn() },
  },
}))

describe('Render metrics', () => {
  it('Should corretly render all metrics', async () => {
    vi.mocked(prisma.order.aggregate).mockResolvedValue({
      _sum: { totalAmount: 1500 },
      _count: {},
      _avg: {},
      _min: {},
      _max: {},
    })
    vi.mocked(prisma.build.count)
      .mockResolvedValueOnce(2) // public builds
      .mockResolvedValueOnce(5) // total builds
    vi.mocked(prisma.product.count).mockResolvedValue(7)
    vi.mocked(prisma.user.count).mockResolvedValue(25)

    const jsx = await RenderMetrics()
    render(jsx)

    expect(screen.getByText(/\$1500/i)).toBeInTheDocument()

    expect(screen.getByText(/40\.0%/i)).toBeInTheDocument()

    expect(screen.getByText(/25/i)).toBeInTheDocument()
  })
})
