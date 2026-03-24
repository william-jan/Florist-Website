import { useEffect } from "react"
import { Link, useNavigate } from "react-router"
import { useDispatch, useSelector } from "react-redux"
import Navbar from "../components/Navbar"
import { errorToast, successToast } from "../helpers/toast"
import {
  deleteCartItemAsync,
  fetchCartAsync,
  updateCartItemQtyAsync,
} from "../features/cart/cartSlice"

export default function CartPage() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const accessToken = localStorage.getItem("access_token")
  const { cartItems, loading, error } = useSelector((state) => state.cart)

  async function handleDeleteCartItem(id) {
    try {
      await dispatch(deleteCartItemAsync(id))
      successToast("Cart item deleted successfully")
    } catch (error) {
      console.log(error)

      let message = "Failed to delete cart item"

      if (error.response) {
        message = error.response.data.message
      } else {
        message = error.message
      }

      errorToast(message)
    }
  }

  async function handleIncreaseQty(item) {
    try {
      await dispatch(updateCartItemQtyAsync(item.id, item.qty + 1))
      successToast("Quantity updated successfully")
    } catch (error) {
      console.log(error)

      let message = "Failed to update quantity"

      if (error.response) {
        message = error.response.data.message
      } else {
        message = error.message
      }

      errorToast(message)
    }
  }

  async function handleDecreaseQty(item) {
    try {
      if (item.qty === 1) {
        return
      }

      await dispatch(updateCartItemQtyAsync(item.id, item.qty - 1))
      successToast("Quantity updated successfully")
    } catch (error) {
      console.log(error)

      let message = "Failed to update quantity"

      if (error.response) {
        message = error.response.data.message
      } else {
        message = error.message
      }

      errorToast(message)
    }
  }

  useEffect(() => {
    if (!accessToken) {
      navigate("/login")
      return
    }

    dispatch(fetchCartAsync())
  }, [])

  useEffect(() => {
    if (error) {
      let message = "Failed to fetch cart"

      if (error.response) {
        message = error.response.data.message
      } else if (error.message) {
        message = error.message
      }

      errorToast(message)
    }
  }, [error])

  const totalPrice = cartItems.reduce((total, item) => {
    const price = item.Product?.price || 0
    const qty = item.qty || 1

    return total + price * qty
  }, 0)

  return (
    <div className="min-h-screen bg-pink-50/70">
      <Navbar />

      <section className="mx-auto max-w-6xl px-8 py-10">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-800">Your Cart</h1>
          <Link
            to="/"
            className="rounded-lg border border-pink-600 px-4 py-2 text-pink-600 hover:bg-pink-50"
          >
            Continue Shopping
          </Link>
        </div>

        {loading ? (
          <p className="text-gray-600">Loading...</p>
        ) : cartItems.length === 0 ? (
          <div className="rounded-2xl bg-white p-8 shadow-md">
            <p className="text-gray-600">Your cart is empty</p>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="space-y-4 lg:col-span-2">
              {cartItems.map((item) => {
                const product = item.Product || {}
                const subtotal = (product.price || 0) * (item.qty || 1)

                return (
                  <div
                    key={item.id}
                    className="flex gap-4 rounded-2xl bg-white p-4 shadow-md"
                  >
                    <img
                      src={product.imgUrl}
                      alt={product.name}
                      className="h-28 w-28 rounded-xl object-cover"
                    />

                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <h2 className="text-xl font-semibold text-gray-800">
                          {product.name}
                        </h2>

                        <div className="mt-2 flex items-center gap-3">
                          <button
                            onClick={() => handleDecreaseQty(item)}
                            className="rounded border border-pink-600 px-3 py-1 text-sm text-pink-600 hover:bg-pink-50 disabled:cursor-not-allowed disabled:border-gray-300 disabled:text-gray-300"
                            disabled={item.qty === 1}
                          >
                            -
                          </button>

                          <span className="min-w-6 text-center font-medium text-gray-700">
                            {item.qty}
                          </span>

                          <button
                            onClick={() => handleIncreaseQty(item)}
                            className="rounded border border-pink-600 px-3 py-1 text-sm text-pink-600 hover:bg-pink-50"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div className="flex items-end justify-between">
                        <div>
                          <p className="text-gray-700">
                            Rp {(product.price || 0).toLocaleString("id-ID")}
                          </p>
                          <p className="font-semibold text-pink-600">
                            Subtotal: Rp {subtotal.toLocaleString("id-ID")}
                          </p>
                        </div>

                        <button
                          onClick={() => handleDeleteCartItem(item.id)}
                          className="rounded-lg border border-red-500 px-4 py-2 text-red-500 hover:bg-red-50"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="h-fit rounded-2xl bg-white p-6 shadow-md">
              <h2 className="mb-4 text-2xl font-bold text-gray-800">
                Summary
              </h2>

              <div className="mb-4 flex items-center justify-between text-gray-700">
                <span>Total</span>
                <span className="font-semibold text-pink-600">
                  Rp {totalPrice.toLocaleString("id-ID")}
                </span>
              </div>

              <button
                onClick={() => navigate("/checkout")}
                className="w-full rounded-lg bg-pink-600 px-5 py-3 font-medium text-white hover:bg-pink-700"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}