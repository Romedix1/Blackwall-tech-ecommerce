type FooterLink = {
  text: string
  href?: string
  value?: string
}

type FooterSection = {
  title: string
  links: FooterLink[]
}

export const FOOTER_DATA: FooterSection[] = [
  {
    title: 'System nav',
    links: [
      { text: 'Homepage', href: '/' },
      { text: 'All Products', href: '/products' },
      { text: 'Best Sellers', href: '/#best-sellers' },
    ],
  },
  {
    title: 'Hardware',
    links: [
      { text: 'Processors (CPU)', href: '/products/cpu' },
      { text: 'Graphics (GPU)', href: '/products/gpu' },
      { text: 'Motherboards', href: '/products/motherboards' },
      { text: 'Memory (RAM)', href: '/products/memory' },
    ],
  },
  {
    title: 'Protocols',
    links: [
      { text: 'Shipping & Delivery', href: '/shipping' },
      { text: 'Returns Policy', href: '/returns' },
      { text: 'Terms of Service', href: '/terms-of-service' },
      { text: 'Privacy Protocol', href: '/privacy' },
    ],
  },
  {
    title: 'Server info',
    links: [
      { text: 'Status', value: 'ONLINE' },
      { text: 'Uptime', value: '99.9%' },
      { text: 'Location', value: 'EU_EAST' },
      {
        text: 'Support',
        value: 'doboszmichal4@gmail.com',
        href: 'mailto:doboszmichal4@gmail.com',
      },
    ],
  },
]
