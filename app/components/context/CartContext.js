"use client";
import { createContext, useContext, useState } from "react";
import { updateProductStock } from "@/app/firebase/firebaseHelpers";

const CartContext = createContext();
export const useCartContext = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
const addToCart = (item) => {
  const existingItemIndex = cart.findIndex(cartItem => cartItem.slug === item.slug);

  if (existingItemIndex !== -1) {
    const existingItem = cart[existingItemIndex];
    const newQuantity = existingItem.quantity + item.quantity;

    // Validación de stock disponible
    if (newQuantity > item.inStock) {
      alert("No hay suficiente stock disponible");
      return;
    }

    const updatedCart = [...cart];
    updatedCart[existingItemIndex].quantity = newQuantity;
    setCart(updatedCart);
  } else {
    if (item.quantity > item.inStock) {
      alert("No hay suficiente stock disponible");
      return;
    }

    setCart([...cart, item]);
  }
};


  const removeFromCart = (slug) => {
    const updatedCart = cart.filter((item) => item.slug !== slug);
    setCart(updatedCart);
  };

  const isInCart = (slug) => {
    return cart.some((item) => item.slug === slug);
  };

  const totalQty = () => {
    return cart.reduce((acc, item) => acc + item.quantity, 0);
  };

  const totalPrice = () => {
    return cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  };

  const emptyCart = () => {
    setCart([]);
  };

  // 🔁 Actualizar stock en Firebase después de la compra
  const updateStockAfterPurchase = async () => {
  try {
    console.log("🛒 Actualizando stock para todos los productos del carrito...");
    for (const item of cart) {
      console.log(`📦 Producto: ${item.slug}, cantidad: ${item.quantity}`);
      await updateProductStock(item.slug, item.quantity);
    }
    console.log("✅ Todos los stocks fueron actualizados.");
    emptyCart();
  } catch (error) {
    console.error("❌ Error al actualizar stock después de la compra:", error);
  }
};


  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        isInCart,
        totalQty,
        totalPrice,
        emptyCart,
        updateStockAfterPurchase, // ahora está disponible
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
