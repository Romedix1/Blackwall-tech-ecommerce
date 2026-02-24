export const MobileSessionInfo = () => {
  return (
    <div className="mt-2 flex flex-col gap-3 px-2">
      <span className="text-text-second text-sm uppercase">
        {'// Active session'}
      </span>
      <span>
        <span className="text-accent mr-2 uppercase">Auth:</span>
        admin@blackwall.com
      </span>
      <span>
        <span aria-hidden="true">
          <span className="text-accent uppercase">&gt; clearance:</span>{' '}
          {'[ USER ]'}
        </span>
        <span className="sr-only">clearance: USER</span>
      </span>
    </div>
  )
}
