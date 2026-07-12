import { ReactNode } from 'react'

type DashboardInformationBlockProps = {
  children: ReactNode
  header: string
}

export const DashboardInformationBlock = ({
  children,
  header,
}: DashboardInformationBlockProps) => {
  return (
    <div className="border-border bg-surface/50 flex flex-col gap-4 border p-6">
      <h2 className="text-accent text-lg font-bold uppercase">{header}</h2>
      <div className="flex flex-col gap-2 text-sm">{children}</div>
    </div>
  )
}
