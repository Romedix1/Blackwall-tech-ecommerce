import { BackButton } from '@/app/dashboard/(dashboard)/(fullscreen)/_components/back-button'
import { DashboardInformationBlock } from '@/app/dashboard/(dashboard)/(fullscreen)/_components/dashboard-information-block'
import { cn } from '@/lib/utils'

export default function OperativeDetailsLoading() {
  const dashboardInformationBlockParagraphStyles = 'text-text-second'

  const mockOrders = Array.from({ length: 3 })

  return (
    <div className="text-text-main container mx-auto mt-8 flex flex-col gap-8">
      <BackButton link="/dashboard/operatives" />

      <div className="border-border flex flex-col justify-between gap-4 border-b pb-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold uppercase">
            <span className="skeleton-loading inline-block">
              <span aria-hidden="true" className="opacity-0">
                Operative Profile
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

        <div className="skeleton-loading h-10 w-24" />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <DashboardInformationBlock header="Operative Info">
          <p>
            <span className={cn(dashboardInformationBlockParagraphStyles)}>
              Username:
            </span>{' '}
            <span className="skeleton-loading inline-block">
              <span className="opacity-0">PLACEHOLDER</span>
            </span>
          </p>
          <p>
            <span className={cn(dashboardInformationBlockParagraphStyles)}>
              Email:
            </span>{' '}
            <span className="skeleton-loading inline-block">
              <span className="opacity-0">PLACEHOLDER</span>
            </span>
          </p>
        </DashboardInformationBlock>

        <DashboardInformationBlock header="Shipping Address">
          <p>
            <span className={cn(dashboardInformationBlockParagraphStyles)}>
              Address:
            </span>{' '}
            <span className="skeleton-loading inline-block">
              <span className="opacity-0">PLACEHOLDER</span>
            </span>
          </p>
          <p>
            <span className={cn(dashboardInformationBlockParagraphStyles)}>
              City:
            </span>{' '}
            <span className="skeleton-loading inline-block">
              <span className="opacity-0">PLACEHOLDER</span>
            </span>
          </p>
          <p>
            <span className={cn(dashboardInformationBlockParagraphStyles)}>
              Zip Code:
            </span>{' '}
            <span className="skeleton-loading inline-block">
              <span className="opacity-0">PLACEHOLDER</span>
            </span>
          </p>
        </DashboardInformationBlock>

        <DashboardInformationBlock header="System Activity">
          <p>
            <span className={cn(dashboardInformationBlockParagraphStyles)}>
              Registered:
            </span>{' '}
            <span className="skeleton-loading inline-block">
              <span className="opacity-0">PLACEHOLDER</span>
            </span>
          </p>
          <p>
            <span className={cn(dashboardInformationBlockParagraphStyles)}>
              Last Active:
            </span>{' '}
            <span className="skeleton-loading inline-block">
              <span className="opacity-0">PLACEHOLDER</span>
            </span>
          </p>
        </DashboardInformationBlock>
      </div>

      <div className="mt-4 flex flex-col gap-4">
        <h2 className="border-b pb-2 text-xl font-bold uppercase">
          <span className="skeleton-loading inline-block">
            <span className="opacity-0">Assigned Directives (0)</span>
          </span>
        </h2>
        <div className="overflow-y-auto border">
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
              {mockOrders.map((_, index) => (
                <tr key={`order-skeleton-${index}`} className="border border-t">
                  <td className="p-4 text-sm uppercase">
                    <span className="skeleton-loading inline-block">
                      <span className="opacity-0">PLACEHOLDER</span>
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="skeleton-loading inline-block">
                      <span className="opacity-0">PLACEHOLDER</span>
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="skeleton-loading inline-block">
                      <span className="opacity-0">$ 999.00</span>
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="skeleton-loading h-9 w-24" />
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
