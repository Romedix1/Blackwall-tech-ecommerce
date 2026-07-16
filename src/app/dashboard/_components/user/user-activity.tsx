import { auth } from '@/auth'
import { LogOutButton } from '@/components/shared'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'

export const UserActivity = async () => {
  const session = await auth()
  const user = session?.user

  if (!user) {
    redirect('/')
  }

  const userRole = user.role

  const isAdmin = userRole === 'admin'

  const userActivity = await prisma.systemLog.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
    select: { createdAt: true, action: true, id: true },
    take: 3,
  })

  // const getLog = (code: string) => {
  //   const templates: Record<string, string> = {
  //     UPLINK_ESTABLISHED: 'Login successful',
  //     PAYMENT_ACCEPTED: 'Transaction authorized',
  //     SCHEMATIC_SAVED: 'Hardware schematic saved',
  //   }

  //   return templates[code] || 'Unregistered system event'
  // }

  return (
    <div>
      <h3 className="text-text-second mb-4 font-bold 2xl:text-xl">
        <span aria-hidden="true" className="uppercase">
          {'//'} Recent_activity_logs
        </span>
        <span className="sr-only">Recent activity logs</span>
      </h3>
      {userActivity.length > 0 ? (
        <ul className="flex flex-col gap-3">
          {userActivity.map((activity) => {
            return (
              <li
                key={activity.id}
                className="text-text-second text-xs font-bold 2xl:text-sm"
              >
                <span aria-hidden="true">&gt; </span>
                {new Date(activity.createdAt).toLocaleString('en-US', {
                  dateStyle: 'short',
                  timeStyle: 'short',
                })}
                :{' '}
                <span aria-hidden="true" className="text-accent uppercase">
                  {activity.action.replace(/\s+/g, '_')}
                </span>
                <span className="sr-only">{activity.action}</span>
              </li>
            )
          })}
        </ul>
      ) : (
        <p>
          <span aria-hidden="true" className="text-accent/90 uppercase">
            &gt; No_system_activity_detected
          </span>
          <span className="sr-only">No user activity</span>
        </p>
      )}
      <div className="mt-12 lg:hidden">
        <LogOutButton isAdmin={isAdmin} className="px-0 text-sm" />
      </div>
    </div>
  )
}
