'use client'

import { TerminalInput } from '@/components/shared'
import { Product } from '../../../../../../../../generated/prisma'
import { Button } from '@/components/ui'
import {
  PerformanceType,
  TechnicalType,
} from '@/app/dashboard/(dashboard)/(fullscreen)/inventory/edit/_components/types'
import {
  SpecificationSection,
  TechnicalSection,
} from '@/app/dashboard/(dashboard)/(fullscreen)/inventory/edit/_components/'
import { SpecSection } from '@/types'
import { PerformanceSection } from '@/app/dashboard/(dashboard)/(fullscreen)/inventory/edit/_components/'

type ProductFormProps = {
  initialData: Product
  techKeyOptions: string[]
  techValueOptions: string[]
  isGpuOrCpu: boolean
  specLabelOptions: string[]
  specKeyOptions: string[]
  specValueOptions: string[]
}

export const ProductForm = ({
  initialData,
  techKeyOptions,
  techValueOptions,
  isGpuOrCpu,
  specLabelOptions,
  specKeyOptions,
  specValueOptions,
}: ProductFormProps) => {
  const BASE_FIELDS = [
    {
      name: 'name',
      label: 'Product Name',
      type: 'text',
      required: true,
      ariaLabel: 'Enter the product name',
    },
    {
      name: 'slug',
      label: 'Slug',
      type: 'text',
      required: true,
      ariaLabel: 'Enter the product slug',
    },
    {
      name: 'price',
      label: 'Price ($)',
      type: 'number',
      step: '0.01',
      required: true,
      ariaLabel: 'Enter the product price in dollars',
    },
    {
      name: 'quantity',
      label: 'Stock Quantity',
      type: 'number',
      required: true,
      ariaLabel: 'Enter the available stock quantity',
    },
    {
      name: 'badge',
      label: 'Badge (Optional)',
      type: 'text',
      required: false,
      ariaLabel: 'Enter an optional promotional badge for the product',
    },
  ]

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {BASE_FIELDS.map((field) => (
          <div
            key={field.name}
            className={
              field.name === 'price' || field.name === 'quantity'
                ? 'sm:col-span-1'
                : 'sm:col-span-2'
            }
          >
            <TerminalInput
              type={field.type}
              required={field.required}
              defaultValue={
                (initialData[field.name as keyof typeof initialData] as
                  | string
                  | number) || ''
              }
              placeholder={field.label}
              aria-label={field.ariaLabel}
              name={field.name}
            />
          </div>
        ))}
      </div>

      <TechnicalSection
        initialData={(initialData.technical as TechnicalType) || {}}
        techKeyOptions={techKeyOptions}
        techValueOptions={techValueOptions}
      />

      {isGpuOrCpu && (
        <PerformanceSection
          initialData={(initialData?.performance as PerformanceType[]) || []}
        />
      )}

      <SpecificationSection
        initialData={(initialData.specification as SpecSection[]) || []}
        specLabelOptions={specLabelOptions}
        specKeyOptions={specKeyOptions}
        specValueOptions={specValueOptions}
      />

      <div className="border-accent/40 my-12 border-t"></div>

      <Button onClick={() => console.log('')} type="button" variant="primary">
        <span className="sr-only">Update data</span>
        <span aria-hidden="true">[ Update data ]</span>
      </Button>
    </>
  )
}
