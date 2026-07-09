'use client'

import { EmptySection } from '@/app/dashboard/(dashboard)/(fullscreen)/inventory/(product-management)/_components/empty-section'
import { FormHeader } from '@/app/dashboard/(dashboard)/(fullscreen)/inventory/(product-management)/_components/form-header'
import { PerformanceType } from '@/app/dashboard/(dashboard)/(fullscreen)/inventory/(product-management)/_components/types'
import { TerminalInput } from '@/components/shared'
import { Button } from '@/components/ui'
import { Dispatch, SetStateAction } from 'react'

type PerformanceSectionProps = {
  performance: PerformanceType[]
  setPerformance: Dispatch<SetStateAction<PerformanceType[]>>
}

export const PerformanceSection = ({
  performance,
  setPerformance,
}: PerformanceSectionProps) => {
  const handleAddPerformance = () => {
    setPerformance((prev) => [...prev, { fps: '', gameName: '', settings: '' }])
  }

  const handleRemovePerformance = (indexToRemove: number) => {
    setPerformance((prev) => prev.filter((_, index) => index !== indexToRemove))
  }

  const handleUpdatePerformance = (
    indexToUpdate: number,
    field: keyof PerformanceType,
    newValue: string | number,
  ) => {
    setPerformance((prev) =>
      prev.map((item, index) => {
        if (index === indexToUpdate) {
          return {
            ...item,
            [field]: newValue,
          }
        }

        return item
      }),
    )
  }

  return (
    <div className="mt-8">
      <FormHeader>Performance</FormHeader>

      <div className="flex flex-col gap-8">
        {performance.length !== 0 ? (
          performance.map((perf, index) => (
            <div key={`performance-${index}`}>
              <div className="mb-6 flex items-center gap-4">
                <div className="min-w-0 flex-1">
                  <TerminalInput
                    type="text"
                    placeholder="Game name"
                    name={`performance-gameName-${index}`}
                    value={perf.gameName}
                    onChange={(event) =>
                      handleUpdatePerformance(
                        index,
                        'gameName',
                        event.target.value,
                      )
                    }
                    aria-label={`Enter game name for performance entry ${index + 1}`}
                  />
                </div>
                <Button
                  onClick={() => handleRemovePerformance(index)}
                  className="h-10 min-w-0 flex-1 text-sm"
                  type="button"
                  variant="delete"
                >
                  <span className="sr-only">Remove</span>
                  <span aria-hidden="true">[ Remove ]</span>
                </Button>
              </div>

              <div className="border-accent/20 flex flex-col gap-2 border-l-2 pl-4">
                <div className="gap-4 md:flex">
                  <div className="flex gap-4 md:flex-1">
                    <div className="min-w-0 flex-1">
                      <TerminalInput
                        type="number"
                        placeholder="fps"
                        value={perf.fps}
                        name={`performance-fps-${index}`}
                        onChange={(event) =>
                          handleUpdatePerformance(
                            index,
                            'fps',
                            event.target.value,
                          )
                        }
                        aria-label={`Enter average FPS for ${perf.gameName || `game ${index + 1}`}`}
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <TerminalInput
                        type="text"
                        placeholder="Settings"
                        value={perf.settings}
                        name={`performance-settings-${index}`}
                        aria-label={`Enter graphic settings for ${perf.gameName || `game ${index + 1}`}`}
                        onChange={(event) =>
                          handleUpdatePerformance(
                            index,
                            'settings',
                            event.target.value,
                          )
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <EmptySection section="performance" />
        )}
      </div>

      <Button
        onClick={() => handleAddPerformance()}
        type="button"
        variant="secondary"
        className="mt-8"
      >
        <span className="sr-only">Add new game</span>
        <span aria-hidden="true">[ Add_new_game ]</span>
      </Button>
    </div>
  )
}
