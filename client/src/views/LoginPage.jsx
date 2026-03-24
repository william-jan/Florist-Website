import axios from "axios"
import { useEffect, useState } from "react"
import { useSearchParams } from "react-router"
import { useNavigate } from "react-router"
import Navbar from "../components/Navbar"
import baseUrl from "../config/baseUrl"
import { successToast, errorToast } from "../helpers/toast"

const GOOGLE_CLIENT_ID =
  "157341794263-6mskfaikqvchnd8s187ds47cm25tvq2i.apps.googleusercontent.com"

export default function LoginPage() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    email: "",
    password: "",
  })

  function handleChange(event) {
    const { name, value } = event.target

    setForm({
      ...form,
      [name]: value,
    })
  }

  function getRoleFromToken(token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]))
      return payload.role
    } catch (error) {
      return ""
    }
  }

  function redirectByRole(token) {
    const role = getRoleFromToken(token)

    if (role === "admin") {
      navigate("/admin/products")
    } else {
      navigate("/")
    }
  }

  async function handleSubmit(event) {
    try {
      event.preventDefault()

      const { data } = await axios.post(`${baseUrl}/login`, form)

      localStorage.setItem("access_token", data.access_token)

      window.dispatchEvent(new Event("cart-updated"))
      window.dispatchEvent(new Event("orders-updated"))

      successToast("Login successful")
      redirectByRole(data.access_token)
    } catch (error) {
      console.log(error)

      if (error.response) {
        errorToast(error.response.data.message)
      } else {
        errorToast(error.message)
      }
    }
  }

  async function handleGoogleLoginResponse(response) {
    try {
      const { data } = await axios.post(
        `${baseUrl}/google-login`,
        {},
        {
          headers: {
            token: response.credential,
          },
        }
      )

      localStorage.setItem("access_token", data.access_token)

      window.dispatchEvent(new Event("cart-updated"))
      window.dispatchEvent(new Event("orders-updated"))

      successToast("Google login successful")
      redirectByRole(data.access_token)
    } catch (error) {
      console.log(error)

      if (error.response) {
        errorToast(error.response.data.message)
      } else {
        errorToast(error.message)
      }
    }
  }

  useEffect(() => {
    function renderGoogleButton() {
      if (!window.google) {
        return
      }

      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleLoginResponse,
      })

      const googleButton = document.getElementById("googleSignInDiv")

      if (googleButton) {
        googleButton.innerHTML = ""

        window.google.accounts.id.renderButton(googleButton, {
          theme: "outline",
          size: "large",
          text: "signin_with",
          shape: "rectangular",
          width: 320,
        })
      }
    }

    const timeoutId = setTimeout(() => {
      renderGoogleButton()
    }, 300)

    return () => {
      clearTimeout(timeoutId)
    }
  }, [])

  return (
    <div className="min-h-screen bg-pink-50/70">
      <Navbar />

      <div className="mx-auto flex max-w-md justify-center px-6 py-16">
        <div className="w-full rounded-2xl bg-white p-8 shadow-md">
          <h1 className="mb-2 text-3xl font-bold text-gray-800">Login</h1>
          <p className="mb-6 text-sm text-gray-500">
            Welcome back to Hunnyfloe
          </p>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-pink-500"
                placeholder="Enter your email"
              />
            </div>

            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-pink-500"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-pink-600 px-4 py-3 font-medium text-white hover:bg-pink-700"
            >
              Login
            </button>
          </form>

          <div className="my-6 flex items-center">
            <div className="h-px flex-1 bg-gray-200"></div>
            <span className="px-3 text-sm text-gray-400">or</span>
            <div className="h-px flex-1 bg-gray-200"></div>
          </div>

          <div className="flex justify-center">
            <div id="googleSignInDiv"></div>
          </div>
        </div>
      </div>
    </div>
  )
}