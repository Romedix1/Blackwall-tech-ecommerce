import { z } from 'zod'

export const EditProductSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters long'),
  slug: z.string().min(1, 'Slug is required'),
  price: z.coerce
    .number({ message: 'Price must be a valid number' })
    .positive('Price must be greater than 0'),
  quantity: z.coerce
    .number({ message: 'Quantity must be a valid number' })
    .int('Quantity must be an integer')
    .min(0, 'Quantity cannot be negative'),
  badge: z
    .string()
    .trim()
    .nullable()
    .optional()
    .transform((val) => (val === '' ? null : val)),
  technical: z
    .record(z.string(), z.union([z.string(), z.array(z.string()), z.boolean()]))
    .optional()
    .default({}),
  performance: z
    .array(
      z.object({
        gameName: z.string().min(1, 'Game name is required'),
        fps: z.coerce.number().positive('FPS must be greater than 0'),
        settings: z.string().min(1, 'Settings are required'),
      }),
    )
    .optional()
    .nullable()
    .transform((val) => (val && val.length > 0 ? val : null)),
  specification: z
    .array(
      z.object({
        label: z.string().min(1, 'Group label is required'),
        attributes: z
          .array(
            z.object({
              key: z.string().min(1, 'Key is required'),
              value: z.string().min(1, 'Value is required'),
            }),
          )
          .default([]),
      }),
    )
    .optional()
    .default([]),
})
