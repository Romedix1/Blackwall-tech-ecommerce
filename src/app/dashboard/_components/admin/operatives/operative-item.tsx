import { UsersType } from '@/app/dashboard/_components/admin/types'
import { Button } from '@/components/ui'
import Link from 'next/link'

type InventoryProductProps = {
  user: UsersType
}

export const OperativeItem = ({ user }: InventoryProductProps) => {
  return (
    <>
      <tr className="hover:bg-accent/10 border-b">
        <td className="text-text-second w-1/6 truncate p-4">{user.id}</td>
        <td className="w-1/6 truncate p-4 font-bold">{user.username}</td>
        <td className="w-1/6 truncate p-4 font-bold">{user.email}</td>
        <td className="w-1/6 truncate p-4 font-bold uppercase">
          {user.city || (
            <>
              <span className="sr-only">Unknown city</span>
              <span aria-hidden="true">[ Unknown ]</span>
            </>
          )}
        </td>
        <td className="w-1/6 p-4">
          <div className="flex flex-col items-center justify-end gap-4">
            <Button
              asChild
              variant="secondary"
              className="flex items-center justify-center"
            >
              <Link href={`/dashboard/operative/${user.id}`}>
                <span className="sr-only">Show user</span>
                <span aria-hidden="true">[ Show ]</span>
              </Link>
            </Button>
          </div>
        </td>
      </tr>
    </>
  )
}
