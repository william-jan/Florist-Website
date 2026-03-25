import axios from "axios"
import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router"
import Navbar from "../components/Navbar"
import baseUrl from "../config/baseUrl"
import { successToast, errorToast } from "../helpers/toast"

export default function AdminProductsPage() {
  const navigate = useNavigate()

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  const [search, setSearch] = useState("")
  const [searchInput, setSearchInput] = useState("")
  const [minPrice, setMinPrice] = useState("")
  const [maxPrice, setMaxPrice] = useState("")

  const [currentPage, setCurrentPage] = useState(1)
  const [totalPage, setTotalPage] = useState(1)

  async function fetchProducts() {
    try {
      setLoading(true)

      const accessToken = localStorage.getItem("access_token")

      const params = {
        page: currentPage,
        limit: 8,
      }

      if (search) {
        params.search = search
      }

      if (minPrice) {
        params.minPrice = minPrice
      }

      if (maxPrice) {
        params.maxPrice = maxPrice
      }

      const { data } = await axios.get(`${baseUrl}/admin/products`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params,
      })

      setProducts(data.data || [])
      setTotalPage(data.totalPage || 1)
    } catch (error) {
      console.log(error)

      let message = "Failed to fetch admin products"

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

  function handleSearch(event) {
    event.preventDefault()
    setCurrentPage(1)
    setSearch(searchInput)
  }

  function handleReset() {
    setSearch("")
    setSearchInput("")
    setMinPrice("")
    setMaxPrice("")
    setCurrentPage(1)
  }

  async function handleDelete(productId) {
    try {
      const accessToken = localStorage.getItem("access_token")

      await axios.delete(`${baseUrl}/admin/products/${productId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      successToast("Product deleted successfully")
      fetchProducts()
    } catch (error) {
      console.log(error)

      let message = "Failed to delete product"

      if (error.response) {
        message = error.response.data.message
      } else {
        message = error.message
      }

      errorToast(message)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [currentPage, search, minPrice, maxPrice])

  return (
    <div className="min-h-screen bg-pink-50/70">
      <Navbar />

      <section className="mx-auto max-w-7xl px-8 py-10">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="mb-2 text-3xl font-bold text-gray-800">
              Admin Products
            </h1>
            <p className="text-gray-600">Manage Hunnyfloe products here</p>
          </div>

          <Link
            to="/admin/products/add"
            className="rounded-xl bg-pink-600 px-5 py-3 font-medium text-white hover:bg-pink-700"
          >
            Add Product
          </Link>
        </div>

        <div className="mb-8 rounded-2xl bg-white p-5 shadow-sm">
          <div className="grid gap-4 md:grid-cols-3">
            <form onSubmit={handleSearch} className="md:col-span-1">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Search Product
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={searchInput}
                  onChange={(event) => setSearchInput(event.target.value)}
                  placeholder="Search product..."
                  className="w-full rounded-xl border border-gray-300 px-4 py-2 outline-none focus:border-pink-500"
                />
                <button
                  type="submit"
                  className="rounded-xl bg-pink-600 px-4 py-2 font-medium text-white hover:bg-pink-700"
                >
                  Search
                </button>
              </div>
            </form>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Min Price
              </label>
              <input
                type="number"
                value={minPrice}
                onChange={(event) => setMinPrice(event.target.value)}
                placeholder="Minimum price"
                className="w-full rounded-xl border border-gray-300 px-4 py-2 outline-none focus:border-pink-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Max Price
              </label>
              <input
                type="number"
                value={maxPrice}
                onChange={(event) => setMaxPrice(event.target.value)}
                placeholder="Maximum price"
                className="w-full rounded-xl border border-gray-300 px-4 py-2 outline-none focus:border-pink-500"
              />
            </div>
          </div>

          <div className="mt-4 flex gap-3">
            <button
              onClick={fetchProducts}
              className="rounded-xl bg-pink-600 px-5 py-2 font-medium text-white hover:bg-pink-700"
            >
              Apply Filter
            </button>

            <button
              onClick={handleReset}
              className="rounded-xl border border-gray-300 px-5 py-2 font-medium text-gray-700 hover:bg-gray-50"
            >
              Reset
            </button>
          </div>
        </div>

        {loading ? (
          <p className="text-gray-600">Loading...</p>
        ) : products.length === 0 ? (
          <p className="text-gray-600">No products found</p>
        ) : (
          <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full table-fixed">
                <thead className="bg-pink-100">
                  <tr>
                    <th className="w-24 px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Image
                    </th>
                    <th className="w-64 px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Name
                    </th>
                    <th className="w-64 px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Category
                    </th>
                    <th className="w-32 px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Price
                    </th>
                    <th className="w-24 px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Stock
                    </th>
                    <th className="w-56 px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {products.map((product) => {
                    return (
                      <tr key={product.id} className="border-t border-gray-200">
                        <td className="px-4 py-3">
                          <img
                            src={product.imgUrl}
                            alt={product.name}
                            className="h-16 w-16 rounded-lg object-cover"
                          />
                        </td>

                        <td className="px-4 py-3 text-sm text-gray-700 align-top">
                          <div className="line-clamp-2 leading-5 min-h-[40px]">
                            {product.name}
                          </div>
                        </td>

                        <td className="px-4 py-3 text-sm text-gray-700 align-top">
                          <div className="line-clamp-2 leading-5 min-h-[40px]">
                            {product.Category?.name}
                          </div>
                        </td>

                        <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap align-top">
                          Rp {product.price?.toLocaleString("id-ID")}
                        </td>

                        <td className="px-4 py-3 whitespace-nowrap align-top">
                          {product.stock}
                        </td>

                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex flex-nowrap gap-2">
                            <button
                              onClick={() => navigate(`/admin/products/edit/${product.id}`)}
                              className="rounded-lg bg-yellow-500 px-3 py-2 text-sm font-medium text-white hover:bg-yellow-600"
                            >
                              Edit
                            </button>

                            <button
                              onClick={() =>
                                navigate(`/admin/products/${product.id}/upload-image`)
                              }
                              className="rounded-lg bg-blue-500 px-3 py-2 text-sm font-medium text-white hover:bg-blue-600"
                            >
                              Update Image
                            </button>

                            <button
                              onClick={() => handleDelete(product.id)}
                              className="rounded-lg bg-red-500 px-3 py-2 text-sm font-medium text-white hover:bg-red-600"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-center gap-3 p-5">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="rounded-xl border border-gray-300 px-4 py-2 font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Prev
              </button>

              <span className="rounded-xl bg-pink-50 px-4 py-2 font-medium text-gray-700">
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
