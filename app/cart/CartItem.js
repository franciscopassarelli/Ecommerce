import React, { useState } from "react";
import { useCartContext } from "../components/context/CartContext";
import Image from "next/image";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config"; // Asegurate de que esta ruta sea correcta

const CartItem = ({ item }) => {
  const { addToCart, removeFromCart } = useCartContext();
  const [showError, setShowError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAddToCart = async () => {
    setLoading(true);
    try {
      const productRef = doc(db, "productos", item.slug);
      const productSnap = await getDoc(productRef);
      const currentStock = productSnap.data()?.inStock ?? 0;

      if (currentStock === 0 || item.quantity >= currentStock) {
        setShowError(true);
        setTimeout(() => setShowError(false), 3000);
        return;
      }

      addToCart({ ...item, quantity: 1 }); // Agregamos 1 unidad más
    } catch (error) {
      console.error("Error al verificar stock:", error);
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromCart = () => {
    removeFromCart(item.slug);
  };

  return (
    <div className="container mx-auto my-4 px-4 sm:px-0 py-4 border border-gray-300 rounded relative">
      <div className="grid grid-cols-1 sm:grid-cols-6 gap-4 items-center">
        <div className="sm:col-span-1">
          <Image
            src={item.image}
            alt={item.title}
            width={160}
            height={160}
            className="mx-auto"
          />
        </div>

        <div className="sm:col-span-2 font-medium">{item.title}</div>

        <div className="sm:col-span-1 text-center">
          <span className="text-gray-700">{item.quantity}</span>
          <span className="text-sm text-gray-400 block">
            (Stock: {item.inStock})
          </span>
        </div>

        <div className="sm:col-span-1 text-red-600 font-semibold text-center">
          $ {item.price}
        </div>

        <div className="sm:col-span-1 flex flex-col items-center justify-center">
          {item.inStock === 0 ? (
            <span className="text-red-500 font-semibold">Sin stock</span>
          ) : (
            <>
              <button
                onClick={handleAddToCart}
                className="text-green-500 mb-1 disabled:opacity-50"
                disabled={loading}
              >
                {loading ? "Verificando..." : "Agregar 1 más"}
              </button>
              <button
                onClick={handleRemoveFromCart}
                className="text-blue-500"
              >
                Quitar
              </button>
            </>
          )}
        </div>
      </div>

      {showError && (
        <div className="absolute top-full mt-2 w-full bg-red-100 border border-red-400 text-red-800 px-4 py-2 rounded shadow text-center">
          No hay suficiente stock disponible para agregar más unidades.
        </div>
      )}
    </div>
  );
};

export default CartItem;
