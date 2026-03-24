import axios from "axios"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router"
import Navbar from "../components/Navbar"
import baseUrl from "../config/baseUrl"
import { errorToast, successToast } from "../helpers/toast"
import { fetchCartAsync } from "../features/cart/cartSlice"

export default function CheckoutPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [shippingAddress, setShippingAddress] = useState("")
  const [checkoutLoading, setCheckoutLoading] = useState(false)

  const accessToken = localStorage.getItem("access_token")
  const { cartItems, loading, error } = useSelector((state) => state.cart)

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

  async function handleCheckout(event) {
    try {
      event.preventDefault()
      setCheckoutLoading(true)

      const { data } = await axios.post(
        `${baseUrl}/carts/checkout`,
        {
          shippingAddress,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )

      successToast(data.message || "Checkout successful")
      dispatch(fetchCartAsync())

      navigate(`/payment/${data.orderId}`)
    } catch (error) {
      console.log(error)

      let message = "Checkout failed"

      if (error.response) {
        message = error.response.data.message
      } else {
        message = error.message
      }

      errorToast(message)
    } finally {
      setCheckoutLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-pink-50/70">
      <Navbar />

      <section className="mx-auto max-w-6xl px-8 py-10">
        <h1 className="mb-8 text-3xl font-bold text-gray-800">Checkout</h1>

        {loading ? (
          <p className="text-gray-600">Loading...</p>
        ) : cartItems.length === 0 ? (
          <div className="rounded-2xl bg-white p-8 shadow-md">
            <p className="text-gray-600">Your cart is empty</p>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-3">
            <form
              onSubmit={handleCheckout}
              className="rounded-2xl bg-white p-6 shadow-md lg:col-span-2"
            >
              <h2 className="mb-4 text-2xl font-bold text-gray-800">
                Shipping Address
              </h2>

              <textarea
                value={shippingAddress}
                onChange={(event) => setShippingAddress(event.target.value)}
                placeholder="Enter your shipping address"
                className="min-h-40 w-full rounded-xl border border-gray-300 p-4 outline-none focus:border-pink-500"
              />

              <button
                type="submit"
                disabled={checkoutLoading}
                className="mt-6 rounded-lg bg-pink-600 px-5 py-3 font-medium text-white hover:bg-pink-700 disabled:cursor-not-allowed disabled:bg-pink-300"
              >
                {checkoutLoading ? "Processing..." : "Place Order"}
              </button>
            </form>

            <div className="h-fit rounded-2xl bg-white p-6 shadow-md">
              <h2 className="mb-4 text-2xl font-bold text-gray-800">
                Order Summary
              </h2>

              <div className="mb-4 space-y-3">
                {cartItems.map((item) => {
                  const product = item.Product || {}
                  const subtotal = (product.price || 0) * (item.qty || 1)

                  return (
                    <div
                      key={item.id}
                      className="border-b border-gray-100 pb-3 last:border-b-0"
                    >
                      <p className="font-medium text-gray-800">{product.name}</p>
                      <p className="text-sm text-gray-500">
                        {item.qty} x Rp {(product.price || 0).toLocaleString("id-ID")}
                      </p>
                      <p className="text-sm font-semibold text-pink-600">
                        Rp {subtotal.toLocaleString("id-ID")}
                      </p>
                    </div>
                  )
                })}
              </div>

              <div className="flex items-center justify-between border-t border-gray-200 pt-4 text-gray-800">
                <span className="font-medium">Total</span>
                <span className="text-lg font-bold text-pink-600">
                  Rp {totalPrice.toLocaleString("id-ID")}
                </span>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}