type SectionBlockProps = {
  children: React.ReactNode
}

export const SectionBlock = ({ children }: SectionBlockProps) => {
  return <section className="bg-surface border p-6">{children}</section>
}
