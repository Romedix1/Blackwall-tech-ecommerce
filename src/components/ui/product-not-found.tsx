import { Button } from '@/components/ui/button'
import Link from 'next/link'

type ProductNotFoundprops = {
  href: string
  buttonText: string[]
}

export const ProductNotFound = ({ href, buttonText }: ProductNotFoundprops) => {
  return (
    <div className="mt-24 flex items-center justify-center">
      <div className="bg-error-bg/60 flex h-full w-11/12 flex-col items-center justify-center gap-6 p-8 text-center lg:w-6/12">
        <h1 className="text-error-text text-lg font-bold tracking-widest wrap-break-word lg:text-3xl">
          <span className="sr-only">Error 404: Product not found</span>

          <span aria-hidden="true">ERR_404 // NULL_ENTITY</span>
        </h1>

        <p className="text-text-second text-sm tracking-wider uppercase">
          <span className="sr-only">System warning</span>
          <span aria-hidden="true" className="text-warning">
            [ System_warning ]
          </span>
          : The record with the specified identifier does not exist in the
          database or has been purged.
        </p>

        <Button
          asChild
          variant="secondary"
          className="mt-4 flex items-center justify-center"
        >
          <Link href={href}>
            <span className="sr-only">{buttonText[0]}</span>
            <span aria-hidden="true">[ {buttonText[1]} ]</span>
          </Link>
        </Button>
      </div>
    </div>
  )
}
