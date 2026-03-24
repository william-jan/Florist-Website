import axios from "axios"
import { Link } from "react-router"
import { useState } from "react"
import baseUrl from "../config/baseUrl"
import { successToast, errorToast } from "../helpers/toast"

export default function ProductCard({ product, reason }) {
  const [loading, setLoading] = useState(false)
  const accessToken = localStorage.getItem("access_token")

  async function handleAddToCart() {
    try {
      if (!accessToken) {
        errorToast("Please login first")
        return
      }

      setLoading(true)

      const { data } = await axios.post(
        `${baseUrl}/carts/${product.id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )

      successToast(data.message || "Product added to cart successfully")
      window.dispatchEvent(new Event("cart-updated"))
    } catch (error) {
      console.log(error)

      let message = "Failed to add product to cart"

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
    <div className="group overflow-hidden rounded-[30px] border border-pink-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="relative overflow-hidden bg-gradient-to-b from-rose-50 to-white">
        <img
          src={product.imgUrl}
          alt={product.name}
          className="h-72 w-full object-cover transition duration-500 group-hover:scale-[1.03]"
        />

        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-white/70 to-transparent"></div>
      </div>

      <div className="flex min-h-[250px] flex-col px-5 pb-5 pt-4">
        <div className="mb-4">
          <h2
            className="line-clamp-2 text-[22px] leading-snug text-gray-800"
            style={{ fontFamily: '"Cormorant Garamond", serif', fontWeight: 700 }}
          >
            {product.name}
          </h2>

          <p className="mt-3 text-3xl font-semibold tracking-tight text-pink-600">
            Rp {product.price?.toLocaleString("id-ID")}
          </p>

          <div className="mt-3 inline-flex items-center rounded-full bg-pink-50 px-3 py-1 text-xs font-medium text-pink-700">
            Stock: {product.stock}
          </div>
        </div>

        {reason && (
          <div className="mb-4 rounded-2xl border border-pink-100 bg-gradient-to-r from-rose-50 to-pink-50 p-4">
            <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-pink-500">
              AI Recommendation
            </p>
            <p className="text-sm leading-6 text-gray-700">{reason}</p>
          </div>
        )}

        <div className="mt-auto flex gap-3">
          <Link
            to={`/products/${product.id}`}
            className="flex-1 rounded-xl bg-pink-600 px-4 py-3 text-center text-sm font-medium text-white transition hover:bg-pink-700"
          >
            See Detail
          </Link>

          <button
            onClick={handleAddToCart}
            disabled={loading}
            className="flex-1 rounded-xl border border-pink-300 bg-white px-4 py-3 text-sm font-medium text-pink-600 transition hover:bg-pink-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Adding..." : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  )
}