'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { DropdownMenu } from 'radix-ui'

type ProductSortProps = {
  device: string
}

const SORT_OPTIONS = [
  { label: 'Newest_arrivals', value: 'newest' },
  { label: 'Price: lowest_first', value: 'price_asc' },
  { label: 'Price: highest_first', value: 'price_desc' },
  { label: 'Alphabetical_(A-Z)', value: 'name_asc' },
]

export const ProductSort = ({ device }: ProductSortProps) => {
  const sortParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()

  const currentSortValue = sortParams.get('sort') || 'newest'
  const currentOption =
    SORT_OPTIONS.find((opt) => opt.value === currentSortValue) ||
    SORT_OPTIONS[0]

  const handleSortChange = (newValue: string) => {
    const params = new URLSearchParams(sortParams.toString())
    params.set('sort', newValue)
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger className="text-text-second hover:text-text-main focus:text-text-main terminal-hover border-border relative z-30 w-60 cursor-pointer px-4 py-2 text-left uppercase">
        <span className="truncate">
          <span aria-hidden="true">&gt;</span>
          <span className="ml-2">
            {currentOption ? currentOption.label : 'Sort:'}
          </span>
        </span>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content className="bg-surface relative z-30 ml-7 border px-4">
        <DropdownMenu.RadioGroup
          value={currentOption.value}
          onValueChange={handleSortChange}
        >
          {SORT_OPTIONS.map((option) => (
            <DropdownMenu.RadioItem
              key={`${device}-${option.value}`}
              value={option.value}
              className="text-text-second focus:text-primary-active hover:text-primary-active relative flex cursor-pointer items-center py-2 pr-2 pl-10 uppercase transition-colors outline-none select-none"
            >
              <DropdownMenu.ItemIndicator className="text-primary-active absolute left-0">
                [X]
              </DropdownMenu.ItemIndicator>
              {option.label}
            </DropdownMenu.RadioItem>
          ))}
        </DropdownMenu.RadioGroup>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}
