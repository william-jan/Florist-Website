import axios from "axios"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router"
import Navbar from "../components/Navbar"
import baseUrl from "../config/baseUrl"
import { successToast, errorToast } from "../helpers/toast"

export default function AdminProductFormPage() {
  const navigate = useNavigate()
  const { id } = useParams()

  const isEdit = Boolean(id)

  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [imageFile, setImageFile] = useState(null)

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    CategoryId: "",
  })

  async function fetchCategories() {
    try {
      const accessToken = localStorage.getItem("access_token")

      const { data } = await axios.get(`${baseUrl}/admin/categories`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      setCategories(data)
    } catch (error) {
      console.log(error)
    }
  }

  async function fetchProductDetail() {
    try {
      const accessToken = localStorage.getItem("access_token")

      const { data } = await axios.get(`${baseUrl}/admin/products/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      setForm({
        name: data.name || "",
        description: data.description || "",
        price: data.price || "",
        stock: data.stock || "",
        CategoryId: data.CategoryId || "",
      })
    } catch (error) {
      console.log(error)

      let message = "Failed to fetch product detail"

      if (error.response) {
        message = error.response.data.message
      } else {
        message = error.message
      }

      errorToast(message)
    }
  }

  function handleChange(event) {
    const { name, value } = event.target

    setForm({
      ...form,
      [name]: value,
    })
  }

  function handleFileChange(event) {
    setImageFile(event.target.files[0])
  }

  async function handleSubmit(event) {
    try {
      event.preventDefault()

      setLoading(true)

      const accessToken = localStorage.getItem("access_token")

      if (isEdit) {
        await axios.put(`${baseUrl}/admin/products/${id}`, form, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })

        successToast("Product updated successfully")
      } else {
        if (!imageFile) {
          errorToast("Image is required")
          setLoading(false)
          return
        }

        const formData = new FormData()
        formData.append("name", form.name)
        formData.append("description", form.description)
        formData.append("price", form.price)
        formData.append("stock", form.stock)
        formData.append("CategoryId", form.CategoryId)
        formData.append("image", imageFile)

        await axios.post(`${baseUrl}/admin/products`, formData, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })

        successToast("Product created successfully")
      }

      navigate("/admin/products")
    } catch (error) {
      console.log(error)

      let message = isEdit
        ? "Failed to update product"
        : "Failed to create product"

      if (error.response) {
        message = error.response.data.message
      } else {
        message = error.message
      }

      errorToast(message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()

    if (isEdit) {
      fetchProductDetail()
    }
  }, [id])

  return (
    <div className="min-h-screen bg-pink-50/70">
      <Navbar />

      <section className="mx-auto max-w-3xl px-8 py-10">
        <div className="rounded-2xl bg-white p-8 shadow-sm">
          <h1 className="mb-2 text-3xl font-bold text-gray-800">
            {isEdit ? "Edit Product" : "Add Product"}
          </h1>
          <p className="mb-6 text-gray-500">
            {isEdit
              ? "Update your Hunnyfloe product data"
              : "Create a new Hunnyfloe product"}
          </p>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-pink-500"
                placeholder="Enter product name"
              />
            </div>

            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows="4"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-pink-500"
                placeholder="Enter product description"
              ></textarea>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="mb-4">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Price
                </label>
                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-pink-500"
                  placeholder="Enter product price"
                />
              </div>

              <div className="mb-4">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Stock
                </label>
                <input
                  type="number"
                  name="stock"
                  value={form.stock}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-pink-500"
                  placeholder="Enter product stock"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Category
              </label>
              <select
                name="CategoryId"
                value={form.CategoryId}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-pink-500"
              >
                <option value="">Choose category</option>
                {categories.map((category) => {
                  return (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  )
                })}
              </select>
            </div>

            {!isEdit && (
              <div className="mb-6">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Product Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-pink-500"
                />
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="rounded-xl bg-pink-600 px-5 py-3 font-medium text-white hover:bg-pink-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? isEdit
                    ? "Updating..."
                    : "Creating..."
                  : isEdit
                  ? "Update Product"
                  : "Create Product"}
              </button>

              <button
                type="button"
                onClick={() => navigate("/admin/products")}
                className="rounded-xl border border-gray-300 px-5 py-3 font-medium text-gray-700 hover:bg-gray-50"
              >
                Back to Admin Products
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  )
}
