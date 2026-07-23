import React from 'react'

export const ProductSkeleton = () => {
  return (
    <article className="h-full">
      <div className="flex h-full flex-col gap-6 border p-4">
        <div className="relative flex aspect-4/3 w-full flex-col items-center justify-center">
          <div className="bg-accent/70 h-full w-full animate-pulse"></div>
        </div>

        <div className="flex flex-1 flex-col gap-2">
          <div className="bg-accent/70 h-5 w-full animate-pulse"></div>
          <div className="bg-accent/70 h-5 w-3/4 animate-pulse"></div>
        </div>

        <div className="bg-accent/70 h-14 w-full animate-pulse"></div>
      </div>
    </article>
  )
}
