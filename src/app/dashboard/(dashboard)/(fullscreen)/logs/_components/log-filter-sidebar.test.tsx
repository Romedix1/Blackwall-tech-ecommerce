import { LogFilterSidebar } from '@/app/dashboard/(dashboard)/(fullscreen)/logs/_components/log-filter-sidebar'
import { render, screen } from '@testing-library/react'

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
  })),
  usePathname: vi.fn(() => '/dashboard/logs'),
  useSearchParams: vi.fn(() => ({
    getAll: vi.fn(() => []),
    toString: vi.fn(() => ''),
  })),
}))

describe('Log filters', () => {
  it('Should display all available filters', () => {
    const actions = ['User logged in', 'Build deleted', 'Product updated']

    render(<LogFilterSidebar actions={actions} />)

    expect(screen.getByText('User logged in')).toBeInTheDocument()
    expect(screen.getByText('Build deleted')).toBeInTheDocument()
    expect(screen.getByText('Product updated')).toBeInTheDocument()
  })
})
