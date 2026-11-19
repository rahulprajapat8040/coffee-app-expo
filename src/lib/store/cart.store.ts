import { create } from "zustand";

interface CartState {
  items: Record<string, number>;

  isInitialized: boolean;

  setCart: (items: Record<string, number>) => void;

  addItem: (productId: string, quantity?: number) => void;

  updateQuantity: (productId: string, quantity: number) => void;

  removeItem: (productId: string) => void;

  clearCart: () => void;

  setInitialized: (value: boolean) => void;
}

export const useCartStore = create<CartState>((set) => ({
  items: {},
  isInitialized: false,

  setCart: (items) => set({ items }),

  addItem: (productId, quantity = 1) =>
    set((state) => ({
      items: {
        ...state.items,
        [productId]: (state.items[productId] ?? 0) + quantity,
      },
    })),

  updateQuantity: (productId, quantity) =>
    set((state) => {
      const items = { ...state.items };

      if (quantity <= 0) {
        delete items[productId];
      } else {
        items[productId] = quantity;
      }

      return { items };
    }),

  removeItem: (productId) =>
    set((state) => {
      const items = { ...state.items };
      delete items[productId];

      return { items };
    }),

  clearCart: () => set({ items: {} }),

  setInitialized: (value) => set({ isInitialized: value }),
}));
