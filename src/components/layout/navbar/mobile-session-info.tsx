import { useSession } from 'next-auth/react'

export const MobileSessionInfo = () => {
  const { data: session } = useSession()

  if (!session) return null

  return (
    <div className="mt-2 flex flex-col gap-3 px-2">
      <span className="text-text-second text-sm uppercase">
        {'// Active session'}
      </span>
      <span>
        <span className="text-accent mr-2 uppercase">Auth:</span>
        {session.user.email}
      </span>
      <span>
        <span aria-hidden="true" className="uppercase">
          <span className="text-accent">&gt; clearance:</span>{' '}
          {`[ ${session.user.role} ]`}
        </span>
        <span className="sr-only">clearance: {session.user.role}</span>
      </span>
    </div>
  )
}
