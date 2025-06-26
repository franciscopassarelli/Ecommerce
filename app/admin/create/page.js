import CreateForm from "@/app/components/admin/CreateForm"

const CreatePage = async () => {
  return (
    <div className="bg-gradient-to-b from-gray-800 to-black min-h-screen flex items-center justify-center px-4">
      <div className="bg-black bg-opacity-40 p-8 rounded-xl shadow-lg w-full max-w-2xl">
        <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-cyan-400 mb-6 text-center">
          Crear Nuevo Producto
        </h1>
        <CreateForm />
      </div>
    </div>
  )
}

export default CreatePage
