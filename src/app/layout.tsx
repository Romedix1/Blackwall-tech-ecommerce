import type { Metadata } from 'next'
import './globals.css'
import { Roboto_Mono } from 'next/font/google'
import { cn } from '@/lib/utils'
import { CartOverlay } from '@/components/layout'
import { SessionProvider } from 'next-auth/react'
import { Navbar } from '@/components/layout/navbar'
import { AuthWatcher, CookieModal } from '@/components/shared'
import { Footer } from '@/components/layout/footer'

export const metadata: Metadata = {
  title: {
    default: 'Blackwall Tech | PC Store & Hardware',
    template: '%s | Blackwall Tech',
  },
  description:
    'Wysokiej klasy podzespoły komputerowe, systemy chłodzenia i sprzęt dla entuzjastów technologii.',
  keywords: [
    'sklep komputerowy',
    'podzespoły pc',
    'procesory',
    'karty graficzne',
    'gaming',
    'blackwall tech',
  ],
  authors: [{ name: 'Michał Dobosz' }],
  openGraph: {
    title: 'Blackwall Tech | PC Store & Hardware',
    description:
      'Odkryj najwyższej jakości sprzęt i zbuduj swój wymarzony system.',
    url: 'https://blackwall.tech', // UPDATE (VERCEL)
    siteName: 'Blackwall Tech',
    locale: 'en_US',
    type: 'website',
  },
  icons: {
    icon: '/icon.png',
    apple: '/apple-icon.png',
  },
}

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={cn(robotoMono.variable, 'antialiased')}>
        <SessionProvider refetchInterval={30} refetchOnWindowFocus={true}>
          <Navbar />
          <AuthWatcher />
          <CartOverlay />
          <main className="px-4 xl:px-20">{children}</main>
          <Footer />
          <CookieModal />
        </SessionProvider>
      </body>
    </html>
  )
}
