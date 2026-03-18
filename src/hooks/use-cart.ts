import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type CartItem = {
  slug: string
  name: string
  price: number
  quantity: number
  imgSrc: string
}

type CartStore = {
  items: CartItem[]
  isOpen: boolean
  toggle: () => void
  addItem: (
    slug: string,
    name: string,
    price: number,
    quantity: number,
    imgSrc: string,
    isLoggedIn?: boolean,
  ) => Promise<void>
  updateQuantity: (slug: string, quantity: number) => void
  removeItem: (slug: string) => void
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      toggle: () =>
        set((state) => ({
          isOpen: !state.isOpen,
        })),
      addItem: async (
        slug,
        name,
        price,
        quantity,
        imgSrc,
        isLoggedIn = false,
      ) => {
        const currentItems = get().items
        const existingItem = currentItems.find((item) => item.slug === slug)

        if (existingItem) {
          set({
            items: currentItems.map((item) =>
              item.slug === slug
                ? { ...item, quantity: item.quantity + quantity }
                : item,
            ),
          })
        } else {
          set({
            items: [...currentItems, { slug, name, price, quantity, imgSrc }],
          })
        }

        if (isLoggedIn) {
          try {
          } catch {}
        }
      },
      updateQuantity: (slug: string, quantity: number) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.slug === slug
              ? { ...item, quantity: Math.max(1, quantity) }
              : item,
          ),
        }))
      },
      removeItem: (slug: string) => {
        set((state) => ({
          items: state.items.filter((item) => item.slug !== slug),
        }))
      },
    }),
    {
      name: 'cart',
      partialize: (state) => ({ items: state.items }),
    },
  ),
)
