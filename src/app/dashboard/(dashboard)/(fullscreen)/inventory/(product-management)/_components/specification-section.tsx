'use client'

import { SelectInput } from '@/app/dashboard/(dashboard)/(fullscreen)/inventory/_components/select-input'
import { FormHeader } from '@/app/dashboard/(dashboard)/(fullscreen)/inventory/(product-management)/_components/form-header'
import { RemoveButton } from '@/app/dashboard/(dashboard)/(fullscreen)/inventory/(product-management)/_components/remove-button'
import { Button } from '@/components/ui'
import { SpecSection } from '@/types'
import { Dispatch, SetStateAction } from 'react'
import { EmptySection } from '@/app/dashboard/(dashboard)/(fullscreen)/inventory/(product-management)/_components/empty-section'

type SpecificatioSectionProps = {
  specification: SpecSection[]
  setSpecification: Dispatch<SetStateAction<SpecSection[]>>
  specLabelOptions: string[]
  specKeyOptions: string[]
  specValueOptions: string[]
}

export const SpecificationSection = ({
  specification,
  setSpecification,
  specLabelOptions,
  specKeyOptions,
  specValueOptions,
}: SpecificatioSectionProps) => {
  const handleAddAttribute = (sectionId: string) => {
    setSpecification((prev) => {
      const temporaryKey = `new_attribute_${Date.now()}`

      return prev.map((section) => {
        if (section.id === sectionId) {
          return {
            ...section,
            attributes: [
              ...section.attributes,
              { key: temporaryKey, value: '' },
            ],
          }
        }

        return section
      })
    })
  }

  const handleRemoveSpecification = (sectionId: string) => {
    setSpecification((prev) =>
      prev.filter((section) => section.id !== sectionId),
    )
  }

  const handleRemoveAttribute = (sectionId: string, attrIndex: number) => {
    setSpecification((prev) => {
      return prev.map((section) => {
        if (section.id === sectionId) {
          return {
            ...section,
            attributes: section.attributes.filter(
              (_, index) => index !== attrIndex,
            ),
          }
        }

        return section
      })
    })
  }

  const handleAddSpecification = () => {
    setSpecification((prev) => {
      const temporaryLabel = `new_specs_${Date.now()}`

      const maxId = prev.reduce((max, section) => {
        const currentIdNum = parseInt(section.id, 10)
        return isNaN(currentIdNum) ? max : Math.max(max, currentIdNum)
      }, 0)

      const nextId = String(maxId + 1).padStart(2, '0')

      return [
        ...prev,
        {
          id: nextId,
          label: temporaryLabel,
          attributes: [],
        },
      ]
    })
  }

  const handleUpdateSpecificationLabel = (
    specificationId: string,
    newLabel: string,
  ) => {
    setSpecification((prev) => {
      return prev.map((spec) => {
        if (spec.id === specificationId) {
          return {
            ...spec,
            label: newLabel,
          }
        }

        return spec
      })
    })
  }

  const handleUpdateAttributeKey = (
    specificationId: string,
    attrIndex: number,
    newKey: string | string[],
  ) => {
    setSpecification((prev) => {
      return prev.map((spec) => {
        if (spec.id === specificationId) {
          return {
            ...spec,
            attributes: spec.attributes.map((attr, index) => {
              if (index === attrIndex) {
                return { ...attr, key: newKey as string }
              }

              return attr
            }),
          }
        }

        return spec
      })
    })
  }

  const handleUpdateAttributeValue = (
    specificationId: string,
    key: string,
    newValue: string,
  ) => {
    setSpecification((prev) => {
      return prev.map((spec) => {
        if (spec.id === specificationId) {
          return {
            ...spec,
            attributes: spec.attributes.map((attr) => {
              if (attr.key === key) {
                return { ...attr, value: newValue }
              }

              return attr
            }),
          }
        }

        return spec
      })
    })
  }

  return (
    <div className="mt-8">
      <FormHeader>
        <span className="sr-only">Detailed specifications</span>
        <span aria-hidden="true">Detailed_Specifications</span>
      </FormHeader>

      <div className="flex flex-col gap-8">
        {specification.length !== 0 ? (
          (() => {
            const usedSpecLabel = specification.map((spec) => spec.label)

            return specification.map((spec) => {
              const availableSpecLabelOptions = specLabelOptions.filter(
                (option) =>
                  option === 'Other' ||
                  option === spec.label ||
                  !usedSpecLabel.includes(option),
              )
              return (
                <div key={spec.id}>
                  <div className="mb-6 flex items-center gap-4">
                    <div className="min-w-0 flex-1">
                      <SelectInput
                        section="specification"
                        mode="label"
                        selected={spec.label}
                        options={availableSpecLabelOptions}
                        onChange={(newLabel) =>
                          handleUpdateSpecificationLabel(
                            spec.id,
                            newLabel as string,
                          )
                        }
                      />
                    </div>
                    <Button
                      onClick={() => handleRemoveSpecification(spec.id)}
                      className="h-10 min-w-0 flex-1 text-sm"
                      type="button"
                      variant="delete"
                    >
                      <span className="sr-only">Remove</span>
                      <span aria-hidden="true">[ Remove ]</span>
                    </Button>
                  </div>

                  <div className="border-accent/20 flex flex-col gap-2 border-l-2 pl-4">
                    {(() => {
                      const usedSpecKeys = spec.attributes.map(
                        (attr) => attr.key,
                      )

                      return spec.attributes.map((attr, attrIndex) => {
                        const availableSpecKeyOptions = specKeyOptions.filter(
                          (option) =>
                            option === 'Other' ||
                            option === attr.key ||
                            !usedSpecKeys.includes(option),
                        )

                        return (
                          <div key={attrIndex} className="gap-4 md:flex">
                            <div className="mb-4 flex gap-4 md:flex-1">
                              <div className="min-w-0 flex-1">
                                <SelectInput
                                  section="specification"
                                  mode="key"
                                  selected={attr.key}
                                  options={availableSpecKeyOptions}
                                  onChange={(newKey) =>
                                    handleUpdateAttributeKey(
                                      spec.id,
                                      attrIndex,
                                      newKey,
                                    )
                                  }
                                />
                              </div>

                              <div className="min-w-0 flex-1">
                                <SelectInput
                                  section="specification"
                                  mode="value"
                                  selected={attr.value}
                                  options={specValueOptions}
                                  onChange={(newValue) =>
                                    handleUpdateAttributeValue(
                                      spec.id,
                                      attr.key,
                                      newValue as string,
                                    )
                                  }
                                />
                              </div>
                            </div>

                            <RemoveButton
                              handleClick={() =>
                                handleRemoveAttribute(spec.id, attrIndex)
                              }
                            />
                          </div>
                        )
                      })
                    })()}

                    <Button
                      type="button"
                      variant="secondary"
                      className="mt-6"
                      onClick={() => handleAddAttribute(spec.id)}
                    >
                      Add attribute
                    </Button>
                  </div>
                </div>
              )
            })
          })()
        ) : (
          <EmptySection section="specification" />
        )}
      </div>

      <Button
        onClick={() => handleAddSpecification()}
        type="button"
        variant="secondary"
        className="mt-8"
      >
        <span className="sr-only">Create new specification</span>
        <span aria-hidden="true">[ Create_new_specification ]</span>
      </Button>
    </div>
  )
}
