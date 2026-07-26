import { SettingsHeader } from '@/app/dashboard/(dashboard)/(main)/settings/_components/settings-header'
import { SettingsSection } from '@/app/dashboard/(dashboard)/(main)/settings/_components/settings-section'

export const ActiveSessionsSkeleton = () => {
  return (
    <SettingsSection>
      <SettingsHeader>
        <span aria-hidden="true">[ Active_uplinks ]</span>
        <span className="sr-only">Active uplinks</span>
      </SettingsHeader>

      <div className="skeleton-loading p-3 text-xs">
        <div className="mb-2 flex items-start justify-between">
          <div className="font-bold opacity-0">Current_session</div>
          <div className="opacity-0">192.168.0.1</div>
        </div>
        <p className="uppercase opacity-0">CHROME V100 / WINDOWS 11</p>
        <p className="mt-1 opacity-0">&gt; Uplink_Location: Poland, Gdansk</p>
      </div>

      <div className="my-3 text-sm font-bold opacity-0">Other_sessions</div>

      <div className="flex flex-col gap-4">
        <div className="skeleton-loading h-16.5 w-full" />
      </div>
    </SettingsSection>
  )
}
