import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { cn } from '@/lib/utils'
import { DashboardInformationBlock } from '@/app/dashboard/(dashboard)/(fullscreen)/_components/dashboard-information-block'
import { BackButton } from '@/app/dashboard/(dashboard)/(fullscreen)/_components/back-button'
import { OrderStatusColorMap } from '@/app/dashboard/(dashboard)/(fullscreen)/_constants/order-status-color'

type OrderDetailsPageProps = {
  params: Promise<{ id: string }>
}

export default async function OperativeDetailsPage({
  params,
}: OrderDetailsPageProps) {
  const resolvedParams = await params
  const userId = resolvedParams.id

  const session = await auth()
  const user = session?.user

  if (!user || user.role !== 'admin') {
    redirect('/')
    return
  }

  const fetchedUser = await prisma.user.findFirst({
    where: { id: userId },
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
      city: true,
      shippingAddress: true,
      zipCode: true,
      createdAt: true,
      lastActiveAt: true,
      orders: {
        select: {
          id: true,
          orderToken: true,
          fullName: true,
          totalAmount: true,
          status: true,
        },
      },
    },
  })

  if (!fetchedUser) {
    return (
      <div className="container mx-auto mt-8 flex flex-col items-center gap-4">
        <h1 className="text-error-text text-2xl font-bold">
          Operative Not Found
        </h1>
        <p className="text-text-second">This user does not exist</p>
      </div>
    )
  }

  const formattedCreatedAt = new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(fetchedUser.createdAt))

  const formattedLastActiveAt = new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(fetchedUser.lastActiveAt))

  const dashboardInformationBlockParagraphStyles = 'text-text-second'

  return (
    <div className="text-text-main container mx-auto mt-8 flex flex-col gap-8">
      <BackButton link="/dashboard/operatives" />

      <div className="border-border flex flex-col justify-between gap-4 border-b pb-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold uppercase">Operative Profile</h1>
          <p className="text-text-second text-sm">ID: {fetchedUser.id}</p>
        </div>
        <div className="bg-accent/10 text-accent w-fit px-4 py-2 font-bold tracking-wider uppercase">
          {fetchedUser.role}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <DashboardInformationBlock header="Operative Info">
          <p>
            <span className={cn(dashboardInformationBlockParagraphStyles)}>
              Username:
            </span>{' '}
            {fetchedUser.username}
          </p>
          <p>
            <span className={cn(dashboardInformationBlockParagraphStyles)}>
              Email:
            </span>{' '}
            {fetchedUser.email}
          </p>
        </DashboardInformationBlock>

        <DashboardInformationBlock header="Shipping Address">
          <p>
            <span className={cn(dashboardInformationBlockParagraphStyles)}>
              Address:
            </span>{' '}
            {fetchedUser.shippingAddress || '[ UNKNOWN ]'}
          </p>
          <p>
            <span className={cn(dashboardInformationBlockParagraphStyles)}>
              City:
            </span>{' '}
            {fetchedUser.city || '[ UNKNOWN ]'}
          </p>
          <p>
            <span className={cn(dashboardInformationBlockParagraphStyles)}>
              Zip Code:
            </span>{' '}
            {fetchedUser.zipCode || '[ UNKNOWN ]'}
          </p>
        </DashboardInformationBlock>

        <DashboardInformationBlock header="System Activity">
          <p>
            <span className={cn(dashboardInformationBlockParagraphStyles)}>
              Registered:
            </span>{' '}
            {formattedCreatedAt}
          </p>
          <p>
            <span className={cn(dashboardInformationBlockParagraphStyles)}>
              Last Active:
            </span>{' '}
            {formattedLastActiveAt}
          </p>
        </DashboardInformationBlock>
      </div>

      <div className="mt-4 flex flex-col gap-4">
        <h2 className="border-b pb-2 text-xl font-bold uppercase">
          Assigned Directives ({fetchedUser.orders.length})
        </h2>
        <div className="overflow-y-auto border">
          {fetchedUser.orders && fetchedUser.orders.length > 0 ? (
            <table className="w-225 table-fixed overflow-y-auto text-left lg:w-full">
              <thead className="text-text-second">
                <tr>
                  <th className="w-3/12 p-4">Order Token</th>
                  <th className="w-4/12 p-4">Full Name</th>
                  <th className="w-2/12 p-4">Amount</th>
                  <th className="w-3/12 p-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {fetchedUser.orders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-accent/5! border border-t"
                  >
                    <td className="truncate p-4 text-sm uppercase">
                      {order.orderToken}
                    </td>
                    <td className="p-4">{order.fullName}</td>
                    <td className="p-4">$ {order.totalAmount.toFixed(2)}</td>
                    <td
                      className={cn(
                        'w-fit bg-transparent! px-4 py-2 font-bold tracking-wider uppercase',
                        OrderStatusColorMap[order.status] ||
                          'bg-text-disabled/20 text-text-disabled',
                      )}
                    >
                      {order.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-text-second p-6 text-center">
              No directives found for this operative
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
