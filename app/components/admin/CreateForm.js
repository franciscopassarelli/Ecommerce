"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
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
    await setDoc(docRef, {
      ...values,
      image: fileURL,
      price: Number(values.price),
      inStock: Number(values.inStock),
    })

    return true
  } catch (error) {
    console.error("Error al crear producto:", error)
    return false
  }
}

const CreateForm = () => {
  const router = useRouter()

  const [values, setValues] = useState({
    title: "",
    description: "",
    inStock: 0,
    price: 0,
    type: "",
    slug: "",
  })

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
    const result = await createProduct(values, file)

    if (result) {
      setSuccess(true)
      setTimeout(() => {
        router.push("/admin")
      }, 2000)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-sm">
      {success && (
        <div className="mb-4 text-center text-green-400 font-medium bg-green-900 bg-opacity-30 p-2 rounded transition duration-300 ease-in-out">
          ✅ Producto creado correctamente. Redirigiendo...
        </div>
      )}

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

      <div>
        <label className="block text-gray-300 mb-1">Imagen del producto</label>
        <input
          type="file"
          name="file"
          required
          onChange={(e) => setFile(e.target.files[0])}
          className="w-full rounded-md border border-blue-400 bg-gray-900 px-3 py-2 text-white cursor-pointer hover:bg-blue-800 hover:border-blue-500 transition"
        />
      </div>

      <div>
        <label className="block text-gray-300 mb-1">Precio</label>
        <input
          type="number"
          name="price"
          value={values.price}
          onChange={handleChange}
          required
          className="w-full rounded-md border border-cyan-500 bg-gray-900 px-3 py-2 text-white"
          placeholder="Ej: 15999"
        />
      </div>

      <div>
        <label className="block text-gray-300 mb-1">Stock disponible</label>
        <input
          type="number"
          name="inStock"
          value={values.inStock}
          onChange={handleChange}
          required
          className="w-full rounded-md border border-cyan-500 bg-gray-900 px-3 py-2 text-white"
          placeholder="Ej: 12"
        />
      </div>

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

      <div className="flex justify-center mt-6">
        <Boton
          type="submit"
          className="w-full max-w-xs rounded-lg bg-gradient-to-r from-yellow-400 to-cyan-500 py-2 px-4 text-sm font-bold uppercase text-black shadow-lg hover:opacity-90 transition-all"
        >
          Guardar producto
        </Boton>
      </div>
    </form>
  )
}

export default CreateForm
