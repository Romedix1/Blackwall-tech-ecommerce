import { ViewLogs } from '@/app/dashboard/(dashboard)/(fullscreen)/logs/_components/view-logs'
import { fireEvent, render, screen } from '@testing-library/react'

describe('View logs', () => {
  const mockLog = {
    action: 'Product updated',
    createdAt: new Date('2026-07-17T12:00:00Z'),
    details: 'Updated price and description for item #12345.',
    user: {
      username: 'romedix',
    },
  }

  it('Should display log correctly', () => {
    render(<ViewLogs log={mockLog} />)

    expect(screen.getByText('Product updated')).toBeInTheDocument()
    expect(screen.getByText('romedix')).toBeInTheDocument()
  })

  it('Should expand log information on user click', () => {
    render(<ViewLogs log={mockLog} />)

    expect(
      screen.queryByText('Updated price and description for item #12345.'),
    ).not.toBeInTheDocument()

    const button = screen.getByRole('button')

    fireEvent.click(button)

    expect(
      screen.getByText('Updated price and description for item #12345.'),
    ).toBeInTheDocument()
  })
})
