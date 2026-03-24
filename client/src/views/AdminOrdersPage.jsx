import axios from "axios"
import { useEffect, useState } from "react"
import Navbar from "../components/Navbar"
import baseUrl from "../config/baseUrl"
import { successToast, errorToast } from "../helpers/toast"

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusLoadingId, setStatusLoadingId] = useState(null)

  const [statusFilter, setStatusFilter] = useState("")
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("")

  const [currentPage, setCurrentPage] = useState(1)
  const [totalPage, setTotalPage] = useState(1)

  function formatText(value) {
    if (!value) return "-"

    return value
      .split("_")
      .map((word) => word[0].toUpperCase() + word.slice(1))
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
    if (status === "done") {
      return "bg-green-100 text-green-700"
    }

    if (status === "processed") {
      return "bg-blue-100 text-blue-700"
    }

    if (status === "in delivery") {
      return "bg-purple-100 text-purple-700"
    }

    if (status === "pending") {
      return "bg-yellow-100 text-yellow-700"
    }

    if (status === "cancelled") {
      return "bg-red-100 text-red-700"
    }

    return "bg-gray-100 text-gray-700"
  }

  async function fetchOrders() {
    try {
      setLoading(true)

      const accessToken = localStorage.getItem("access_token")

      const params = {
        page: currentPage,
        limit: 8,
      }

      if (statusFilter) {
        params.status = statusFilter
      }

      if (paymentStatusFilter) {
        params.paymentStatus = paymentStatusFilter
      }

      const { data } = await axios.get(`${baseUrl}/admin/orders`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params,
      })

      setOrders(data.data || [])
      setTotalPage(data.totalPage || 1)
    } catch (error) {
      console.log(error)

      let message = "Failed to fetch admin orders"

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


  async function handleUpdateStatus(order, status) {
    try {
      if (order.paymentStatus === "pending") {
        errorToast("Cannot change order status while payment status is Pending")
        return
      }

      setStatusLoadingId(order.id)

      const accessToken = localStorage.getItem("access_token")

      await axios.patch(
        `${baseUrl}/admin/orders/${order.id}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )

      successToast("Order status updated successfully")
      fetchOrders()
    } catch (error) {
      console.log(error)

      let message = "Failed to update order status"

      if (error.response) {
        message = error.response.data.message
      } else {
        message = error.message
      }

      errorToast(message)
    } finally {
      setStatusLoadingId(null)
    }
  }


  function getItems(order) {
    if (Array.isArray(order.OrderItems)) {
      return order.OrderItems
    }

    return []
  }

  useEffect(() => {
    fetchOrders()
  }, [currentPage, statusFilter, paymentStatusFilter])

  return (
    <div className="min-h-screen bg-pink-50/70">
      <Navbar />

      <section className="mx-auto max-w-7xl px-8 py-10">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-800">
            Admin Orders Dashboard
          </h1>
          <p className="text-gray-600">
            Monitor all customer orders and update their status
          </p>
        </div>

        <div className="mb-8 rounded-2xl bg-white p-5 shadow-sm">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Filter Payment Status
              </label>
              <select
                value={paymentStatusFilter}
                onChange={(event) => {
                  setCurrentPage(1)
                  setPaymentStatusFilter(event.target.value)
                }}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-pink-500"
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
              </select>
            </div>


            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Filter Order Status
              </label>
              <select
                value={statusFilter}
                onChange={(event) => {
                  setCurrentPage(1)
                  setStatusFilter(event.target.value)
                }}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-pink-500"
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="processed">Processed</option>
                <option value="in delivery">In Delivery</option>
                <option value="done">Done</option>
              </select>
            </div>

          </div>
        </div>

        {loading ? (
          <div className="rounded-2xl bg-white p-8 shadow-sm">
            <p className="text-gray-600">Loading...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="rounded-2xl bg-white p-8 shadow-sm">
            <p className="text-gray-600">No orders found</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const items = getItems(order)

              return (
                <div key={order.id} className="rounded-2xl bg-white p-6 shadow-sm">
                  <div className="mb-5 flex flex-col gap-4 border-b border-pink-100 pb-5 md:flex-row md:items-start md:justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800">
                        Order #{order.id}
                      </h2>
                      <p className="mt-2 text-gray-600">
                        Customer: {order.User?.name || "-"} ({order.User?.email || "-"})
                      </p>
                      <p className="mt-1 text-gray-600">
                        Shipping Address: {order.shippingAddress || "-"}
                      </p>
                      <p className="mt-1 text-gray-600">
                        Total Price: Rp {Number(order.totalPrice || 0).toLocaleString("id-ID")}
                      </p>
                    </div>

                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-3">
                        <span className="w-28 text-sm font-medium text-gray-500">
                          Payment Status
                        </span>
                        <span
                          className={`rounded-full px-3 py-1 text-sm font-semibold ${getPaymentBadgeClass(
                            order.paymentStatus
                          )}`}
                        >
                          {formatText(order.paymentStatus)}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="w-28 text-sm font-medium text-gray-500">
                          Order Status
                        </span>
                        <span
                          className={`rounded-full px-3 py-1 text-sm font-semibold ${getOrderBadgeClass(
                            order.status
                          )}`}
                        >
                          {formatText(order.status)}
                        </span>
                      </div>

                    </div>
                  </div>

                  <div className="mb-5">
                    <h3 className="mb-3 text-lg font-semibold text-gray-800">
                      Order Items
                    </h3>

                    {items.length === 0 ? (
                      <p className="text-sm text-gray-500">No order items found</p>
                    ) : (
                      <div className="space-y-3">
                        {items.map((item, index) => {
                          return (
                            <div
                              key={item.id || index}
                              className="flex items-center justify-between rounded-xl bg-pink-50 p-4"
                            >
                              <div className="flex items-center gap-4">
                                <img
                                  src={item.Product?.imgUrl}
                                  alt={item.Product?.name}
                                  className="h-16 w-16 rounded-xl object-cover"
                                />

                                <div>
                                  <p className="font-semibold text-gray-800">
                                    {item.Product?.name}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    Qty: {item.qty}
                                  </p>
                                </div>
                              </div>

                              <p className="font-semibold text-pink-600">
                                Rp {Number(item.Product?.price || 0).toLocaleString("id-ID")}
                              </p>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>

                  <div>
                    <p className="mb-3 text-sm font-semibold text-gray-700">
                      Switch Order Status:
                    </p>

                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() => handleUpdateStatus(order, "processed")}
                        disabled={statusLoadingId === order.id}
                        className="rounded-xl border border-blue-400 px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-50 disabled:opacity-60"
                      >
                        Processed
                      </button>

                      <button
                        onClick={() => handleUpdateStatus(order, "in delivery")}
                        disabled={statusLoadingId === order.id}
                        className="rounded-xl border border-purple-400 px-4 py-2 text-sm font-medium text-purple-700 hover:bg-purple-50 disabled:opacity-60"
                      >
                        In Delivery
                      </button>

                      <button
                        onClick={() => handleUpdateStatus(order, "done")}
                        disabled={statusLoadingId === order.id}
                        className="rounded-xl border border-green-400 px-4 py-2 text-sm font-medium text-green-700 hover:bg-green-50 disabled:opacity-60"
                      >
                        Done
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="rounded-xl border border-gray-300 px-4 py-2 font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Prev
              </button>

              <span className="rounded-xl bg-white px-4 py-2 font-medium text-gray-700 shadow-sm">
                Page {currentPage} of {totalPage}
              </span>

              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPage}
                className="rounded-xl border border-gray-300 px-4 py-2 font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}
