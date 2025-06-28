"use client";

import { useParams, useRouter } from "next/navigation";
import { useCartContext } from "@/app/components/context/CartContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/app/firebase/config";
import { useState } from "react";
import {
  CreditCard,
  Truck,
  Building,
  BadgeDollarSign,
  CheckCircle,
} from "lucide-react";

export default function CheckoutPage() {
  const { orderId } = useParams();
  const {
    cart,
    emptyCart,
    updateStockAfterPurchase,
    totalPrice,
  } = useCartContext();
  const router = useRouter();

  const [metodoPago, setMetodoPago] = useState("mercadopago");
  const [envio, setEnvio] = useState("envio");
  const [error, setError] = useState("");
  const [tarjeta, setTarjeta] = useState({
    numero: "",
    nombre: "",
    vencimiento: "",
    cvv: "",
  });

  const costoEnvio = envio === "envio" ? 2500 : 0;
  const subtotal = totalPrice();
  const totalConEnvio = subtotal + costoEnvio;

  const handleSimulatedPayment = async () => {
    setError("");

    if (metodoPago === "tarjeta") {
      const { numero, nombre, vencimiento, cvv } = tarjeta;
      if (!numero || !nombre || !vencimiento || !cvv) {
        setError("Completa todos los campos de la tarjeta.");
        return;
      }
    }

    const orderRef = doc(db, "ordenes", orderId);
    const orderSnap = await getDoc(orderRef);

    if (!orderSnap.exists()) {
      alert("Orden no encontrada");
      return;
    }

    await updateStockAfterPurchase();
    emptyCart();
    router.push("/thanks");
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
        {/* Formulario */}
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-2xl font-bold mb-4">Simulador de Pago</h2>

          {/* Método de envío */}
          <div className="mb-6">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Truck className="w-5 h-5" /> Envío o Retiro
            </h3>
            <label className="flex items-center gap-2 mb-2">
              <input
                type="radio"
                value="envio"
                checked={envio === "envio"}
                onChange={() => setEnvio("envio")}
              />
              Envío a domicilio (+$2500)
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="retiro"
                checked={envio === "retiro"}
                onChange={() => setEnvio("retiro")}
              />
              Retiro en local (gratis)
            </label>
          </div>

          {/* Método de pago */}
          <div className="mb-6">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <BadgeDollarSign className="w-5 h-5" /> Método de Pago
            </h3>
            <div className="flex flex-col gap-3">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="mercadopago"
                  checked={metodoPago === "mercadopago"}
                  onChange={() => setMetodoPago("mercadopago")}
                />
                <span className="flex items-center gap-1 text-blue-600 font-medium">
                  <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded">MP</span> Mercado Pago
                </span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="tarjeta"
                  checked={metodoPago === "tarjeta"}
                  onChange={() => setMetodoPago("tarjeta")}
                />
                <CreditCard className="w-4 h-4 text-purple-600" />
                Tarjeta de Crédito/Débito
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="transferencia"
                  checked={metodoPago === "transferencia"}
                  onChange={() => setMetodoPago("transferencia")}
                />
                <Building className="w-4 h-4 text-green-600" />
                Transferencia Bancaria
              </label>
            </div>
          </div>

          {/* Campos si es tarjeta */}
          {metodoPago === "tarjeta" && (
            <div className="space-y-3 mb-6 bg-blue-50 p-4 rounded">
              <input
                type="text"
                placeholder="Número de tarjeta"
                className="p-2 w-full border rounded"
                value={tarjeta.numero}
                onChange={(e) => setTarjeta({ ...tarjeta, numero: e.target.value })}
              />
              <input
                type="text"
                placeholder="Nombre en la tarjeta"
                className="p-2 w-full border rounded"
                value={tarjeta.nombre}
                onChange={(e) => setTarjeta({ ...tarjeta, nombre: e.target.value })}
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="MM/AA"
                  className="p-2 border rounded"
                  value={tarjeta.vencimiento}
                  onChange={(e) => setTarjeta({ ...tarjeta, vencimiento: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="CVV"
                  className="p-2 border rounded"
                  value={tarjeta.cvv}
                  onChange={(e) => setTarjeta({ ...tarjeta, cvv: e.target.value })}
                />
              </div>
            </div>
          )}

          {/* Mensaje extra según método */}
          {metodoPago === "mercadopago" && (
            <p className="mb-4 text-blue-700 text-sm">Serás redirigido a Mercado Pago (simulado).</p>
          )}
          {metodoPago === "transferencia" && (
            <p className="mb-4 text-green-700 text-sm">Recibirás los datos por email para transferir.</p>
          )}

          {/* Errores */}
          {error && <p className="text-red-600 font-semibold mb-4">{error}</p>}

          <button
            onClick={handleSimulatedPayment}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded font-semibold"
          >
            Confirmar y Pagar
          </button>
        </div>

        {/* Resumen del pedido */}
        <div className="bg-white p-6 rounded shadow h-fit sticky top-20">
          <h3 className="text-lg font-bold mb-4">Resumen del Pedido</h3>
          <ul className="space-y-2 mb-4">
            {cart?.map((item) => (
              <li key={item.slug} className="flex justify-between text-sm">
                <span>{item.title} x{item.quantity}</span>
                <span>${(item.price * item.quantity).toLocaleString()}</span>
              </li>
            ))}
          </ul>
          <hr className="my-3" />
          <div className="text-sm space-y-1">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>${subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Envío:</span>
              <span>{costoEnvio === 0 ? "Gratis" : `$${costoEnvio.toLocaleString()}`}</span>
            </div>
            <div className="flex justify-between font-bold text-purple-700 pt-2">
              <span>Total:</span>
              <span>${totalConEnvio.toLocaleString()}</span>
            </div>
          </div>
          <div className="mt-4 text-green-700 flex items-center gap-2 text-sm">
            <CheckCircle className="w-4 h-4" />
            Compra protegida y segura
          </div>
        </div>
      </div>
    </div>
  );
}
