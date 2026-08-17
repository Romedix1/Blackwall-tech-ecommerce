type SectionBlockProps = {
  children: React.ReactNode
}

export const SectionHeader = ({ children }: SectionBlockProps) => {
  return <h2 className="text-accent mb-4 text-xl font-bold">{children}</h2>
}
