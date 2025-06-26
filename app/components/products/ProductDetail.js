import Image from "next/image"
import GoBack from "../ui/GoBack"
import QtySelector from "./QtySelector"

const ProductDetail = async ({ slug }) => {
  const item = await fetch(`${process.env.API_URL}/api/product/${slug}`, {
    cache: "no-store", // 👈 Fuerza datos frescos siempre
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`)
      }
      return res.json()
    })
    .catch((error) => console.error("Fetch error:", error))

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <GoBack />

      <section className="flex flex-col md:flex-row gap-10 mt-8 bg-white p-6 rounded-lg shadow-md border border-gray-200">
        {/* Imagen con etiquetas de stock */}
        <div className="w-full md:w-1/2 flex justify-center relative">
          {/* 🟥 Sin stock */}
          {item.inStock === 0 && (
            <div className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded-tr-md font-semibold text-sm z-10 shadow-lg whitespace-nowrap">
              Sin stock
            </div>
          )}

          {/* 🟨 Última disponible */}
          {item.inStock === 1 && (
            <div className="absolute top-2 right-2 bg-yellow-400 text-black px-3 py-1 rounded-tr-md font-semibold text-sm z-10 shadow-lg whitespace-nowrap">
              ¡Última disponible!
            </div>
          )}

          <Image
            src={item.image}
            alt={item.title}
            width={350}
            height={420}
            className="rounded-lg object-cover"
          />
        </div>

        {/* Información del producto */}
        <div className="w-full md:w-1/2 flex flex-col justify-center">
          <h2 className="text-3xl font-semibold mb-4 text-center md:text-left text-gray-800">
            {item.title}
          </h2>

          <p className="text-2xl font-bold text-red-600 mb-6 text-center md:text-left">
            ${item.price}
          </p>

          <QtySelector item={item} />
        </div>
      </section>

      {/* Descripción del producto */}
      <section className="mt-12 bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-2xl font-semibold text-gray-800 border-b pb-2 mb-4">
          Descripción:
        </h3>
        <p className="text-gray-700 leading-relaxed">{item.description}</p>
      </section>
    </div>
  )
}

export default ProductDetail
