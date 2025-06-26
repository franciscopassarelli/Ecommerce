"use client";
import { useState } from "react";
import Boton from "../ui/Boton";
import Counter from "../ui/Counter";
import { useCartContext } from "../context/CartContext";
import { CheckCircle } from "lucide-react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/config"

function QtySelector({ item }) {
  const { addToCart } = useCartContext();
  const [quantity, setQuantity] = useState(item.inStock === 0 ? 0 : 0);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    setLoading(true);

    try {
      const productRef = doc(db, "productos", item.slug);
      const productSnap = await getDoc(productRef);
      const currentStock = productSnap.data()?.inStock ?? 0;

      if (currentStock === 0 || quantity > currentStock) {
        setShowErrorAlert(true);
        setTimeout(() => setShowErrorAlert(false), 3000);
        return;
      }

      addToCart({ ...item, quantity });
      setShowSuccessAlert(true);
      setTimeout(() => setShowSuccessAlert(false), 3500);
    } catch (error) {
      console.error("Error consultando stock:", error);
      setShowErrorAlert(true);
      setTimeout(() => setShowErrorAlert(false), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-5 mt-6 relative">
      {/* 🛑 Cartel flotante en la esquina superior derecha si no hay stock */}
      {item.inStock === 0 && (
        <div className="absolute top-0 right-0 bg-red-500 text-white px-2 py-1 rounded-bl-md font-semibold text-xs z-10">
          Sin stock
        </div>
      )}

      {/* ⚠️ Cartel informativo en el flujo si no hay stock */}
      {item.inStock === 0 && (
        <div className="bg-red-100 text-red-800 px-3 py-2 rounded font-semibold text-sm text-center">
          Sin stock disponible
        </div>
      )}

      {/* 🔢 Contador */}
      {item.inStock === 0 ? (
        <div className="text-center font-semibold text-gray-500 text-sm">
          Cantidad: 0
        </div>
      ) : (
        <Counter
          max={item.inStock}
          counter={quantity}
          setCounter={setQuantity}
          disabled={item.inStock === 0}
        />
      )}

      {/* 🛒 Botón agregar */}
      <Boton
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded transition duration-300 disabled:opacity-50"
        onClick={handleAdd}
        disabled={item.inStock === 0 || loading}
      >
        {item.inStock === 0 ? "Sin stock" : loading ? "Agregando..." : "Agregar al carrito"}
      </Boton>

      {/* ✅ Éxito */}
      {showSuccessAlert && (
        <div
          role="alert"
          className="absolute top-full mt-3 w-full bg-green-100 border border-green-400 text-green-800 px-4 py-3 rounded-lg shadow"
        >
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span>
              <strong className="font-semibold">¡Éxito!</strong> Artículo agregado al carrito.
            </span>
          </div>
        </div>
      )}

      {/* ❌ Error */}
      {showErrorAlert && (
        <div
          role="alert"
          className="absolute top-full mt-3 w-full bg-red-100 border border-red-400 text-red-800 px-4 py-3 rounded-lg shadow"
        >
          <span>No hay suficiente stock disponible.</span>
        </div>
      )}
    </div>
  );
}

export default QtySelector;
