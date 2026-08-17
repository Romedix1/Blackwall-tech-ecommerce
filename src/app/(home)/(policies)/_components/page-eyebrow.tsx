type SectionBlockProps = {
  children: React.ReactNode
}

export const PageEyebrow = ({ children }: SectionBlockProps) => {
  return <p className="text-text-second text-sm lg:text-base">{children}</p>
}
