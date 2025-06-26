"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Boton from "../ui/Boton"
import { db, storage } from "@/app/firebase/config"
import { doc, updateDoc } from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"

const updateProduct = async (slug, values, file) => {
  let fileURL = values.image

  if (file) {
    const storageRef = ref(storage, values.slug)
    const fileSnapshot = await uploadBytes(storageRef, file)
    fileURL = await getDownloadURL(fileSnapshot.ref)
  }

  const docRef = doc(db, "productos", slug)
  return updateDoc(docRef, {
    title: values.title,
    description: values.description,
    inStock: Number(values.inStock),
    price: Number(values.price),
    type: values.type,
    image: fileURL,
  })
}

const EditForm = ({ item }) => {
  const router = useRouter()
  const { slug, title, description, inStock, price, type, image } = item
  const [values, setValues] = useState({ slug, title, description, inStock, price, type, image })
  const [file, setFile] = useState(null)
  const [success, setSuccess] = useState(false)

  const handleChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await updateProduct(item.slug, values, file)
      setSuccess(true)
      setTimeout(() => {
        router.push("/admin") // Redirección después de 2 segundos
      }, 2000)
    } catch (error) {
      console.error("Error al actualizar producto:", error)
    }
  }

  return (
    <div className="bg-gradient-to-b from-gray-800 to-black text-white flex justify-center items-center min-h-screen px-4">
      <div className="w-full max-w-lg bg-black bg-opacity-40 p-6 rounded-xl shadow-lg">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-cyan-400 mb-2">
            Editar producto
          </h2>
          <p className="text-sm text-gray-300">Modificá los campos necesarios</p>
        </div>
{success && (
  <div className="mb-4 text-center text-green-400 font-medium bg-green-900 bg-opacity-30 p-2 rounded transition duration-300 ease-in-out">
    ✅ Producto actualizado correctamente. Redirigiendo...
  </div>
)}

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          {/* Slug */}
          <div>
            <label className="block text-gray-300 mb-1">Slug</label>
            <input
              type="text"
              name="slug"
              value={values.slug}
              onChange={handleChange}
              required
              className="w-full rounded-md border border-cyan-500 bg-gray-900 px-3 py-2 text-white"
              placeholder="Ej: zapatillas-nike-air"
            />
          </div>

          {/* Título */}
          <div>
            <label className="block text-gray-300 mb-1">Nombre del producto</label>
            <input
              type="text"
              name="title"
              value={values.title}
              onChange={handleChange}
              required
              className="w-full rounded-md border border-cyan-500 bg-gray-900 px-3 py-2 text-white"
            />
          </div>

          {/* Imagen previa */}
          {values.image && (
            <div>
              <label className="block text-gray-300 mb-1">Imagen actual</label>
              <img
                src={values.image}
                alt="Vista previa"
                className="w-24 h-24 object-cover rounded mb-2 border border-cyan-500"
              />
            </div>
          )}

          {/* Nueva imagen */}
          <div>
            <label className="block text-gray-300 mb-1">Cambiar imagen</label>
            <input
              type="file"
              name="file"
              onChange={(e) => setFile(e.target.files[0])}
              className="w-full rounded-md border border-blue-400 bg-gray-900 px-3 py-2 text-white cursor-pointer hover:bg-blue-800 hover:border-blue-500 transition"
            />
          </div>

          {/* Precio */}
          <div>
            <label className="block text-gray-300 mb-1">Precio</label>
            <input
              type="number"
              name="price"
              value={values.price}
              onChange={handleChange}
              required
              className="w-full rounded-md border border-cyan-500 bg-gray-900 px-3 py-2 text-white"
            />
          </div>

          {/* Stock */}
          <div>
            <label className="block text-gray-300 mb-1">Stock</label>
            <input
              type="number"
              name="inStock"
              value={values.inStock}
              onChange={handleChange}
              required
              className="w-full rounded-md border border-cyan-500 bg-gray-900 px-3 py-2 text-white"
            />
          </div>

          {/* Tipo */}
          <div>
            <label className="block text-gray-300 mb-1">Categoría</label>
            <input
              type="text"
              name="type"
              value={values.type}
              onChange={handleChange}
              required
              className="w-full rounded-md border border-cyan-500 bg-gray-900 px-3 py-2 text-white"
            />
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-gray-300 mb-1">Descripción</label>
            <textarea
              name="description"
              value={values.description}
              onChange={handleChange}
              rows="3"
              className="w-full rounded-md border border-cyan-500 bg-gray-900 px-3 py-2 text-white"
              placeholder="Descripción breve del producto"
            />
          </div>

          {/* Botón */}
          <div className="flex justify-center mt-6">
            <Boton
              type="submit"
              className="w-full max-w-xs rounded-lg bg-gradient-to-r from-yellow-400 to-cyan-500 py-2 px-4 text-sm font-bold uppercase text-black shadow-lg hover:opacity-90 transition-all"
            >
              Guardar cambios
            </Boton>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditForm
