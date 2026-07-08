'use client'

import { StatusAlert, TerminalInput } from '@/components/shared'
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
import { SubmitEvent, useState, useTransition } from 'react'
import { UpdateProduct } from '@/lib/actions/dashboard-admin'
import { useRouter } from 'next/navigation'
import { EditProductSchema } from '@/lib/zod/edit-product-schema'

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

  const [isPending, startTransition] = useTransition()
  const [errorMessage, setErrorMessage] = useState<string | string[]>('')

  const [technical, setTechnical] = useState<TechnicalType>(
    initialData.technical as TechnicalType,
  )
  const [performance, setPerformance] = useState<PerformanceType[]>(
    initialData.performance as PerformanceType[],
  )
  const [specification, setSpecification] = useState<SpecSection[]>(
    initialData.specification as SpecSection[],
  )

  const router = useRouter()

  const handleProductUpdate = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrorMessage('')

    const formData = new FormData(e.currentTarget)

    const data = {
      name: formData.get('name') as string,
      slug: formData.get('slug') as string,
      price: Number(formData.get('price')),
      quantity: Number(formData.get('quantity')),
      badge: (formData.get('badge') as string) || null,
      technical: technical,
      performance: performance,
      specification: specification,
    }

    const validatedData = EditProductSchema.safeParse(data)

    if (!validatedData.success) {
      const error = validatedData.error.issues.map((issue) => issue.message)

      setErrorMessage(error)

      return
    }

    startTransition(async () => {
      const response = await UpdateProduct(initialData.id, validatedData.data)

      if (response.success) {
        router.push('/dashboard/inventory')
      } else {
        setErrorMessage(response.error || 'Unknown error')
      }
    })
  }

  return (
    <form onSubmit={handleProductUpdate}>
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
        technical={technical}
        setTechnical={setTechnical}
        techKeyOptions={techKeyOptions}
        techValueOptions={techValueOptions}
      />

      {isGpuOrCpu && (
        <PerformanceSection
          performance={performance}
          setPerformance={setPerformance}
        />
      )}

      <SpecificationSection
        specification={specification}
        setSpecification={setSpecification}
        specLabelOptions={specLabelOptions}
        specKeyOptions={specKeyOptions}
        specValueOptions={specValueOptions}
      />

      <div className="border-accent/40 my-12 border-t"></div>

      {errorMessage && <StatusAlert text={errorMessage} variant="error" />}

      <Button
        disabled={isPending}
        type="submit"
        variant="primary"
        className="mt-8"
      >
        <span className="sr-only">Update data</span>
        <span aria-hidden="true">[ Update data ]</span>
      </Button>
    </form>
  )
}
