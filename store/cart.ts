import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  stock: number;
  qty: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (product: Omit<CartItem, "qty">) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, delta: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) => {
        const existing = get().items.find((i) => i.id === product.id);
        if (existing) {
          get().updateQty(product.id, 1);
          return;
        }
        set((state) => ({
          items: [...state.items, { ...product, qty: 1 }],
        }));
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        }));
      },

      updateQty: (id, delta) => {
        set((state) => ({
          items: state.items
            .map((i) => {
              if (i.id !== id) return i;
              const next = Math.min(Math.max(i.qty + delta, 0), i.stock);
              return { ...i, qty: next };
            })
            .filter((i) => i.qty > 0),
        }));
      },

      clearCart: () => set({ items: [] }),

      totalItems: () => get().items.reduce((s, i) => s + i.qty, 0),

      totalPrice: () => get().items.reduce((s, i) => s + i.price * i.qty, 0),
    }),
    {
      name: "cart-store",
    },
  ),
);
