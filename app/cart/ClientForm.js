import { useState } from "react";
import Boton from "../components/ui/Boton";
import { useRouter } from "next/navigation";
import { useAuthContext } from "../components/context/AuthContext";
import { useCartContext } from "../components/context/CartContext";
import { db } from "../firebase/config";
import { setDoc, doc, Timestamp, getDoc } from "firebase/firestore";

const createOrder = async (values, items) => {
  const order = {
    client: values,
    items: items.map(item => ({
      title: item.title,
      price: item.price,
      slug: item.slug,
      quantity: item.quantity,
    })),
    date: new Date().toISOString(),
  };

  const docId = Timestamp.fromDate(new Date()).toMillis();
  const orderRef = doc(db, "ordenes", String(docId));
  await setDoc(orderRef, order);

  console.log("🧾 Orden creada:", order);
  return docId;
};

const ClientForm = () => {
  const { user } = useAuthContext();
  const { cart, emptyCart, updateStockAfterPurchase } = useCartContext();
  const router = useRouter();

  const [values, setValues] = useState({
    email: user.email,
    direccion: "",
    nombre: user.displayName
  });

  const handleChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };
const handleSubmit = async (e) => {
  e.preventDefault();

  // Validar stock antes de continuar
  for (const item of cart) {
    const productRef = doc(db, "productos", item.slug);
    const productSnap = await getDoc(productRef);
    const currentStock = productSnap.data()?.inStock;

    if (currentStock < item.quantity) {
      alert(`No hay suficiente stock para ${item.title}`);
      return; // Cancelar el proceso
    }
  }

  await createOrder(values, cart);
  await updateStockAfterPurchase();
  emptyCart();
  router.push("/thanks");
};

  return (
    <div className="p-4 md:p-6 bg-gray-100 rounded-lg shadow-md">
      <h1 className="text-2xl">Tus datos:</h1>

      <form onSubmit={handleSubmit} className="my-8">
        <input
          type="text"
          required
          placeholder="Tu nombre"
          className="p-2 rounded w-full md:w-1/2 border border-red-100 block my-4"
          name="nombre"
          onChange={handleChange}
        />

        <input
          type="text"
          required
          placeholder="Tu dirección"
          className="p-2 rounded w-full md:w-1/2 border border-red-100 block my-4"
          name="direccion"
          onChange={handleChange}
        />

        <input
          type="email"
          required
          placeholder="Tu correo electrónico"
          className="p-2 rounded w-full md:w-1/2 border border-red-100 block my-4"
          name="email"
          onChange={handleChange}
        />

        <Boton type="submit">Terminar mi compra</Boton>
      </form>
    </div>
  );
};

export default ClientForm;
