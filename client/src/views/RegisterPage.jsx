import axios from "axios"
import { useState } from "react"
import { useNavigate } from "react-router"
import Navbar from "../components/Navbar"
import baseUrl from "../config/baseUrl"
import { successToast, errorToast } from "../helpers/toast"

export default function RegisterPage() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phoneNumber: "",
    address: "",
  })

  function handleChange(event) {
    const { name, value } = event.target

    setForm({
      ...form,
      [name]: value,
    })
  }

  async function handleSubmit(event) {
    try {
      event.preventDefault()

      await axios.post(`${baseUrl}/register`, form)

      successToast(`Registration successful. A verification email has been sent to your primary inbox.
                (If you can’t find it, please check your spam folder)`)
      navigate("/login")
    } catch (error) {
      console.log(error)

      if (error.response) {
        errorToast(error.response.data.message)
      } else {
        errorToast(error.message)
      }
    }
  }

  return (
    <div className="min-h-screen bg-pink-50/70">
      <Navbar />

      <div className="mx-auto flex max-w-md justify-center px-6 py-16">
        <div className="w-full rounded-2xl bg-white p-8 shadow-md">
          <h1 className="mb-2 text-3xl font-bold text-gray-800">Register</h1>
          <p className="mb-6 text-sm text-gray-500">
            Create your Hunnyfloe account
          </p>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-pink-500"
                placeholder="Enter your name"
              />
            </div>

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

            <div className="mb-4">
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

            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="text"
                name="phoneNumber"
                value={form.phoneNumber}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-pink-500"
                placeholder="Enter your phone number"
              />
            </div>

            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Address
              </label>
              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-pink-500"
                placeholder="Enter your address"
                rows="4"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-pink-600 px-4 py-3 font-medium text-white hover:bg-pink-700"
            >
              Register
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}