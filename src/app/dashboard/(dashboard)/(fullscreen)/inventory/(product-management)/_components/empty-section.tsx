type EmptySectionProps = {
  section: 'technical' | 'specification' | 'performance'
}

export const EmptySection = ({ section }: EmptySectionProps) => {
  return (
    <div className="border-accent/30 bg-warning/10 text-accent flex w-full flex-col gap-4 px-3 py-6 text-center">
      <span className="tracking-widest">
        <span aria-hidden="true">[ AWAITING_INPUT ]</span>
        <span className="sr-only">Empty section</span>
      </span>
      <p className="text-sm opacity-80">
        No{' '}
        {section === 'specification'
          ? `general ${section}`
          : `${section} specifications`}{' '}
        found
      </p>
    </div>
  )
}
