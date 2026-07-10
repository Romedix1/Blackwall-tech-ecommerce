import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { cn } from '@/lib/utils'
import { DirectiveInformationBlock } from '@/app/dashboard/(dashboard)/(fullscreen)/directive/[id]/_components/directive-information-block'
import { BackButton } from '@/app/dashboard/(dashboard)/(fullscreen)/_components/back-button'

type OrderDetailsPageProps = {
  params: Promise<{ id: string }>
}

const statusColorMap: Record<string, string> = {
  failed: 'bg-error-text/10 text-error-text',
  pending: 'bg-warning/10 text-warning',
  paid: 'bg-accent/10 text-accent',
  shipped: 'bg-accent/10 text-accent',
  complete: 'bg-accent/10 text-accent',
}

export default async function OrderDetailsPage({
  params,
}: OrderDetailsPageProps) {
  const resolvedParams = await params
  const orderId = resolvedParams.id

  const session = await auth()
  const user = session?.user

  if (!user || user.role !== 'admin') {
    redirect('/')
    return
  }

  const order = await prisma.order.findFirst({
    where: { id: orderId },
    include: {
      items: true,
      user: true,
    },
  })

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

  const formattedDate = new Intl.DateTimeFormat('en-EN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(order.createdAt))

  const directiveInformationBlockParagraphStyles = 'text-text-second'

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
            statusColorMap[order.status] ||
              'bg-text-disabled/20 text-text-disabled',
          )}
        >
          {order.status}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <DirectiveInformationBlock header="Customer Info">
          <p>
            <span className={cn(directiveInformationBlockParagraphStyles)}>
              Name:
            </span>{' '}
            {order.fullName}
          </p>
          <p>
            <span className={cn(directiveInformationBlockParagraphStyles)}>
              Email:
            </span>{' '}
            {order.email}
          </p>
          <p>
            <span className={cn(directiveInformationBlockParagraphStyles)}>
              Phone:
            </span>{' '}
            {order.phoneNumber}
          </p>
          {order.userId && (
            <p className="text-text-second mt-2 text-xs">
              Registered User ID: <br /> {order.userId}
            </p>
          )}
        </DirectiveInformationBlock>

        <DirectiveInformationBlock header="Shipping Address">
          <p>
            <span className={cn(directiveInformationBlockParagraphStyles)}>
              Address:
            </span>{' '}
            {order.address}
          </p>
          <p>
            <span className={cn(directiveInformationBlockParagraphStyles)}>
              City:
            </span>{' '}
            {order.city}
          </p>
          <p>
            <span className={cn(directiveInformationBlockParagraphStyles)}>
              Zip Code:
            </span>{' '}
            {order.zipCode}
          </p>
        </DirectiveInformationBlock>

        <DirectiveInformationBlock header="Payment & System">
          <p>
            <span className={cn(directiveInformationBlockParagraphStyles)}>
              Total Amount:{' '}
            </span>
            $ {order.totalAmount.toFixed(2)}
          </p>
          <p>
            <span className={cn(directiveInformationBlockParagraphStyles)}>
              Created at:
            </span>{' '}
            {formattedDate}
          </p>
          <p className="truncate">
            <span className={cn(directiveInformationBlockParagraphStyles)}>
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
        </DirectiveInformationBlock>
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
