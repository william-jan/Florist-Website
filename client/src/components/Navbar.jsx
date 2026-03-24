import axios from "axios"
import { Link, useNavigate } from "react-router"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { successToast } from "../helpers/toast"
import { fetchCartAsync } from "../features/cart/cartSlice"
import baseUrl from "../config/baseUrl"

export default function Navbar() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const access_token = localStorage.getItem("access_token")

  const { cartItems } = useSelector((state) => state.cart)
  const [pendingOrdersCount, setPendingOrdersCount] = useState(0)
  const [showLogoutModal, setShowLogoutModal] = useState(false)

  function getRoleFromToken(token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]))
      return payload.role
    } catch (error) {
      return ""
    }
  }

  const userRole = access_token ? getRoleFromToken(access_token) : ""

  function confirmLogout() {
    localStorage.clear()
    setShowLogoutModal(false)
    successToast("Logout successful")
    navigate("/")
  }

  async function fetchPendingOrders() {
    try {
      const { data } = await axios.get(`${baseUrl}/orders`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })

      let orders = []

      if (Array.isArray(data)) {
        orders = data
      } else {
        orders = data.data || []
      }

      const totalPendingOrders = orders.filter((order) => {
        return order.status === "pending" && order.paymentStatus === "pending"
      }).length

      setPendingOrdersCount(totalPendingOrders)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (!access_token) {
      return
    }

    if (userRole === "customer") {
      dispatch(fetchCartAsync())
      fetchPendingOrders()

      function handleOrdersUpdated() {
        fetchPendingOrders()
      }

      function handleCartUpdated() {
        dispatch(fetchCartAsync())
      }

      window.addEventListener("orders-updated", handleOrdersUpdated)
      window.addEventListener("cart-updated", handleCartUpdated)

      return () => {
        window.removeEventListener("orders-updated", handleOrdersUpdated)
        window.removeEventListener("cart-updated", handleCartUpdated)
      }
    }
  }, [access_token, userRole])

  const cartCount = cartItems.reduce((total, item) => {
    return total + item.qty
  }, 0)

  const navButtonClass =
    "rounded-xl bg-pink-50 px-4 py-2 text-sm font-medium text-pink-700 transition hover:bg-pink-100 hover:text-pink-800"

  const logoutButtonClass =
    "rounded-xl bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-200 hover:text-gray-900"

  return (
    <>
      <nav className="flex items-center justify-between border-b border-pink-100 bg-white px-8 py-4 shadow-sm">
        <Link
          to={userRole === "admin" ? "/admin/products" : "/"}
          className="text-2xl font-bold tracking-tight text-pink-600"
        >
          Hunnyfloe
        </Link>

        <div className="flex items-center gap-3">
          {!access_token ? (
            <>
              <Link to="/" className={navButtonClass}>
                Home
              </Link>

              <Link to="/login" className={navButtonClass}>
                Login
              </Link>

              <Link to="/register" className={navButtonClass}>
                Register
              </Link>
            </>
          ) : userRole === "admin" ? (
            <>
              <Link to="/admin/products" className={navButtonClass}>
                Admin Products
              </Link>

              <Link to="/admin/orders" className={navButtonClass}>
                Admin Orders
              </Link>

              <Link to="/admin/products/add" className={navButtonClass}>
                Add Product
              </Link>

              <a
                href="/"
                target="_blank"
                rel="noreferrer"
                className={navButtonClass}
              >
                View Customer Page
              </a>

              <button
                onClick={() => setShowLogoutModal(true)}
                className={logoutButtonClass}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/" className={navButtonClass}>
                Home
              </Link>

              <Link to="/orders" className={`relative ${navButtonClass}`}>
                My Orders
                {pendingOrdersCount > 0 && (
                  <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
                    {pendingOrdersCount}
                  </span>
                )}
              </Link>

              <Link to="/cart" className={`relative ${navButtonClass}`}>
                Cart
                {cartCount > 0 && (
                  <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
                    {cartCount}
                  </span>
                )}
              </Link>

              <button
                onClick={() => setShowLogoutModal(true)}
                className={logoutButtonClass}
              >
                Logout
              </button>
            </>
          )}
        </div>
      </nav>

      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl">
            <h2 className="text-2xl font-bold text-gray-800">
              Are you sure to logout?
            </h2>

            <p className="mt-4 text-gray-600">
              You will be signed out from your Hunnyfloe account.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                onClick={confirmLogout}
                className="rounded-xl bg-red-500 px-5 py-3 font-medium text-white transition hover:bg-red-600"
              >
                Yes, Logout
              </button>

              <button
                onClick={() => setShowLogoutModal(false)}
                className="rounded-xl border border-gray-300 bg-white px-5 py-3 font-medium text-gray-700 transition hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}