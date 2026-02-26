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
      { text: 'Custom PC Builder', href: '/' },
      { text: 'All Products', href: '/' },
      { text: 'Best Sellers', href: '/' },
    ],
  },
  {
    title: 'Hardware',
    links: [
      { text: 'Processors (CPU)', href: '/' },
      { text: 'Graphics (GPU)', href: '/' },
      { text: 'Motherboards', href: '/' },
      { text: 'Memory (RAM)', href: '/' },
    ],
  },
  {
    title: 'Protocols',
    links: [
      { text: 'Shipping & Delivery', href: '/' },
      { text: 'Returns Policy', href: '/' },
      { text: 'Terms of Service', href: '/' },
      { text: 'Privacy Protocol', href: '/' },
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
