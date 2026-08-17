type SectionBlockProps = {
  children: React.ReactNode
}

export const PageHeader = ({ children }: SectionBlockProps) => {
  return (
    <h2 className="text-accent text-2xl font-bold uppercase lg:text-4xl">
      {children}
    </h2>
  )
}
