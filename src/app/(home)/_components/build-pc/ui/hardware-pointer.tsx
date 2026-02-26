import { cn } from '@/lib/utils'

type ImageCornerProps = {
  position: string
  width: string
  text: string
  rotateToLeft?: boolean
  isVisible: boolean
}

export const HardwarePointer = ({
  position,
  width,
  text,
  rotateToLeft,
  isVisible,
}: ImageCornerProps) => {
  return (
    <div
      className={cn(
        'absolute z-30 flex flex-col items-end transition-all duration-700 ease-out',
        position,
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0',
      )}
    >
      <span
        className={cn(
          'text-accent absolute -top-3 -right-6 w-fit text-[10px] font-bold whitespace-nowrap sm:-top-5 sm:text-sm 2xl:text-base',
          rotateToLeft && 'right-6 sm:right-34',
        )}
      >
        {text}
      </span>
      <div
        className={cn('flex items-center', width, rotateToLeft && 'rotate-180')}
      >
        <div className="bg-accent h-2 w-2 shrink-0 rounded-full" />
        <div
          className={cn(
            'bg-text-second h-0.5 w-full transition-transform delay-600 duration-700 ease-out',
            isVisible ? 'scale-x-100' : 'scale-x-0',
            'origin-left',
          )}
        />
      </div>
    </div>
  )
}
