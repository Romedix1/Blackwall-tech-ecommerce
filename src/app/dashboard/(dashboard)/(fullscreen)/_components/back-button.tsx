import { Button } from '@/components/ui'
import Link from 'next/link'

type BackButtonProps = {
  link: string
}

export const BackButton = ({ link }: BackButtonProps) => {
  return (
    <Button
      asChild
      variant={'secondary'}
      className="text-text-second flex h-fit w-fit items-center px-3 py-2 text-sm"
    >
      <Link href={link}>
        <span className="sr-only uppercase">Return</span>
        <span aria-hidden="true">[ Return ]</span>
      </Link>
    </Button>
  )
}
