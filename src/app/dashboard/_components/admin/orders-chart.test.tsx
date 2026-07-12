import { render, screen } from '@testing-library/react'
import { OrdersChart } from './orders-chart'
import { vi, describe, it, expect } from 'vitest'
import React from 'react'

vi.mock('recharts', async () => {
  const original = await vi.importActual('recharts')
  return {
    ...original,
    ResponsiveContainer: ({ children }: { children?: React.ReactNode }) => (
      <div style={{ width: 800, height: 400 }}>
        {React.isValidElement(children)
          ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
            React.cloneElement(children as React.ReactElement<any>, {
              width: 800,
              height: 400,
            })
          : children}
      </div>
    ),
  }
})

describe('Orders chart', () => {
  const mockData = [
    { label: 'May 01', amount: 10 },
    { label: 'May 02', amount: 25 },
    { label: 'May 03', amount: 15 },
  ]

  it('Should render chart header', () => {
    render(<OrdersChart data={mockData} />)

    expect(
      screen.getByText(/Orders chart for past 30 days/i),
    ).toBeInTheDocument()
  })

  it('Should display correct data for X Axis', () => {
    render(<OrdersChart data={mockData} />)

    expect(screen.getByText('May 01')).toBeInTheDocument()
    expect(screen.getByText('May 03')).toBeInTheDocument()
  })

  it('Should render chart line', () => {
    const { container } = render(<OrdersChart data={mockData} />)

    const tooltipWrapper = container.querySelector('.recharts-tooltip-wrapper')

    expect(tooltipWrapper).toBeInTheDocument()
  })

  it('Should render tooltip wrapper in the DOM', () => {
    const mockData = [{ label: 'May 01', amount: 10 }]

    const { container } = render(<OrdersChart data={mockData} />)

    const tooltipWrapper = container.querySelector('.recharts-tooltip-wrapper')

    expect(tooltipWrapper).toBeInTheDocument()
  })
})
