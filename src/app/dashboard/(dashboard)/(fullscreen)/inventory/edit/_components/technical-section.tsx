'use client'

import { FormHeader } from '@/app/dashboard/(dashboard)/(fullscreen)/inventory/edit/_components/form-header'
import { Button } from '@/components/ui'
import { SelectInput } from '@/app/dashboard/(dashboard)/(fullscreen)/inventory/_components/select-input'
import { RemoveButton } from '@/app/dashboard/(dashboard)/(fullscreen)/inventory/edit/_components/remove-button'
import { TechnicalType } from '@/app/dashboard/(dashboard)/(fullscreen)/inventory/edit/_components/types'
import { Dispatch, SetStateAction } from 'react'

type TechnicalSectionProps = {
  technical: TechnicalType
  setTechnical: Dispatch<SetStateAction<TechnicalType>>
  techKeyOptions: string[]
  techValueOptions: string[]
}

export const TechnicalSection = ({
  technical,
  setTechnical,
  techKeyOptions,
  techValueOptions,
}: TechnicalSectionProps) => {
  const handleAddTechnical = () => {
    setTechnical((prev) => {
      const temporaryKey = `new_technical_${Date.now()}`

      return {
        ...prev,
        [temporaryKey]: [],
      }
    })
  }

  const handleRemoveTechnical = (keyToRemove: string) => {
    setTechnical((prev) => {
      const newTechnical = { ...prev }

      delete newTechnical[keyToRemove]

      return newTechnical
    })
  }

  const handleUpdateTechnicalKey = (oldKey: string, newKey: string) => {
    setTechnical((prev) => {
      if (oldKey === newKey || !newKey) return prev

      return Object.keys(prev).reduce((newObject, currentKey) => {
        if (currentKey === oldKey) {
          newObject[newKey] = prev[oldKey]
        } else {
          newObject[currentKey] = prev[currentKey]
        }

        return newObject
      }, {} as TechnicalType)
    })
  }

  const handleUpdateTechnicalValue = (
    key: string,
    newValue: string | string[] | boolean,
  ) => {
    setTechnical((prev) => {
      let finalValue: string | string[] | boolean = newValue

      if (Array.isArray(newValue)) {
        if (newValue.length === 0) {
          finalValue = ''
        } else if (newValue.length === 1) {
          finalValue = newValue[0]
        }
      }

      if (finalValue === 'true') finalValue = true
      if (finalValue === 'false') finalValue = false

      return Object.keys(prev).reduce((newObject, currentKey) => {
        if (currentKey === key) {
          newObject[key] = finalValue
        } else {
          newObject[currentKey] = prev[currentKey]
        }

        return newObject
      }, {} as TechnicalType)
    })
  }

  return (
    <div className="mt-8">
      <FormHeader>
        <span className="sr-only">Technical section</span>
        <span aria-hidden="true">Technical_section</span>
      </FormHeader>

      {Object.entries(technical).length !== 0 ? (
        Object.entries(technical).map(([key, value], index, array) => {
          const usedKeys = array.map(([key]) => key)

          const availableKeyOptions = techKeyOptions.filter(
            (option) =>
              option === 'Other' ||
              option === key ||
              !usedKeys.includes(option),
          )

          const safeValueForCheckbox = Array.isArray(value)
            ? (value as string[])
            : typeof value === 'string' && value.trim() !== ''
              ? [value]
              : typeof value === 'boolean'
                ? [String(value)]
                : []

          const isValueBoolean = typeof value === 'boolean'

          return (
            <div key={key} className="gap-4 md:flex">
              <div className="mb-4 flex gap-4 md:flex-1">
                <div className="min-w-0 flex-1">
                  <SelectInput
                    section="technical"
                    mode="key"
                    selected={key}
                    options={availableKeyOptions}
                    onChange={(newKey) =>
                      handleUpdateTechnicalKey(key, newKey as string)
                    }
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <SelectInput
                    section="technical"
                    mode="value"
                    type={isValueBoolean ? 'radio' : 'checkbox'}
                    onChange={(newValue) =>
                      handleUpdateTechnicalValue(key, newValue)
                    }
                    selected={safeValueForCheckbox as string | string[]}
                    options={
                      isValueBoolean ? ['true', 'false'] : techValueOptions
                    }
                  />
                </div>
              </div>

              <RemoveButton handleClick={() => handleRemoveTechnical(key)} />
            </div>
          )
        })
      ) : (
        <div className="border-accent/30 bg-warning/10 text-accent flex w-full flex-col gap-4 px-3 py-6 text-center">
          <span className="tracking-widest">
            <span aria-hidden="true">[ AWAITING_INPUT ]</span>
            <span className="sr-only">Empty section</span>
          </span>
          <p className="text-sm opacity-80">
            No technical specifications found
          </p>
        </div>
      )}

      <Button
        type="button"
        variant="secondary"
        className="mt-6"
        onClick={handleAddTechnical}
      >
        Add technical
      </Button>
    </div>
  )
}
