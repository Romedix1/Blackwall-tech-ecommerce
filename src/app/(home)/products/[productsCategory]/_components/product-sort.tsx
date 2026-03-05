import { Button } from '@/components/ui'

export const ProductSort = () => {
  return (
    <Button
      className="text-text-second border-border w-fit px-4 py-3 text-xs uppercase sm:px-6 sm:text-sm lg:border-none lg:p-0"
      variant="secondary"
    >
      <span aria-hidden="true">&gt;</span>
      <span className="ml-2">
        Sort
        <span className="hidden lg:inline-block" aria-hidden="true">
          : High_performance_first
        </span>
        <span className="sr-only">High performance first</span>
      </span>
    </Button>
  )
}
