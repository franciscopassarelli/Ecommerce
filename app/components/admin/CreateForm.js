"use client"

import { useState } from "react"
import Boton from "../ui/Boton"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { doc, setDoc } from "firebase/firestore"
import { db, storage } from "@/app/firebase/config"

const createProduct = async (values, archivo) => {
  try {
    const storageRef = ref(storage, values.slug)
    const fileSnapshot = await uploadBytes(storageRef, archivo)
    const fileURL = await getDownloadURL(fileSnapshot.ref)

    const docRef = doc(db, "productos", values.slug)
    return setDoc(docRef, {
      ...values,
      image: fileURL,
    }).then(() => console.log("Producto agregado exitosamente"))
  } catch (error) {
    console.log(error)
  }
}

const CreateForm = () => {
  const [values, setValues] = useState({
    title: "",
    description: "",
    inStock: 0,
    price: 0,
    type: "",
    slug: "",
  })

  const [file, setFile] = useState(null)

  const handleChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    await createProduct(values, file)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <input
        type="text"
        name="slug"
        value={values.slug}
        onChange={handleChange}
        required
        className="w-full rounded-md border border-cyan-500 bg-gray-900 px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
        placeholder="Slug del producto"
      />

      <input
        type="text"
        name="title"
        value={values.title}
        onChange={handleChange}
        required
        className="w-full rounded-md border border-cyan-500 bg-gray-900 px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
        placeholder="Nombre del producto"
      />

      <input
        type="file"
        name="file"
        required
        onChange={(e) => setFile(e.target.files[0])}
        className="w-full rounded-md border border-blue-400 bg-gray-900 px-4 py-3 text-white cursor-pointer hover:bg-blue-800 hover:border-blue-500 transition"
      />

      <input
        type="number"
        name="price"
        value={values.price}
        onChange={handleChange}
        required
        className="w-full rounded-md border border-cyan-500 bg-gray-900 px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
        placeholder="Precio"
      />

      <input
        type="number"
        name="inStock"
        value={values.inStock}
        onChange={handleChange}
        required
        className="w-full rounded-md border border-cyan-500 bg-gray-900 px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
        placeholder="Stock disponible"
      />

      <input
        type="text"
        name="type"
        value={values.type}
        onChange={handleChange}
        required
        className="w-full rounded-md border border-cyan-500 bg-gray-900 px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
        placeholder="Categoría"
      />

      <textarea
        name="description"
        value={values.description}
        onChange={handleChange}
        rows="4"
        className="w-full rounded-md border border-cyan-500 bg-gray-900 px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
        placeholder="Descripción del producto"
      />

      <div className="flex justify-center">
        <Boton
          type="submit"
          className="w-full max-w-xs rounded-lg bg-gradient-to-r from-yellow-400 to-cyan-500 py-3 px-6 text-sm font-bold uppercase text-black shadow-lg hover:opacity-90 transition-all"
        >
          Guardar producto
        </Boton>
      </div>
    </form>
  )
}

export default CreateForm
 