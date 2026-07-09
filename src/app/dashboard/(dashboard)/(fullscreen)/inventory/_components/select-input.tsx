'use client'

import { TerminalInput } from '@/components/shared'
import { cn } from '@/lib'
import { useEffect, useRef, useState } from 'react'

type SelectInputType = {
  options: string[]
  selected: string | string[]
  type?: 'radio' | 'checkbox'
  mode: 'key' | 'value' | 'label'
  section: 'technical' | 'specification' | 'category'
  onChange?: (newValue: string | string[]) => void
  className?: string
}

export const SelectInput = ({
  options,
  selected,
  type = 'radio',
  mode,
  section,
  onChange,
  className,
}: SelectInputType) => {
  const [isOpen, setIsOpen] = useState(false)
  const [currentSelected, setCurrentSelected] = useState<string | string[]>(
    selected,
  )

  const inputRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleAdd = (option: string) => {
    if (type === 'checkbox') {
      const currentArray = Array.isArray(currentSelected) ? currentSelected : []

      const newArray = currentArray.includes(option)
        ? currentArray.filter((item) => item !== option)
        : [...currentArray, option]

      setCurrentSelected(newArray)
      onChange?.(newArray)
    } else {
      setCurrentSelected(option)
      setIsOpen(false)
      onChange?.(option)
    }
  }

  const customOptions = Array.isArray(currentSelected)
    ? currentSelected.filter(
        (val) => !options.includes(val) && !val.startsWith('Other'),
      )
    : currentSelected &&
        !options.includes(currentSelected) &&
        !currentSelected.startsWith('Other')
      ? [currentSelected]
      : []

  const combinedOptions = [...options, ...customOptions]

  return (
    <div ref={inputRef} className={cn('relative flex flex-col', className)}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="terminal-hover border-accent/20 flex w-full cursor-pointer items-center justify-between border p-2"
      >
        <span className="min-w-0 flex-1 truncate text-left">
          {Array.isArray(currentSelected)
            ? currentSelected.length === 0
              ? '...'
              : currentSelected.join(', ')
            : !currentSelected
              ? '...'
              : currentSelected}
        </span>
        <div className={cn(isOpen && 'rotate-180', 'ml-2')}>
          <div>[v]</div>
        </div>
      </button>

      {isOpen && (
        <div className="bg-surface border-accent/40 absolute top-12 z-30 flex max-h-64 w-full flex-col overflow-y-auto border">
          {combinedOptions.map((option, index) => {
            const isSelected = Array.isArray(currentSelected)
              ? currentSelected.includes(option)
              : currentSelected === option

            return (
              <button
                type="button"
                className={cn(
                  'terminal-hover w-full cursor-pointer border-b px-4 py-2.5 text-left',
                  isSelected && 'bg-accent/20',
                )}
                key={`option-${index}`}
                onClick={() => handleAdd(option)}
              >
                {option}
              </button>
            )
          })}
        </div>
      )}

      {(currentSelected === 'Other' ||
        (Array.isArray(currentSelected) &&
          currentSelected.includes('Other'))) && (
        <div className="mt-4 **:truncate">
          <TerminalInput
            placeholder={`New_${section}_${mode}`}
            aria-label={`Add new ${section} ${mode}`}
            onBlur={(e) => {
              const customValue = e.target.value.trim()

              if (customValue) {
                if (type === 'checkbox' && Array.isArray(currentSelected)) {
                  const newArray = currentSelected.map((item) =>
                    item.startsWith('Other') ? customValue : item,
                  )

                  setCurrentSelected(newArray)
                  onChange?.(newArray)
                } else {
                  setCurrentSelected(customValue)
                  onChange?.(customValue)
                }
              }
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                e.currentTarget.blur()
              }
            }}
          />
        </div>
      )}
    </div>
  )
}
