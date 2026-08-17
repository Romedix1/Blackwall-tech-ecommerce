type SectionBlockProps = {
  children: React.ReactNode
}

export const SectionParagraph = ({ children }: SectionBlockProps) => {
  return <p className="text-sm leading-relaxed font-semibold">{children}</p>
}
