'use client'

import Image from 'next/image'
import { useState } from 'react'
import { ImageNotFound } from '@/components/ui'

type ProductImageProps = {
  src: string | null
  alt: string
}

export const ProductImage = ({ src, alt }: ProductImageProps) => {
  const [isLoading, setIsLoading] = useState(true)

  if (!src) {
    return <ImageNotFound />
  }

  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 z-10 animate-pulse rounded-md bg-gray-200 dark:bg-gray-800" />
      )}

      <Image
        src={src}
        alt={alt}
        width={300}
        height={300}
        onLoad={() => setIsLoading(false)}
        className={`relative z-20 object-contain transition-opacity duration-500 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        priority={false}
      />
    </div>
  )
}
