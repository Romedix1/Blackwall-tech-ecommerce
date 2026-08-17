import { ReactNode } from 'react'

type SettingsSectionProps = {
  children: ReactNode
}

export const SettingsSection = ({ children }: SettingsSectionProps) => {
  return (
    <section className="bg-surface relative max-h-70 overflow-y-scroll border p-4 lg:p-6">
      {children}
    </section>
  )
}
