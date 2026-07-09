import { Button } from '@/components/ui'

type RemoveButtonProps = {
  handleClick: () => void
}

export const RemoveButton = ({ handleClick }: RemoveButtonProps) => {
  return (
    <Button
      type="button"
      variant="delete"
      onClick={handleClick}
      className="mb-6 h-10 text-sm md:mb-6 md:w-2/12"
    >
      Remove
    </Button>
  )
}
