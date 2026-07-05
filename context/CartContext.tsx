"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useCartStore } from "@/store/cartStoretemp";
import { useSession } from "next-auth/react";

const CartContext = createContext<any>(null);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const cartStore = useCartStore();
  const { status } = useSession();
  const [isCartOpen, setIsCartOpen] = useState(false);

  // 🛡️ PREVENT OVERWRITE: Only inject DB cart if it actually has items, otherwise trust Zustand local storage.
  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/cart/sync")
        .then(res => res.json())
        .then(data => {
           if (data.success && data.cart && data.cart.length > 0) {
             cartStore.setCartFromServer(data.cart);
           }
        })
        .catch(err => console.error("Error fetching initial cart", err));
    }
  }, [status]); // Runs once when session authenticates

  const cartTotal = cartStore.items.reduce((total, item) => total + (item.price || 0) * (item.quantity || 1), 0);

  return (
    <CartContext.Provider value={{
      cart: cartStore.items, cartItems: cartStore.items, cartTotal,
      isCartOpen, setIsCartOpen, openCart: () => setIsCartOpen(true), closeCart: () => setIsCartOpen(false),
      addToCart: cartStore.addItem, removeFromCart: cartStore.removeItem, updateQty: cartStore.updateQty, clearCart: cartStore.clearCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);