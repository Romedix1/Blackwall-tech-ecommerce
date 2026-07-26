import { SectionHeader } from '@/app/(home)/product/[productName]/_components'
import { Separator } from '@/components/ui'
import { Fragment } from 'react'

export const SpecificationListSkeleton = () => {
  const fakeCategories = Array.from({ length: 4 })
  const fakeAttributes = Array.from({ length: 5 })

  return (
    <div>
      <SectionHeader text="System diagnostics log" />

      <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
        <ul className="flex w-full flex-col gap-2 lg:w-4/12">
          {fakeCategories.map((_, index) => (
            <li key={index}>
              <div className="skeleton-loading h-11 w-full" />
            </li>
          ))}
        </ul>

        <ul className="w-full">
          {fakeAttributes.map((_, index) => (
            <Fragment key={index}>
              <li className="flex justify-between py-4">
                <div className="skeleton-loading h-5 w-1/3" />
                <div className="skeleton-loading h-5 w-1/3" />
              </li>
              <Separator className="opacity-30" />
            </Fragment>
          ))}
        </ul>
      </div>
    </div>
  )
}
