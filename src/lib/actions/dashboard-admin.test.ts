import { auth } from '@/auth'
import { UpdateProduct } from '@/lib/actions/dashboard-admin'
import { prisma } from '@/lib/prisma'
import { Session } from 'next-auth'

vi.mock('@/auth', () => ({
  auth: vi.fn(),
}))

vi.mock('@/lib/prisma', () => ({
  prisma: {
    product: {
      update: vi.fn(),
    },
  },
}))

describe('Admin dashboard backend', () => {
  it('Should return unauthorized when user is not admin', async () => {
    const mockUserSession: Session = {
      user: {
        id: '2',
        name: 'John',
        email: 'John@test.pl',
        role: 'user',
      },
      expires: '9999',
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.mocked(auth).mockResolvedValue(mockUserSession as any)

    const mockProductData = {
      name: 'be quiet! Dark Power 13 1000W',
      slug: 'be-quiet-dark-power-13',
      price: 289,
      quantity: 50,
      badge: null,
      technical: {
        atx3_0: true,
        length: '175',
        wattage: '1000',
        efficiency: '80 plus titanium',
        formFactor: 'atx',
        modularity: 'full',
      },
      performance: null,
      specification: [
        {
          label: 'performance',
          attributes: [
            { key: 'total power', value: '1000 W' },
            { key: 'efficiency', value: '80 Plus Titanium' },
          ],
        },
        {
          label: 'acoustics',
          attributes: [
            { key: 'fan', value: 'Silent Wings 135mm' },
            { key: 'noise level', value: 'extremely silent' },
          ],
        },
        {
          label: 'features',
          attributes: [
            { key: 'topology', value: 'Full Bridge + LLC' },
            { key: 'atx version', value: '3.0' },
          ],
        },
      ],
    }

    const result = await UpdateProduct('1', mockProductData)

    expect(result).toEqual({
      success: false,
      error: 'Unauthorized',
    })

    expect(prisma.product.update).not.toHaveBeenCalled()
  })
  it('Should return zod validation errors', async () => {
    const mockUserSession: Session = {
      user: {
        id: '2',
        name: 'John',
        email: 'John@test.pl',
        role: 'admin',
      },
      expires: '9999',
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.mocked(auth).mockResolvedValue(mockUserSession as any)

    const mockProductData = {
      name: 'bq',
      slug: 'be-quiet-dark-power-13',
      price: -5,
      quantity: 50,
      badge: null,
      technical: {
        atx3_0: true,
        length: '175',
        wattage: '1000',
        efficiency: '80 plus titanium',
        formFactor: 'atx',
        modularity: 'full',
      },
      performance: null,
      specification: [
        {
          label: 'performance',
          attributes: [
            { key: 'total power', value: '' },
            { key: 'efficiency', value: '80 Plus Titanium' },
          ],
        },
        {
          label: 'acoustics',
          attributes: [
            { key: 'fan', value: 'Silent Wings 135mm' },
            { key: 'noise level', value: 'extremely silent' },
          ],
        },
        {
          label: 'features',
          attributes: [
            { key: 'topology', value: 'Full Bridge + LLC' },
            { key: 'atx version', value: '3.0' },
          ],
        },
      ],
    }

    const result = await UpdateProduct('1', mockProductData)

    expect(result).toEqual({
      success: false,
      error: [
        'Name must be at least 3 characters long',
        'Price must be greater than 0',
        'Value is required',
      ],
    })

    expect(prisma.product.update).not.toHaveBeenCalled()
  })

  it('Should update product and return success', async () => {
    const mockUserSession: Session = {
      user: {
        id: '2',
        name: 'John',
        email: 'John@test.pl',
        role: 'admin',
      },
      expires: '9999',
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.mocked(auth).mockResolvedValue(mockUserSession as any)

    const mockProductData = {
      name: 'be quiet! Dark Power 13 1000W',
      slug: 'be-quiet-dark-power-13',
      price: 289,
      quantity: 50,
      badge: null,
      technical: {
        atx3_0: true,
        length: '175',
        wattage: '1000',
        efficiency: '80 plus titanium',
        formFactor: 'atx',
        modularity: 'full',
      },
      performance: null,
      specification: [
        {
          label: 'performance',
          attributes: [
            { key: 'total power', value: '1000 W' },
            { key: 'efficiency', value: '80 Plus Titanium' },
          ],
        },
        {
          label: 'acoustics',
          attributes: [
            { key: 'fan', value: 'Silent Wings 135mm' },
            { key: 'noise level', value: 'extremely silent' },
          ],
        },
        {
          label: 'features',
          attributes: [
            { key: 'topology', value: 'Full Bridge + LLC' },
            { key: 'atx version', value: '3.0' },
          ],
        },
      ],
    }

    const result = await UpdateProduct('1', mockProductData)

    expect(result).toEqual({
      success: true,
    })

    expect(prisma.product.update).toHaveBeenCalledOnce()
  })
})
