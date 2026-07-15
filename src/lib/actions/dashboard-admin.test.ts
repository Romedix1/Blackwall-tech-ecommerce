import { auth } from '@/auth'
import { AddProduct, UpdateProduct } from '@/lib/actions/dashboard-admin'
import { prisma } from '@/lib/prisma'
import { adminSession, userSession } from '@tests/mocks'
import { Session } from 'next-auth'
import { vi, describe, it, expect } from 'vitest'
import { createLog } from '@/lib/logger'

vi.mock('@/lib/logger', () => ({
  createLog: vi.fn(),
}))

vi.mock('@/auth', () => ({
  auth: vi.fn(),
}))

vi.mock('@/lib/prisma', () => ({
  prisma: {
    product: {
      update: vi.fn(),
      create: vi.fn(),
      findFirst: vi.fn(),
    },
    category: {
      findFirst: vi.fn(),
    },
  },
}))

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))

const mockedAuth = vi.mocked(auth as unknown as () => Promise<Session | null>)

const validProductData = {
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
      id: '01',
      label: 'performance',
      attributes: [
        { key: 'total power', value: '1000 W' },
        { key: 'efficiency', value: '80 Plus Titanium' },
      ],
    },
  ],
  category: 'psu' as const,
}

describe('Admin dashboard backend', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    mockedAuth.mockResolvedValue(adminSession)

    vi.mocked(prisma.category.findFirst).mockResolvedValue({
      id: 'cat',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any)
  })

  describe('Edit Product', () => {
    it('Should return unauthorized when user is not admin', async () => {
      mockedAuth.mockResolvedValue(userSession)

      const result = await UpdateProduct('1', validProductData)

      expect(result).toEqual({ success: false, error: 'Unauthorized' })
      expect(prisma.product.update).not.toHaveBeenCalled()
      expect(createLog).not.toHaveBeenCalled()
    })

    it('Should return zod validation errors', async () => {
      const invalidData = {
        ...validProductData,
        name: 'bq',
        price: -5,
      }

      const result = await UpdateProduct('1', invalidData)
      expect(result.success).toBe(false)
      expect(prisma.product.update).not.toHaveBeenCalled()
      expect(createLog).not.toHaveBeenCalled()
    })

    it('Should update product and return success', async () => {
      const result = await UpdateProduct('1', validProductData)
      expect(result).toEqual({ success: true })
      expect(prisma.product.update).toHaveBeenCalledOnce()
      expect(createLog).toHaveBeenCalledOnce()
    })
  })

  describe('Add Product', () => {
    it('Should return unauthorized when user is not admin', async () => {
      mockedAuth.mockResolvedValue(userSession)

      const result = await AddProduct(validProductData)

      expect(result).toEqual({ success: false, error: 'Unauthorized' })
      expect(prisma.product.create).not.toHaveBeenCalled()
      expect(createLog).not.toHaveBeenCalled()
    })

    it('Should return zod validation errors', async () => {
      const invalidData = {
        ...validProductData,
        name: 'bq',
        price: -5,
      }

      const result = await AddProduct(invalidData)

      expect(result.success).toBe(false)
      expect(prisma.product.create).not.toHaveBeenCalled()
      expect(createLog).not.toHaveBeenCalled()
    })

    it('Should add product and return success', async () => {
      const result = await AddProduct(validProductData)

      expect(result).toEqual({ success: true })

      expect(prisma.product.create).toHaveBeenCalledOnce()
      expect(createLog).toHaveBeenCalledOnce()
    })
  })
})
