import axios from "axios"
import { useState } from "react"
import { useNavigate, useParams } from "react-router"
import Navbar from "../components/Navbar"
import baseUrl from "../config/baseUrl"
import { successToast, errorToast } from "../helpers/toast"

export default function AdminUploadImagePage() {
  const navigate = useNavigate()
  const { id } = useParams()

  const [imageFile, setImageFile] = useState(null)
  const [loading, setLoading] = useState(false)

  function handleFileChange(event) {
    setImageFile(event.target.files[0])
  }

  async function handleSubmit(event) {
    try {
      event.preventDefault()

      if (!imageFile) {
        errorToast("Please choose an image first")
        return
      }

      setLoading(true)

      const accessToken = localStorage.getItem("access_token")

      const formData = new FormData()
      formData.append("image", imageFile)

      await axios.patch(`${baseUrl}/admin/products/${id}/image`, formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      successToast("Image uploaded successfully")
      navigate("/admin/products")
    } catch (error) {
      console.log(error)

      let message = "Failed to upload image"

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

  return (
    <div className="min-h-screen bg-pink-50/70">
      <Navbar />

      <section className="mx-auto max-w-2xl px-8 py-10">
        <div className="rounded-2xl bg-white p-8 shadow-sm">
          <h1 className="mb-2 text-3xl font-bold text-gray-800">
            Upload Product Image
          </h1>
          <p className="mb-6 text-gray-500">
            Update product image for Hunnyfloe catalog
          </p>

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                📤 Image File
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-pink-500"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="rounded-xl bg-pink-600 px-5 py-3 font-medium text-white hover:bg-pink-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Uploading..." : "Upload Image"}
              </button>

              <button
                type="button"
                onClick={() => navigate("/admin/products")}
                className="rounded-xl border border-gray-300 px-5 py-3 font-medium text-gray-700 hover:bg-gray-50"
              >
                Back
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  )
}