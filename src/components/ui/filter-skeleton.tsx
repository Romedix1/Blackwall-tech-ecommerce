import React from 'react'

export const FiltersSkeleton = () => {
  return (
    <div className="flex w-full flex-col gap-8">
      <div className="flex flex-col gap-3">
        <div className="bg-accent/70 h-10 w-full animate-pulse"></div>
        <div className="bg-accent/70 h-4 w-1/2 animate-pulse"></div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="bg-accent/70 h-1 w-full animate-pulse"></div>
        <div className="flex justify-between">
          <div className="bg-accent/70 h-4 w-16 animate-pulse"></div>
          <div className="bg-accent/70 h-4 w-16 animate-pulse"></div>
        </div>
      </div>

      {Array.from({ length: 4 }).map((_, sectionIndex) => (
        <div key={sectionIndex} className="flex flex-col gap-3">
          <div className="bg-accent/90 h-5 w-2/3 animate-pulse"></div>

          <div className="flex flex-col gap-2">
            {Array.from({ length: 3 }).map((_, itemIndex) => (
              <div key={itemIndex} className="flex items-center gap-3">
                <div className="bg-accent/70 h-4 w-4 shrink-0 animate-pulse"></div>
                <div className="bg-accent/70 h-4 w-1/2 animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
