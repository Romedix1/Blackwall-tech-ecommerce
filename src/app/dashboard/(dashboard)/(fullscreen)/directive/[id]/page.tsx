import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { cn } from '@/lib/utils'
import { BackButton } from '@/app/dashboard/(dashboard)/(fullscreen)/_components/back-button'
import { DashboardInformationBlock } from '@/app/dashboard/(dashboard)/(fullscreen)/_components/dashboard-information-block'
import { OrderStatusColorMap } from '@/app/dashboard/(dashboard)/(fullscreen)/_constants/order-status-color'
import { mockedDetailedOrdersList } from '@/app/dashboard/_components/admin/records-mocks'

type OrderDetailsPageProps = {
  params: Promise<{ id: string }>
}

export default async function OrderDetailsPage({
  params,
}: OrderDetailsPageProps) {
  const resolvedParams = await params
  const orderId = resolvedParams.id

  const session = await auth()
  const user = session?.user

  if (!user || !['admin', 'demoAdmin'].includes(user.role)) {
    redirect('/')
    return
  }

  const isDemo = user.role === 'demoAdmin'

  let order = null

  if (isDemo) {
    order = mockedDetailedOrdersList.find((order) => order.id === orderId)
  } else {
    order = await prisma.order.findFirst({
      where: { id: orderId },
      select: {
        id: true,
        createdAt: true,
        status: true,
        fullName: true,
        email: true,
        phoneNumber: true,
        userId: true,
        address: true,
        city: true,
        zipCode: true,
        orderToken: true,
        stripeSessionId: true,
        totalAmount: true,
        items: {
          select: {
            id: true,
            name: true,
            quantity: true,
            price: true,
          },
        },
      },
    })
  }

  if (!order) {
    return (
      <div className="container mx-auto mt-8 flex flex-col items-center gap-4">
        <h1 className="text-error-text text-2xl font-bold">
          Directive Not Found
        </h1>
        <p className="text-text-second">This order does not exist</p>
      </div>
    )
  }

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(order.createdAt))

  const dashboardInformationBlockParagraphStyles = 'text-text-second'

  return (
    <div className="text-text-main container mx-auto mt-8 flex flex-col gap-8">
      <BackButton link="/dashboard/directives" />

      <div className="border-border flex flex-col justify-between gap-4 border-b pb-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold uppercase">Directive Details</h1>
          <p className="text-text-second text-sm">ID: {order.id}</p>
        </div>
        <div
          className={cn(
            'w-fit px-4 py-2 font-bold tracking-wider uppercase',
            OrderStatusColorMap[order.status] ||
              'bg-text-disabled/20 text-text-disabled',
          )}
        >
          {order.status}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <DashboardInformationBlock header="Customer Info">
          <p>
            <span className={cn(dashboardInformationBlockParagraphStyles)}>
              Name:
            </span>{' '}
            {order.fullName}
          </p>
          <p>
            <span className={cn(dashboardInformationBlockParagraphStyles)}>
              Email:
            </span>{' '}
            {order.email}
          </p>
          <p>
            <span className={cn(dashboardInformationBlockParagraphStyles)}>
              Phone:
            </span>{' '}
            {order.phoneNumber}
          </p>
          {order.userId && (
            <p className="text-text-second mt-2 text-xs">
              Registered User ID: <br /> {order.userId}
            </p>
          )}
        </DashboardInformationBlock>

        <DashboardInformationBlock header="Shipping Address">
          <p>
            <span className={cn(dashboardInformationBlockParagraphStyles)}>
              Address:
            </span>{' '}
            {order.address}
          </p>
          <p>
            <span className={cn(dashboardInformationBlockParagraphStyles)}>
              City:
            </span>{' '}
            {order.city}
          </p>
          <p>
            <span className={cn(dashboardInformationBlockParagraphStyles)}>
              Zip Code:
            </span>{' '}
            {order.zipCode}
          </p>
        </DashboardInformationBlock>

        <DashboardInformationBlock header="Payment & System">
          <p>
            <span className={cn(dashboardInformationBlockParagraphStyles)}>
              Total Amount:{' '}
            </span>
            $ {order.totalAmount.toFixed(2)}
          </p>
          <p>
            <span className={cn(dashboardInformationBlockParagraphStyles)}>
              Created at:
            </span>{' '}
            {formattedDate}
          </p>
          <p className="truncate">
            <span className={cn(dashboardInformationBlockParagraphStyles)}>
              Token:
            </span>{' '}
            {order.orderToken}
          </p>
          {order.stripeSessionId ? (
            <p className="text-text-second mt-2 truncate text-xs">
              Stripe Session: {order.stripeSessionId}
            </p>
          ) : (
            <p className="text-warning mt-2 text-xs uppercase">
              No Stripe session attached
            </p>
          )}
        </DashboardInformationBlock>
      </div>

      <div className="mt-4 flex flex-col gap-4">
        <h2 className="border-b pb-2 text-xl font-bold uppercase">
          Purchased Items
        </h2>
        <div className="bg-background-second overflow-y-auto border">
          {order.items && order.items.length > 0 ? (
            <table className="w-225 table-fixed overflow-y-auto text-left lg:w-full">
              <thead className="text-text-second">
                <tr>
                  <th className="w-4/12 p-4 font-normal">Product ID</th>
                  <th className="w-4/12 p-4 font-normal">Name</th>
                  <th className="w-2/12 p-4 font-normal">Quantity</th>
                  <th className="w-2/12 p-4 font-normal">Unit Price</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => (
                  <tr key={item.id} className="border-border border-t">
                    <td className="truncate p-4 uppercase">{item.id}</td>
                    <td className="p-4">{item.name}</td>
                    <td className="p-4">{item.quantity}</td>
                    <td className="p-4">$ {item.price.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-text-second p-6 text-center">
              No items found for this directive.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
