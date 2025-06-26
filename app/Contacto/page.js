"use client"

import { useState } from "react"
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
  }).then(() => console.log("Producto actualizado correctamente"))
}

const EditForm = ({ item }) => {
  const { slug, title, description, inStock, price, type, image } = item
  const [values, setValues] = useState({ slug, title, description, inStock, price, type, image })
  const [file, setFile] = useState(null)

  const handleChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    await updateProduct(item.slug, values, file)
  }

  return (
    <div className="bg-gradient-to-b from-gray-800 to-black text-white flex justify-center items-center min-h-screen px-4">
      <div className="w-full max-w-2xl bg-black bg-opacity-40 p-8 rounded-xl shadow-lg">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-cyan-400 mb-2">
            Editar producto
          </h2>
          <p className="text-gray-300">Modificá los campos y guardá los cambios</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Slug */}
          <input
            type="text"
            name="slug"
            value={values.slug}
            onChange={handleChange}
            required
            className="w-full rounded-md border border-cyan-500 bg-gray-900 px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            placeholder="Slug del producto"
          />

          {/* Título */}
          <input
            type="text"
            name="title"
            value={values.title}
            onChange={handleChange}
            required
            className="w-full rounded-md border border-cyan-500 bg-gray-900 px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            placeholder="Nombre del producto"
          />

          {/* Imagen previa */}
          {values.image && (
            <img
              src={values.image}
              alt="Vista previa"
              className="w-32 h-32 object-cover rounded mx-auto border border-cyan-500"
            />
          )}

          {/* Input imagen */}
          <input
            type="file"
            name="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="w-full rounded-md border border-blue-400 bg-gray-900 px-4 py-3 text-white cursor-pointer hover:bg-blue-800 hover:border-blue-500 transition"
          />

          {/* Precio */}
          <input
            type="number"
            name="price"
            value={values.price}
            onChange={handleChange}
            required
            className="w-full rounded-md border border-cyan-500 bg-gray-900 px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            placeholder="Precio"
          />

          {/* Stock */}
          <input
            type="number"
            name="inStock"
            value={values.inStock}
            onChange={handleChange}
            required
            className="w-full rounded-md border border-cyan-500 bg-gray-900 px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            placeholder="Stock disponible"
          />

          {/* Categoría */}
          <input
            type="text"
            name="type"
            value={values.type}
            onChange={handleChange}
            required
            className="w-full rounded-md border border-cyan-500 bg-gray-900 px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            placeholder="Categoría"
          />

          {/* Descripción */}
          <textarea
            name="description"
            value={values.description}
            onChange={handleChange}
            rows="4"
            className="w-full rounded-md border border-cyan-500 bg-gray-900 px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            placeholder="Descripción del producto"
          />

          {/* Botón */}
          <div className="flex justify-center">
            <Boton
              type="submit"
              className="w-full max-w-xs rounded-lg bg-gradient-to-r from-yellow-400 to-cyan-500 py-3 px-6 text-sm font-bold uppercase text-black shadow-lg hover:opacity-90 transition-all"
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
