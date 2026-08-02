'use client'

import { StatusAlert, TerminalInput } from '@/components/shared'
import { Product } from '../../../../../../../../generated/prisma'
import { Button } from '@/components/ui'
import {
  PerformanceType,
  TechnicalType,
} from '@/app/dashboard/(dashboard)/(fullscreen)/inventory/(product-management)/_components/types'
import {
  SpecificationSection,
  TechnicalSection,
} from '@/app/dashboard/(dashboard)/(fullscreen)/inventory/(product-management)/_components'
import { SpecSection } from '@/types'
import { PerformanceSection } from '@/app/dashboard/(dashboard)/(fullscreen)/inventory/(product-management)/_components'
import { SubmitEvent, useState, useTransition } from 'react'
import { AddProduct, UpdateProduct } from '@/lib/actions/dashboard-admin'
import { useRouter } from 'next/navigation'
import { ManageProductSchema } from '@/lib/zod/manage-product-schema'
import { SelectInput } from '@/app/dashboard/(dashboard)/(fullscreen)/inventory/_components/select-input'
import { useSession } from 'next-auth/react'

type BaseProductType = {
  categories: string[]
}

type EditProductType = BaseProductType & {
  mode: 'edit'
  initialData: Product
  techKeyOptions: string[]
  techValueOptions: string[]
  specLabelOptions: string[]
  specKeyOptions: string[]
  specValueOptions: string[]
  productCategory: string
}

type AddProductType = BaseProductType & {
  mode: 'add'
}

type ProductFormProps = EditProductType | AddProductType

export const ProductForm = (props: ProductFormProps) => {
  const { data: session } = useSession()

  const isDemoAdmin = session?.user.role === 'demoAdmin'

  const { mode } = props

  const initialData = mode === 'edit' ? props.initialData : null
  const techKeyOptions = mode === 'edit' ? props.techKeyOptions : ['Other']
  const techValueOptions = mode === 'edit' ? props.techValueOptions : ['Other']
  const specLabelOptions = mode === 'edit' ? props.specLabelOptions : ['Other']
  const specKeyOptions = mode === 'edit' ? props.specKeyOptions : ['Other']
  const specValueOptions = mode === 'edit' ? props.specValueOptions : ['Other']
  const productCategory = mode === 'edit' ? props.productCategory : ''

  const categories = props.categories

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
    initialData ? (initialData.technical as TechnicalType) : {},
  )

  const [performance, setPerformance] = useState<PerformanceType[]>(
    initialData?.performance
      ? (initialData.performance as PerformanceType[])
      : [],
  )

  const [specification, setSpecification] = useState<SpecSection[]>(
    initialData?.specification
      ? (initialData.specification as SpecSection[])
      : [],
  )

  const [selectedCategory, setSelectedCategory] = useState<string>(
    productCategory || categories[0],
  )

  const router = useRouter()

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
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
      category: selectedCategory,
    }

    const validatedData = ManageProductSchema.safeParse(data)

    if (!validatedData.success) {
      const error = validatedData.error.issues.map((issue) => issue.message)

      setErrorMessage(error)

      return
    }

    startTransition(async () => {
      let response: { success: boolean; error?: string | string[] }

      if (mode === 'edit' && initialData) {
        response = await UpdateProduct(initialData.id, validatedData.data)
      } else if (mode === 'add') {
        response = await AddProduct(validatedData.data)
      } else {
        response = { success: false, error: 'Invalid mode' }
      }

      if (response.success) {
        router.push('/dashboard/inventory')
      } else {
        setErrorMessage(response.error || 'Unknown error')
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8">
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
                initialData
                  ? (initialData[field.name as keyof typeof initialData] as
                      | string
                      | number)
                  : ''
              }
              placeholder={field.label}
              aria-label={field.ariaLabel}
              name={field.name}
            />
          </div>
        ))}

        <SelectInput
          options={categories}
          selected={selectedCategory}
          mode="value"
          section="category"
          className="sm:col-span-2"
          onChange={(newValue) => {
            const valueToSet = Array.isArray(newValue) ? newValue[0] : newValue

            setSelectedCategory(valueToSet)
          }}
        />
      </div>

      <TechnicalSection
        technical={technical}
        setTechnical={setTechnical}
        techKeyOptions={techKeyOptions}
        techValueOptions={techValueOptions}
      />

      {(selectedCategory === 'gpu' || selectedCategory === 'cpu') && (
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
        disabled={isDemoAdmin || isPending}
        type="submit"
        variant="primary"
        className="mt-8"
      >
        <span className="sr-only">
          {mode === 'edit' ? 'Update data' : 'Add product'}
        </span>
        <span aria-hidden="true">
          {mode === 'edit' ? '[ Update_data ]' : '[ Add_product ]'}
        </span>
      </Button>
    </form>
  )
}
