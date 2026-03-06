'use client'

import { InputHTMLAttributes, MouseEvent } from 'react'

interface RadioInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  onToggle: () => void
}

export const RadioInput = ({ label, onToggle, ...props }: RadioInputProps) => {
  const handleRadioClick = (e: MouseEvent<HTMLInputElement>) => {
    onToggle()
  }

  return (
    <label className="group flex cursor-pointer items-center gap-x-1 font-mono uppercase">
      <input
        onClick={handleRadioClick}
        type="radio"
        onChange={() => {}}
        className="peer sr-only"
        {...props}
      />

      <span className="peer-checked:text-accent" aria-hidden="true">
        [
      </span>

      <span
        className="peer-checked:text-accent text-center after:content-['_'] peer-checked:after:content-['x']"
        aria-hidden="true"
      ></span>

      <span className="peer-checked:text-accent" aria-hidden="true">
        ]
      </span>

      <span className="peer-checked:text-accent ml-1 text-sm">{label}</span>
    </label>
  )
}
