"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useEffect, useState } from 'react';

export interface CartItem {
  _id?: string;
  id?: string;
  name?: string;
  title?: string;
  price?: number;
  offerPrice?: number;
  quantity?: number;
  qty?: number;
  imageUrl?: string;
  images?: string[];
  brand?: string;
  slug?: string;
  [key: string]: any;
}

interface CartStore {
  items: CartItem[];
  _hasHydrated: boolean;
  setHasHydrated: (val: boolean) => void;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      _hasHydrated: false,

      setHasHydrated: (val: boolean) => set({ _hasHydrated: val }),

      addItem: (item: CartItem) =>
        set((state) => {
          const id = item._id || item.id || item.slug || item.name || '';
          const existing = state.items.find(
            (i) => (i._id || i.id || i.slug || i.name) === id
          );
          if (existing) {
            return {
              items: state.items.map((i) =>
                (i._id || i.id || i.slug || i.name) === id
                  ? { ...i, quantity: (i.quantity || i.qty || 1) + 1 }
                  : i
              ),
            };
          }
          return { items: [...state.items, { ...item, quantity: 1 }] };
        }),

      removeItem: (id: string) =>
        set((state) => ({
          items: state.items.filter(
            (i) => (i._id || i.id || i.slug || i.name) !== id
          ),
        })),

      updateQuantity: (id: string, quantity: number) =>
        set((state) => ({
          items: state.items.map((i) =>
            (i._id || i.id || i.slug || i.name) === id
              ? { ...i, quantity }
              : i
          ),
        })),

      clearCart: () => set({ items: [] }),

      totalItems: () =>
        get().items.reduce((sum, i) => sum + (i.quantity || i.qty || 1), 0),

      totalPrice: () =>
        get().items.reduce(
          (sum, i) => sum + Number(i.offerPrice || i.price || 0) * (i.quantity || i.qty || 1),
          0
        ),
    }),
    {
      name: 'cart-storage',
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);

export function useHydratedCart() {
  const store = useCartStore();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const unsub = useCartStore.persist.onFinishHydration(() => {
      setHydrated(true);
    });
    if (useCartStore.persist.hasHydrated()) {
      setHydrated(true);
    }
    return () => unsub();
  }, []);

  if (!hydrated) {
    return {
      ...store,
      items: [],
      _hasHydrated: false,
      totalItems: () => 0,
      totalPrice: () => 0,
    };
  }

  return { ...store, _hasHydrated: true };
}