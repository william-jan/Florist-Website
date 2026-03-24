import axios from "axios"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router"
import Navbar from "../components/Navbar"
import baseUrl from "../config/baseUrl"
import { errorToast, successToast } from "../helpers/toast"

export default function PaymentPage() {
  const navigate = useNavigate()
  const { id } = useParams()

  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [payLoading, setPayLoading] = useState(false)

  const accessToken = localStorage.getItem("access_token")

  function formatText(value) {
    if (!value) return "-"

    return value
      .split("_")
      .map((word) => {
        return word[0].toUpperCase() + word.slice(1)
      })
      .join(" ")
  }

  function getPaymentBadgeClass(status) {
    if (status === "paid" || status === "settlement" || status === "capture") {
      return "bg-green-100 text-green-700"
    }

    if (status === "pending") {
      return "bg-yellow-100 text-yellow-700"
    }

    if (status === "expire" || status === "cancel" || status === "deny") {
      return "bg-red-100 text-red-700"
    }

    return "bg-gray-100 text-gray-700"
  }

  function getOrderBadgeClass(status) {
    if (status === "completed" || status === "done") {
      return "bg-green-100 text-green-700"
    }

    if (status === "pending" || status === "processed") {
      return "bg-yellow-100 text-yellow-700"
    }

    if (status === "cancelled") {
      return "bg-red-100 text-red-700"
    }

    return "bg-pink-100 text-pink-700"
  }

  async function fetchOrderDetail() {
    try {
      setLoading(true)

      const { data } = await axios.get(`${baseUrl}/orders/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      setOrder(data)
    } catch (error) {
      console.log(error)

      let message = "Failed to fetch order"

      if (error.response) {
        message = error.response.data.message
      } else {
        message = error.message
      }

      errorToast(message)
      navigate("/")
    } finally {
      setLoading(false)
    }
  }

  async function handlePayNow() {
    try {
      setPayLoading(true)

      const { data } = await axios.post(
        `${baseUrl}/orders/${id}/pay`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )

      successToast(data.message || "Payment transaction created successfully")

      if (data.paymentUrl) {
        window.location.href = data.paymentUrl
      }
    } catch (error) {
      console.log(error)

      let message = "Failed to create payment transaction"

      if (error.response) {
        message = error.response.data.message
      } else {
        message = error.message
      }

      errorToast(message)
    } finally {
      setPayLoading(false)
    }
  }

  useEffect(() => {
    if (!accessToken) {
      navigate("/login")
      return
    }

    fetchOrderDetail()
  }, [id, accessToken, navigate])

  if (loading) {
    return (
      <div className="min-h-screen bg-pink-50">
        <Navbar />
        <section className="mx-auto max-w-5xl px-6 py-10">
          <div className="rounded-3xl bg-white p-8 shadow-sm">
            <p className="text-gray-600">Loading...</p>
          </div>
        </section>
      </div>
    )
  }

  if (!order) {
    return null
  }

  const paymentStatus = order.paymentStatus || "pending"
  const isPaid =
    paymentStatus === "paid" ||
    paymentStatus === "settlement" ||
    paymentStatus === "capture"

  return (
    <div className="min-h-screen bg-pink-50/70">
      <Navbar />

      <section className="mx-auto max-w-5xl px-6 py-10">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl bg-white p-8 shadow-sm md:col-span-2">
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-pink-500">
              Hunnyfloe Payment
            </p>

            <h1 className="mb-3 text-3xl font-bold text-gray-800">
              {isPaid ? "Payment Completed" : "Complete Your Payment"}
            </h1>

            <p className="mb-8 text-gray-600">
              {isPaid
                ? "Your payment has been received successfully. You can check the latest order progress on My Orders."
                : "Your order has been created successfully. Please continue your payment to process this order."}
            </p>

            <div className="space-y-4 rounded-2xl bg-pink-50 p-5">
              <div className="flex items-center justify-between gap-4 border-b border-pink-100 pb-4">
                <span className="text-gray-600">Order ID</span>
                <span className="font-semibold text-gray-800">#{order.id}</span>
              </div>

              <div className="flex items-center justify-between gap-4 border-b border-pink-100 pb-4">
                <span className="text-gray-600">Order Status</span>
                <span
                  className={`rounded-full px-3 py-1 text-sm font-semibold ${getOrderBadgeClass(
                    order.status
                  )}`}
                >
                  {formatText(order.status)}
                </span>
              </div>

              <div className="flex items-center justify-between gap-4 border-b border-pink-100 pb-4">
                <span className="text-gray-600">Payment Status</span>
                <span
                  className={`rounded-full px-3 py-1 text-sm font-semibold ${getPaymentBadgeClass(
                    paymentStatus
                  )}`}
                >
                  {formatText(paymentStatus)}
                </span>
              </div>

              <div className="flex items-start justify-between gap-4 border-b border-pink-100 pb-4">
                <span className="text-gray-600">Shipping Address</span>
                <span className="max-w-sm text-right font-medium text-gray-800">
                  {order.shippingAddress}
                </span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <span className="text-gray-600">Total Price</span>
                <span className="text-2xl font-bold text-pink-600">
                  Rp {Number(order.totalPrice || 0).toLocaleString("id-ID")}
                </span>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              {!isPaid && (
                <button
                  onClick={handlePayNow}
                  disabled={payLoading}
                  className="rounded-xl bg-pink-600 px-5 py-3 font-medium text-white transition hover:bg-pink-700 disabled:cursor-not-allowed disabled:bg-pink-300"
                >
                  {payLoading ? "Processing..." : "Pay Now"}
                </button>
              )}

              <button
                onClick={() => navigate("/orders")}
                className="rounded-xl border border-pink-600 px-5 py-3 font-medium text-pink-600 transition hover:bg-pink-50"
              >
                My Orders
              </button>

              <button
                onClick={() => navigate("/")}
                className="rounded-xl border border-gray-300 px-5 py-3 font-medium text-gray-700 transition hover:bg-gray-50"
              >
                Back to Home
              </button>
            </div>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-bold text-gray-800">
              Payment Notes
            </h2>

            <div className="space-y-3 text-sm leading-7 text-gray-600">
              <p>Please complete payment before the transaction expires.</p>
              <p>
                After payment succeeds, your order status will continue to be
                updated by the system.
              </p>
              <p>
                You can revisit this page or open My Orders anytime to check the
                latest payment and order status.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}