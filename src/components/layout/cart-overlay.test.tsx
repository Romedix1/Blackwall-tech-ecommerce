import { CartOverlay } from '@/components/layout/cart-overlay'
import { useCart } from '@/hooks/use-cart'
import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import type { Mock } from 'vitest'

vi.mock('@/hooks/use-cart', () => ({
  useCart: vi.fn(),
}))

describe('Cart overlay component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render empty state where there are o items', () => {
    ;(useCart as unknown as Mock).mockReturnValue({
      isOpen: true,
      items: [],
    })

    expect('Cart is empty').toBeInTheDocument()
  })

  it('should render items and calculate subtotal correctly', () => {
    ;(useCart as unknown as Mock).mockReturnValue({
      isOpen: true,
      items: [
        {
          slug: 'rtx-5090-ti',
          name: 'RTX 5090 TI',
          price: 1999.0,
          quantity: 2,
          imgSrc: '/test.png',
        },
      ],
    })

    render(<CartOverlay />)

    expect(screen.getByText('RTX 5090 TI')).toBeInTheDocument()
    expect(screen.getByText('Subtotal: $ 3998.00')).toBeInTheDocument()
  })
})
