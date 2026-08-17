export default function PoliciesLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="container mx-auto mt-16 max-w-6xl px-4 lg:mb-24">
      {children}
    </div>
  )
}
