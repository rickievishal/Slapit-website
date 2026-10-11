import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem } from '../types';

interface BagState {
  items: CartItem[];
  isOpen: boolean;
  justAdded: boolean;
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, size: string) => void;
  updateQuantity: (productId: string, size: string, quantity: number) => void;
  clearBag: () => void;
  toggleBag: () => void;
  openBag: () => void;
  closeBag: () => void;
  setJustAdded: (val: boolean) => void;
  getSubtotal: () => number;
  getItemCount: () => number;
}

export const useBagStore = create<BagState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      justAdded: false,

      addItem: (newItem: CartItem) => {
        set((state) => {
          const existingIndex = state.items.findIndex(
            (item) => item.productId === newItem.productId && item.size === newItem.size
          );

          if (existingIndex > -1) {
            const updated = [...state.items];
            updated[existingIndex].quantity += newItem.quantity;
            return { items: updated, isOpen: true, justAdded: true };
          }

          return { items: [...state.items, newItem], isOpen: true, justAdded: true };
        });

        // Reset justAdded toast trigger after 2 seconds
        setTimeout(() => {
          set({ justAdded: false });
        }, 2200);
      },

      removeItem: (productId: string, size: string) => {
        set((state) => ({
          items: state.items.filter(
            (item) => !(item.productId === productId && item.size === size)
          ),
        }));
      },

      updateQuantity: (productId: string, size: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(productId, size);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.productId === productId && item.size === size
              ? { ...item, quantity: Math.min(10, quantity) }
              : item
          ),
        }));
      },

      clearBag: () => set({ items: [] }),

      toggleBag: () => set((state) => ({ isOpen: !state.isOpen })),
      openBag: () => set({ isOpen: true }),
      closeBag: () => set({ isOpen: false }),

      setJustAdded: (val: boolean) => set({ justAdded: val }),

      getSubtotal: () => {
        return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      },

      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: 'slapit-bag',
      partialize: (state) => ({ items: state.items }),
    }
  )
);
