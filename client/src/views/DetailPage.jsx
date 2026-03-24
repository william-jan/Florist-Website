import axios from "axios"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router"
import { useDispatch } from "react-redux"
import Navbar from "../components/Navbar"
import baseUrl from "../config/baseUrl"
import { errorToast, successToast } from "../helpers/toast"
import { addToCartAsync } from "../features/cart/cartSlice"

export default function DetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)

  const accessToken = localStorage.getItem("access_token")

  async function fetchProductDetail() {
    try {
      setLoading(true)

      const { data } = await axios.get(`${baseUrl}/pub/products/${id}`)

      if (data.data) {
        setProduct(data.data)
      } else {
        setProduct(data)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  async function handleAddToCart() {
    try {
      await dispatch(addToCartAsync(id))
      successToast("Product added to cart")
      navigate("/")
    } catch (error) {
      console.log(error)

      let message = "Failed to add product to cart"

      if (error.response) {
        message = error.response.data.message
      } else {
        message = error.message
      }

      errorToast(message)
    }
  }

  useEffect(() => {
    fetchProductDetail()
  }, [id])

  return (
    <div className="min-h-screen bg-pink-50/70">
      <Navbar />

      <section className="mx-auto max-w-6xl px-8 py-10">
        {loading ? (
          <p className="text-gray-600">Loading...</p>
        ) : !product ? (
          <p className="text-gray-600">Product not found</p>
        ) : (
          <div className="grid grid-cols-1 gap-8 rounded-2xl bg-white p-6 shadow-md md:grid-cols-2">
            <div>
              <img
                src={product.imgUrl}
                alt={product.name}
                className="h-[450px] w-full rounded-2xl object-cover"
              />
            </div>

            <div className="flex flex-col justify-center">
              <p className="mb-2 text-sm font-medium text-pink-600">
                Hunnyfloe Collection
              </p>

              <h1 className="mb-4 text-4xl font-bold text-gray-800">
                {product.name}
              </h1>

              <p className="mb-4 text-2xl font-semibold text-gray-800">
                Rp {product.price?.toLocaleString("id-ID")}
              </p>

              <p className="mb-4 text-gray-600">{product.description}</p>

              <p className="mb-6 text-sm text-gray-500">
                Stock: {product.stock}
              </p>

              {accessToken && (
                <button
                  onClick={handleAddToCart}
                  className="w-fit rounded-lg bg-pink-600 px-5 py-3 font-medium text-white hover:bg-pink-700"
                >
                  Add to Cart
                </button>
              )}
            </div>
          </div>
        )}
      </section>
    </div>
  )
}