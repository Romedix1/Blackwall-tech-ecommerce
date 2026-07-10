export type InventoryProductType = {
  id: string
  name: string
  category: { slug: string }
  quantity: number
  price: number
}

export type OrderType = {
  id: string
  fullName: string
  totalAmount: number
  city: string
  status: string
}
