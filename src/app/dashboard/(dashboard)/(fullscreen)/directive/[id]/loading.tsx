import { BackButton } from '@/app/dashboard/(dashboard)/(fullscreen)/_components/back-button'
import { DashboardInformationBlock } from '@/app/dashboard/(dashboard)/(fullscreen)/_components/dashboard-information-block'
import { cn } from '@/lib/utils'

export default function OrderDetailsLoading() {
  const dashboardInformationBlockParagraphStyles = 'text-text-second'

  const mockItems = Array.from({ length: 3 })

  return (
    <div className="text-text-main container mx-auto mt-8 flex flex-col gap-8">
      <BackButton link="/dashboard/directives" />

      <div className="border-border flex flex-col justify-between gap-4 border-b pb-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold uppercase">
            <span className="skeleton-loading inline-block">
              <span aria-hidden="true" className="opacity-0">
                Directive Details
              </span>
            </span>
          </h1>
          <p className="text-text-second mt-2 text-sm">
            <span className="skeleton-loading inline-block">
              <span aria-hidden="true" className="opacity-0">
                ID: cl01234567890abcdefghijklm
              </span>
            </span>
          </p>
        </div>

        <div className="skeleton-loading h-10 w-32" />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <DashboardInformationBlock header="Customer Info">
          <p>
            <span className={cn(dashboardInformationBlockParagraphStyles)}>
              Name:
            </span>{' '}
            <span className="skeleton-loading inline-block">
              <span className="opacity-0">David Martinez</span>
            </span>
          </p>
          <p>
            <span className={cn(dashboardInformationBlockParagraphStyles)}>
              Email:
            </span>{' '}
            <span className="skeleton-loading inline-block">
              <span className="opacity-0">david.m@nightcity.com</span>
            </span>
          </p>
          <p>
            <span className={cn(dashboardInformationBlockParagraphStyles)}>
              Phone:
            </span>{' '}
            <span className="skeleton-loading inline-block">
              <span className="opacity-0">+1 555 019 827</span>
            </span>
          </p>
          <p className="text-text-second mt-2 text-xs">
            Registered User ID: <br />
            <span className="skeleton-loading mt-1 inline-block">
              <span className="opacity-0">usr_123abc456def</span>
            </span>
          </p>
        </DashboardInformationBlock>

        <DashboardInformationBlock header="Shipping Address">
          <p>
            <span className={cn(dashboardInformationBlockParagraphStyles)}>
              Address:
            </span>{' '}
            <span className="skeleton-loading inline-block">
              <span className="opacity-0">H4, Apt 042</span>
            </span>
          </p>
          <p>
            <span className={cn(dashboardInformationBlockParagraphStyles)}>
              City:
            </span>{' '}
            <span className="skeleton-loading inline-block">
              <span className="opacity-0">Night city</span>
            </span>
          </p>
          <p>
            <span className={cn(dashboardInformationBlockParagraphStyles)}>
              Zip Code:
            </span>{' '}
            <span className="skeleton-loading inline-block">
              <span className="opacity-0">NC-990</span>
            </span>
          </p>
        </DashboardInformationBlock>

        <DashboardInformationBlock header="Payment & System">
          <p>
            <span className={cn(dashboardInformationBlockParagraphStyles)}>
              Total Amount:{' '}
            </span>
            <span className="skeleton-loading inline-block">
              <span className="opacity-0">$ 1999.00</span>
            </span>
          </p>
          <p>
            <span className={cn(dashboardInformationBlockParagraphStyles)}>
              Created at:
            </span>{' '}
            <span className="skeleton-loading inline-block">
              <span className="opacity-0">Oct 26, 2023, 2:15 PM</span>
            </span>
          </p>
          <p className="truncate">
            <span className={cn(dashboardInformationBlockParagraphStyles)}>
              Token:
            </span>{' '}
            <span className="skeleton-loading inline-block">
              <span className="opacity-0">ORD-XYZ-9876</span>
            </span>
          </p>
          <p className="text-text-second mt-2 truncate text-xs">
            Stripe Session:{' '}
            <span className="skeleton-loading inline-block">
              <span className="opacity-0">cs_test_a1b2c3d4e5f6g7</span>
            </span>
          </p>
        </DashboardInformationBlock>
      </div>

      <div className="mt-4 flex flex-col gap-4">
        <h2 className="border-b pb-2 text-xl font-bold uppercase">
          <span className="skeleton-loading inline-block">
            <span className="opacity-0">Purchased Items</span>
          </span>
        </h2>
        <div className="bg-background-second overflow-y-auto border">
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
              {mockItems.map((_, index) => (
                <tr
                  key={`item-skeleton-${index}`}
                  className="border-border border-t"
                >
                  <td className="p-4 uppercase">
                    <span className="skeleton-loading inline-block">
                      <span className="opacity-0">PROD-A1B2C3D4</span>
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="skeleton-loading inline-block">
                      <span className="opacity-0">Sandevistan Mk.4</span>
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="skeleton-loading inline-block">
                      <span className="opacity-0">1</span>
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="skeleton-loading inline-block">
                      <span className="opacity-0">$ 999.00</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
