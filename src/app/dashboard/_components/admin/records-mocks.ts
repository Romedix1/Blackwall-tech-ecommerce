import { OrderType, UsersType } from '@/app/dashboard/_components/admin/types'

// /directives list
export const mockedOrdersList: OrderType[] = [
  {
    id: 'ord_101',
    fullName: 'Adam Jensen',
    totalAmount: 1450.5,
    city: 'Night City',
    status: 'pending',
  },
  {
    id: 'ord_102',
    fullName: 'Sarah Connor',
    totalAmount: 899.99,
    city: 'Los Angeles',
    status: 'paid',
  },
  {
    id: 'ord_103',
    fullName: 'David Martinez',
    totalAmount: 250.0,
    city: 'Santo Domingo',
    status: 'failed',
  },
  {
    id: 'ord_104',
    fullName: 'Motoko Kusanagi',
    totalAmount: 5400.0,
    city: 'Neo Tokyo',
    status: 'paid',
  },
]

// /directives/[id] details
export type MockedDetailedOrderType = {
  id: string
  createdAt: Date
  status: string
  fullName: string
  email: string
  phoneNumber: string
  userId: string | null
  address: string
  city: string
  zipCode: string
  orderToken: string
  stripeSessionId: string | null
  totalAmount: number
  items: {
    id: string
    name: string
    quantity: number
    price: number
  }[]
}

export const mockedDetailedOrdersList: MockedDetailedOrderType[] = [
  {
    id: 'ord_101',
    createdAt: new Date('2026-08-01T08:30:00Z'),
    status: 'pending',
    fullName: 'Adam Jensen',
    email: 'adam.jensen@sarif-industries.com',
    phoneNumber: '+1-555-019-827',
    userId: 'usr_001',
    address: 'Sector 4, Neon Street 12',
    city: 'Night City',
    zipCode: 'NC-90210',
    orderToken: 'TRX-8821-A',
    stripeSessionId: 'cs_test_a1b2c3d4',
    totalAmount: 1450.5,
    items: [
      {
        id: 'item_001',
        name: 'Neural Link V2.0',
        quantity: 1,
        price: 1000.0,
      },
      {
        id: 'item_002',
        name: 'Synthetic Coolant',
        quantity: 1,
        price: 450.5,
      },
    ],
  },
  {
    id: 'ord_102',
    createdAt: new Date('2026-07-31T14:15:00Z'),
    status: 'paid',
    fullName: 'Sarah Connor',
    email: 's.connor@resistance.net',
    phoneNumber: '+1-555-992-111',
    userId: null,
    address: 'Bunker 4, Desert Road',
    city: 'Los Angeles',
    zipCode: 'LA-0001',
    orderToken: 'TRX-9941-B',
    stripeSessionId: 'cs_test_x9y8z7',
    totalAmount: 899.99,
    items: [
      {
        id: 'item_003',
        name: 'EMP Grenade Pack',
        quantity: 1,
        price: 899.99,
      },
    ],
  },
  {
    id: 'ord_103',
    createdAt: new Date('2026-08-01T09:45:00Z'),
    status: 'failed',
    fullName: 'David Martinez',
    email: 'david.m@edgerunners.com',
    phoneNumber: '+1-555-776-332',
    userId: 'usr_003',
    address: 'Megabuilding H4, Apt 40',
    city: 'Santo Domingo',
    zipCode: 'SD-4421',
    orderToken: 'TRX-5555-F',
    stripeSessionId: null,
    totalAmount: 250.0,
    items: [
      {
        id: 'item_004',
        name: 'Kiroshi Optics - Basic',
        quantity: 1,
        price: 250.0,
      },
    ],
  },
  {
    id: 'ord_104',
    createdAt: new Date('2026-07-25T11:20:00Z'),
    status: 'paid',
    fullName: 'Motoko Kusanagi',
    email: 'major@section9.gov',
    phoneNumber: '+81-555-333-999',
    userId: 'usr_004',
    address: 'Section 9 HQ, Cyber District',
    city: 'Neo Tokyo',
    zipCode: 'NT-1004',
    orderToken: 'TRX-7777-M',
    stripeSessionId: 'cs_test_m0t0k0',
    totalAmount: 5400.0,
    items: [
      {
        id: 'item_005',
        name: 'Thermoptic Camouflage Suit',
        quantity: 1,
        price: 5000.0,
      },
      {
        id: 'item_006',
        name: 'Ammunition Box (Heavy)',
        quantity: 4,
        price: 100.0,
      },
    ],
  },
]

// /operatives list
export const mockedUsersList: UsersType[] = [
  {
    id: 'usr_001',
    username: 'NeonGhost',
    email: 'operative.one@blackwall.com',
    city: 'Night City',
  },
  {
    id: 'usr_002',
    username: 'Cipher',
    email: 'cipher@unknown-net.org',
    city: 'Neo Tokyo',
  },
  {
    id: 'usr_003',
    username: 'Glitch',
    email: 'glitch.test@demo-net.com',
    city: null,
  },
  {
    id: 'usr_004',
    username: 'spec',
    email: 'spectre@blackwall.com',
    city: 'Los Angeles',
  },
  {
    id: 'usr_005',
    username: 'NetRunner99',
    email: 'runner99@grid.net',
    city: 'Detroit',
  },
]

// /operatives/[id] details
export type MockedFetchedUserType = {
  id: string
  username: string | null
  email: string
  role: string
  city: string | null
  shippingAddress: string | null
  zipCode: string | null
  createdAt: Date
  lastActiveAt: Date
  orders: {
    id: string
    orderToken: string
    fullName: string
    totalAmount: number
    status: string
  }[]
}

export const mockedDetailedUsersList: MockedFetchedUserType[] = [
  {
    id: 'usr_001',
    username: 'NeonGhost',
    email: 'operative.one@blackwall.com',
    role: 'admin',
    city: 'Night City',
    shippingAddress: 'Sector 4, Neon Street 12',
    zipCode: 'NC-90210',
    createdAt: new Date('2025-10-12T08:00:00Z'),
    lastActiveAt: new Date('2026-08-01T15:30:00Z'),
    orders: [
      {
        id: 'ord_101',
        orderToken: 'TRX-8821-A',
        fullName: 'NeonGhost',
        totalAmount: 1450.5,
        status: 'paid',
      },
    ],
  },
  {
    id: 'usr_002',
    username: 'Cipher',
    email: 'cipher@unknown-net.org',
    role: 'user',
    city: 'Neo Tokyo',
    shippingAddress: 'Level 13, Block B',
    zipCode: 'NT-1004',
    createdAt: new Date('2026-01-05T12:22:00Z'),
    lastActiveAt: new Date('2026-07-28T09:15:00Z'),
    orders: [
      {
        id: 'ord_102',
        orderToken: 'TRX-7711-X',
        fullName: 'Cipher',
        totalAmount: 8900.0,
        status: 'pending',
      },
    ],
  },
  {
    id: 'usr_003',
    username: 'Glitch',
    email: 'glitch.test@demo-net.com',
    role: 'demoAdmin',
    city: null,
    shippingAddress: null,
    zipCode: null,
    createdAt: new Date('2026-05-20T18:45:00Z'),
    lastActiveAt: new Date('2026-08-01T10:05:00Z'),
    orders: [],
  },
  {
    id: 'usr_004',
    username: 'spec',
    email: 'spectre@blackwall.com',
    role: 'user',
    city: 'Los Angeles',
    shippingAddress: 'Corporate Plaza 1',
    zipCode: 'LA-9921',
    createdAt: new Date('2026-07-10T11:00:00Z'),
    lastActiveAt: new Date('2026-08-01T19:20:00Z'),
    orders: [
      {
        id: 'ord_104',
        orderToken: 'TRX-9999-Z',
        fullName: 'Spec',
        totalAmount: 150.0,
        status: 'failed',
      },
    ],
  },
  {
    id: 'usr_005',
    username: 'NetRunner99',
    email: 'runner99@grid.net',
    role: 'user',
    city: 'Detroit',
    shippingAddress: 'Underground Grid, Hub 4',
    zipCode: 'DT-404',
    createdAt: new Date('2026-02-14T09:00:00Z'),
    lastActiveAt: new Date('2026-08-02T14:45:00Z'),
    orders: [
      {
        id: 'ord_105',
        orderToken: 'TRX-4040-D',
        fullName: 'NetRunner99',
        totalAmount: 3200.0,
        status: 'paid',
      },
      {
        id: 'ord_106',
        orderToken: 'TRX-4041-D',
        fullName: 'NetRunner99',
        totalAmount: 50.0,
        status: 'pending',
      },
    ],
  },
]

// /dasboard/logs
export type MockedSystemLog = {
  id: string
  action: string
  createdAt: Date
  details: string
  user: {
    username: string
  } | null
}

export const mockedLogsList: MockedSystemLog[] = [
  {
    id: 'log_001',
    action: 'User logged in (OAuth)',
    createdAt: new Date('2026-08-01T16:00:13.000Z'),
    details: 'User logged in via google: neon.ghost@blackwall.com',
    user: { username: 'NeonGhost' },
  },
  {
    id: 'log_002',
    action: 'User logged out',
    createdAt: new Date('2026-08-01T16:00:01.000Z'),
    details: 'User logged out: neon.ghost@blackwall.com',
    user: { username: 'NeonGhost' },
  },
  {
    id: 'log_003',
    action: 'User logged in (OAuth)',
    createdAt: new Date('2026-08-01T15:59:07.000Z'),
    details: 'User logged in via github: cipher@underground.net',
    user: { username: 'Cipher' },
  },
  {
    id: 'log_004',
    action: 'User logged out',
    createdAt: new Date('2026-08-01T15:59:12.000Z'),
    details: 'User logged out: cipher@underground.net',
    user: { username: 'Cipher' },
  },
  {
    id: 'log_005',
    action: 'User logged out',
    createdAt: new Date('2026-07-30T12:17:47.000Z'),
    details: 'User logged out: demo@blackwall.com',
    user: { username: 'DemoAdmin' },
  },
  {
    id: 'log_006',
    action: 'User sign up',
    createdAt: new Date('2026-07-30T12:15:37.000Z'),
    details: 'Successfully signed up user: demo@blackwall.com',
    user: { username: 'DemoAdmin' },
  },
  {
    id: 'log_007',
    action: 'Order paid',
    createdAt: new Date('2026-07-29T21:22:07.000Z'),
    details: 'Payment successfully verified for order ord_205',
    user: { username: 'Motoko' },
  },
  {
    id: 'log_008',
    action: 'Order initiated',
    createdAt: new Date('2026-07-29T21:22:02.000Z'),
    details: 'Checkout initiated for order ord_205 (316 USD) by Motoko',
    user: { username: 'Motoko' },
  },
  {
    id: 'log_009',
    action: 'Order initiated',
    createdAt: new Date('2026-07-29T21:21:56.000Z'),
    details: 'Checkout initiated for order ord_999 (2227 USD) by Guest',
    user: null,
  },
  {
    id: 'log_010',
    action: 'Order paid',
    createdAt: new Date('2026-07-29T21:20:20.000Z'),
    details: 'Payment successfully verified for order ord_101',
    user: { username: 'NetRunner_V' },
  },
  {
    id: 'log_011',
    action: 'Order initiated',
    createdAt: new Date('2026-07-29T21:20:16.000Z'),
    details: 'Checkout initiated for order ord_101 (316 USD) by NetRunner_V',
    user: { username: 'NetRunner_V' },
  },
  {
    id: 'log_012',
    action: 'Order initiated',
    createdAt: new Date('2026-07-29T21:16:52.000Z'),
    details: 'Checkout initiated for order ord_888 (2227 USD) by Guest',
    user: null,
  },
  {
    id: 'log_013',
    action: 'User logged in',
    createdAt: new Date('2026-07-29T21:00:16.000Z'),
    details: 'Successfully logged in user: adam.jensen@sarif.com',
    user: { username: 'Adam_Jensen' },
  },
]
