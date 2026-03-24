import axios from "axios"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import Navbar from "../components/Navbar"
import baseUrl from "../config/baseUrl"
import { errorToast } from "../helpers/toast"

export default function MyOrdersPage() {
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [cancelLoadingId, setCancelLoadingId] = useState(null)
  const [selectedOrderId, setSelectedOrderId] = useState(null)

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

  function getOrderItems(order) {
    if (Array.isArray(order.OrderItems)) {
      return order.OrderItems
    }

    if (Array.isArray(order.orderItems)) {
      return order.orderItems
    }

    if (Array.isArray(order.items)) {
      return order.items
    }

    return []
  }

  function getProductName(item) {
    if (item.Product?.name) return item.Product.name
    if (item.product?.name) return item.product.name
    if (item.name) return item.name

    return "Product"
  }

  function getProductImage(item) {
    if (item.Product?.imgUrl) return item.Product.imgUrl
    if (item.product?.imgUrl) return item.product.imgUrl
    if (item.imgUrl) return item.imgUrl

    return "https://placehold.co/200x200?text=Flower"
  }

  function getProductPrice(item) {
    if (item.Product?.price) return item.Product.price
    if (item.product?.price) return item.product.price
    if (item.price) return item.price

    return 0
  }

  async function fetchOrders() {
    try {
      setLoading(true)

      const { data } = await axios.get(`${baseUrl}/orders`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (Array.isArray(data)) {
        setOrders(data)
      } else {
        setOrders(data.data || [])
      }
    } catch (error) {
      console.log(error)

      let message = "Failed to fetch orders"

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

  async function handleCancelOrder() {
    try {
      setCancelLoadingId(selectedOrderId)

      await axios.delete(`${baseUrl}/orders/${selectedOrderId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      setOrders((prevOrders) => {
        return prevOrders.filter((order) => order.id !== selectedOrderId)
      })

      window.dispatchEvent(new Event("orders-updated"))

      setSelectedOrderId(null)
    } catch (error) {
      console.log(error)

      let message = "Failed to cancel order"

      if (error.response) {
        message = error.response.data.message
      } else {
        message = error.message
      }

      errorToast(message)
    } finally {
      setCancelLoadingId(null)
    }
  }

  function getOrderTitle(orderStatus, paymentStatus) {
    if (orderStatus === "cancelled") {
      return "Order Cancelled"
    }

    if (
      paymentStatus === "paid" ||
      paymentStatus === "settlement" ||
      paymentStatus === "capture"
    ) {
      return "Payment Completed"
    }

    return "Awaiting Payment"
  }

  function getOrderDescription(orderStatus, paymentStatus) {
    if (orderStatus === "cancelled") {
      return "This order has been cancelled and will no longer be processed."
    }

    if (
      paymentStatus === "paid" ||
      paymentStatus === "settlement" ||
      paymentStatus === "capture"
    ) {
      return "Your payment has been completed successfully. You can wait for the next order process."
    }

    return "This order is still waiting for payment completion. Continue your payment to process this order."
  }

  useEffect(() => {
    if (!accessToken) {
      navigate("/login")
      return
    }

    fetchOrders()
  }, [accessToken, navigate])

  return (
    <div className="min-h-screen bg-pink-50/70">
      <Navbar />

      <section className="mx-auto max-w-5xl px-6 py-10">
        <div className="mb-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-pink-500">
            Hunnyfloe Orders
          </p>

          <h1 className="text-3xl font-bold text-gray-800">My Orders</h1>

          <p className="mt-3 max-w-2xl text-gray-600">
            Check all your orders, monitor their payment status, and continue
            payment for any order that is still pending.
          </p>
        </div>

        {loading ? (
          <div className="rounded-3xl bg-white p-8 shadow-sm">
            <p className="text-gray-600">Loading...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
            <h2 className="text-2xl font-bold text-gray-800">No Orders Yet</h2>
            <p className="mt-3 text-gray-600">
              You have not placed any flower orders yet.
            </p>

            <button
              onClick={() => navigate("/")}
              className="mt-6 rounded-xl bg-pink-600 px-5 py-3 font-medium text-white transition hover:bg-pink-700"
            >
              Back to Home
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const paymentStatus = order.paymentStatus || "pending"
              const canCancel = order.status === "pending" && paymentStatus === "pending"
              const isPaid =
                paymentStatus === "paid" ||
                paymentStatus === "settlement" ||
                paymentStatus === "capture"

              const orderTitle = getOrderTitle(order.status, paymentStatus)
              const orderDescription = getOrderDescription(order.status, paymentStatus)
              const items = getOrderItems(order)

              return (
                <div
                  key={order.id}
                  className="rounded-3xl bg-white p-8 shadow-sm"
                >
                  <div className="mb-6 flex flex-col gap-4 border-b border-pink-100 pb-6 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-widest text-pink-500">
                        Order #{order.id}
                      </p>

                      <h2 className="mt-2 text-2xl font-bold text-gray-800">
                        {orderTitle}
                      </h2>

                      <p className="mt-2 text-gray-600">
                        {orderDescription}
                      </p>                    </div>

                    <div className="flex flex-wrap gap-2">
                      <span
                        className={`rounded-full px-3 py-1 text-sm font-semibold ${getOrderBadgeClass(
                          order.status
                        )}`}
                      >
                        {formatText(order.status)}
                      </span>

                      <span
                        className={`rounded-full px-3 py-1 text-sm font-semibold ${getPaymentBadgeClass(
                          paymentStatus
                        )}`}
                      >
                        {formatText(paymentStatus)}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4 rounded-2xl bg-pink-50 p-5">
                    <div className="flex items-center justify-between gap-4 border-b border-pink-100 pb-4">
                      <span className="text-gray-600">Order ID</span>
                      <span className="font-semibold text-gray-800">
                        #{order.id}
                      </span>
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

                  <div className="mt-6">
                    <h3 className="mb-4 text-xl font-bold text-gray-800">
                      Order Items
                    </h3>

                    {items.length === 0 ? (
                      <div className="rounded-2xl border border-dashed border-pink-200 bg-white px-5 py-4 text-sm text-gray-500">
                        Product details are not available yet for this order.
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {items.map((item, index) => {
                          const productName = getProductName(item)
                          const productImage = getProductImage(item)
                          const productPrice = getProductPrice(item)
                          const qty = item.qty || 1
                          const subtotal = productPrice * qty

                          return (
                            <div
                              key={item.id || index}
                              className="flex flex-col gap-4 rounded-2xl border border-pink-100 bg-white p-4 md:flex-row md:items-center md:justify-between"
                            >
                              <div className="flex items-center gap-4">
                                <img
                                  src={productImage}
                                  alt={productName}
                                  className="h-20 w-20 rounded-2xl object-cover"
                                />

                                <div>
                                  <h4 className="text-lg font-semibold text-gray-800">
                                    {productName}
                                  </h4>
                                  <p className="mt-1 text-sm text-gray-500">
                                    Qty: {qty}
                                  </p>
                                  <p className="mt-1 text-sm text-gray-500">
                                    Price: Rp{" "}
                                    {Number(productPrice).toLocaleString("id-ID")}
                                  </p>
                                </div>
                              </div>

                              <div className="text-right">
                                <p className="text-sm text-gray-500">Subtotal</p>
                                <p className="text-lg font-bold text-pink-600">
                                  Rp {Number(subtotal).toLocaleString("id-ID")}
                                </p>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>

                  <div className="mt-8 flex flex-wrap justify-center gap-15">
                    <button
                      onClick={() => navigate(`/payment/${order.id}`)}
                      className="rounded-xl border border-pink-600 px-5 py-3 font-medium text-pink-600 transition hover:bg-pink-50"
                    >
                      View Details
                    </button>

                    {!isPaid && order.status !== "cancelled" && (
                      <button
                        onClick={() => navigate(`/payment/${order.id}`)}
                        className="rounded-xl bg-pink-600 px-5 py-3 font-medium text-white transition hover:bg-pink-700"
                      >
                        Continue Payment
                      </button>
                    )}

                    {canCancel && (
                      <button
                        onClick={() => setSelectedOrderId(order.id)}
                        disabled={cancelLoadingId === order.id}
                        className="rounded-xl border border-red-400 px-5 py-3 font-medium text-red-500 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {cancelLoadingId === order.id ? "Cancelling..." : "Cancel Order"}
                      </button>)}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>
      {selectedOrderId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
          <div className="w-full flex-col max-w-md rounded-3xl bg-white p-6 shadow-xl justify-items-center">
            <h2 className="text-2xl font-bold text-gray-800">
              Cancel this order?
            </h2>

            <p className="mt-5 leading-7 text-gray-600">
              Are you sure you want to cancel this order?
            </p>

            <p className="leading-7 text-gray-600">
              (Cancelled order will be removed from the list)
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                onClick={handleCancelOrder}
                disabled={cancelLoadingId !== null}
                className="rounded-xl bg-red-500 px-5 py-3 font-medium text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {cancelLoadingId !== null ? "Cancelling..." : "Yes, Cancel"}
              </button>

              <button
                onClick={() => setSelectedOrderId(null)}
                disabled={cancelLoadingId !== null}
                className="rounded-xl bg-slate-50 border border-gray-300 px-5 py-3 font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                No, Keep Order
              </button>


            </div>
          </div>
        </div>
      )}
    </div>


  )
}