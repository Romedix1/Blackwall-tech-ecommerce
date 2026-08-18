import { Button } from '@/components/ui'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="container mx-auto my-36 flex flex-col items-center justify-center px-4 text-center">
      <div className="bg-surface flex max-w-lg flex-col gap-6 border p-8">
        <div>
          <h2 className="text-accent mb-2 text-xl font-bold">
            <span className="sr-only">Error 404</span>
            <span aria-hidden="true">{'//'} 404_ERROR</span>
          </h2>
          <h1 className="mb-4 text-3xl font-extrabold tracking-wider uppercase">
            Page Not Found
          </h1>
          <p className="text-text-second mb-6 text-sm">
            The requested coordinate could not be located in the Blackwall
            database. The link might be broken or the sector has been offline
          </p>
        </div>

        <Button
          asChild
          variant="secondary"
          className="flex items-center justify-center"
        >
          <Link href="/">[ Return to Home ]</Link>
        </Button>
      </div>
    </div>
  )
}
