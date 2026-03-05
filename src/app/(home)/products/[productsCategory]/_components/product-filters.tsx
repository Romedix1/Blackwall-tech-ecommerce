import { RadioInput } from '@/app/(home)/products/[productsCategory]/_components'
import { SearchInput } from '@/components/shared'
import { Button } from '@/components/ui'

export const ProductFilters = () => {
  return (
    <>
      <Button
        className="text-accent w-fit px-4 py-3 text-xs uppercase sm:px-6 sm:text-sm lg:hidden"
        variant="secondary"
      >
        <span aria-hidden="true">[</span>
        <span>+</span>
        <span aria-hidden="true">]</span>
        <span className="ml-2">Filters</span>
      </Button>

      <div className="hidden flex-col gap-8 lg:flex">
        <div className="flex flex-col gap-3">
          <SearchInput
            placeholder="Filter products"
            ariaLabel="Filter products"
            containerClassName="w-full xl:w-full"
            variant="filter"
          />

          <p className="text-text-second text-sm uppercase">
            <span aria-hidden="true">[</span>
            <span aria-hidden="true">Reset_all_filters</span>
            <span className="sr-only">Reset all filters</span>
            <span aria-hidden="true">]</span>
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <h3 className="text-accent">
            <span aria-hidden="true">{'// '}</span>
            Memory capacity
          </h3>

          <RadioInput name="aa" label="24gb" />
          <RadioInput name="aa" label="24gb" />
          <RadioInput name="aa" label="24gb" />
        </div>
      </div>
    </>
  )
}
