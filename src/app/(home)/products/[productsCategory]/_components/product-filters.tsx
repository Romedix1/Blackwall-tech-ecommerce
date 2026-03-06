'use client'

import { RadioInput } from '@/app/(home)/products/[productsCategory]/_components'
import { SearchInput } from '@/components/shared'
import { Button } from '@/components/ui'
import { useState } from 'react'

type FilterEntry = {
  key: string
  values: string[]
}

type ProductFiltersProps = {
  filtersData: FilterEntry[]
}

export const ProductFilters = ({ filtersData }: ProductFiltersProps) => {
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({})
  const [showAllFilters, setShowAllFilters] = useState(false)

  const handleToggle = (key: string, value: string) => {
    setActiveFilters((prev) => {
      if (prev[key] === value) {
        const next = { ...prev }
        delete next[key]
        return next
      }
      return { ...prev, [key]: value }
    })
  }

  const FILTERS_LIMIT = 5
  const visibleSections = showAllFilters
    ? filtersData
    : filtersData.slice(0, FILTERS_LIMIT)

  const hiddenSectionsCount = filtersData.length - FILTERS_LIMIT

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

        {visibleSections.map((filter) => {
          return (
            <div className="flex flex-col gap-3 uppercase" key={filter.key}>
              <h3 className="text-accent">
                <span aria-hidden="true">{'// '}</span>
                {filter.key}
              </h3>
              <div className="flex flex-col gap-1 uppercase">
                {filter.values.map((value) => (
                  <RadioInput
                    key={value}
                    name={filter.key}
                    label={value}
                    checked={activeFilters[filter.key] === value}
                    onToggle={() => handleToggle(filter.key, value)}
                  />
                ))}
              </div>
            </div>
          )
        })}

        {filtersData.length > FILTERS_LIMIT && (
          <Button
            className="text-xs"
            onClick={() => setShowAllFilters(!showAllFilters)}
          >
            {showAllFilters ? (
              <>
                <span aria-hidden="true">[ Hide_filters ]</span>
                <span className="sr-only">Hide filters</span>
              </>
            ) : (
              <>
                <span aria-hidden="true">
                  [ +{hiddenSectionsCount}_more_filters_available ]
                </span>
                <span className="sr-only">
                  {hiddenSectionsCount} more filters available
                </span>
              </>
            )}
          </Button>
        )}
      </div>
    </>
  )
}
