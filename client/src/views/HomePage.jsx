import axios from "axios"
import { useEffect, useMemo, useState } from "react"
import Navbar from "../components/Navbar"
import ProductCard from "../components/ProductCard"
import baseUrl from "../config/baseUrl"
import { errorToast, successToast } from "../helpers/toast"
import Footer from "../components/Footer"

export default function HomePage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  const [search, setSearch] = useState("")
  const [searchInput, setSearchInput] = useState("")

  const [minPrice, setMinPrice] = useState("")
  const [maxPrice, setMaxPrice] = useState("")
  const [CategoryId, setCategoryId] = useState("")

  const [minPriceInput, setMinPriceInput] = useState("")
  const [maxPriceInput, setMaxPriceInput] = useState("")
  const [categoryInput, setCategoryInput] = useState("")

  const [currentPage, setCurrentPage] = useState(1)
  const [totalPage, setTotalPage] = useState(1)

  const [allCategories, setAllCategories] = useState([])

  const [aiForm, setAiForm] = useState({
    occasion: "",
    budget: "",
    notes: "",
  })
  const [aiLoading, setAiLoading] = useState(false)
  const [aiSummary, setAiSummary] = useState("")
  const [aiRecommendations, setAiRecommendations] = useState([])

  async function fetchProducts() {
    try {
      setLoading(true)

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

      if (CategoryId) {
        params.CategoryId = CategoryId
      }

      const { data } = await axios.get(`${baseUrl}/pub/products`, {
        params,
      })

      if (Array.isArray(data)) {
        setProducts(data)
        setTotalPage(1)
      } else if (Array.isArray(data.data)) {
        setProducts(data.data)
        setTotalPage(data.totalPage || 1)
      } else {
        setProducts([])
        setTotalPage(1)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  async function fetchCategories() {
    try {
      const { data } = await axios.get(`${baseUrl}/pub/products`, {
        params: {
          page: 1,
          limit: 100,
        },
      })

      let rows = []

      if (Array.isArray(data)) {
        rows = data
      } else if (Array.isArray(data.data)) {
        rows = data.data
      }

      const uniqueCategories = []
      const categoryMap = {}

      rows.forEach((product) => {
        if (product.Category && !categoryMap[product.Category.id]) {
          categoryMap[product.Category.id] = true
          uniqueCategories.push(product.Category)
        }
      })

      setAllCategories(uniqueCategories)
    } catch (error) {
      console.log(error)
    }
  }

  function handleSearch(event) {
    event.preventDefault()
    setCurrentPage(1)
    setSearch(searchInput)
  }

  function handleFilter(event) {
    event.preventDefault()
    setCurrentPage(1)
    setMinPrice(minPriceInput)
    setMaxPrice(maxPriceInput)
    setCategoryId(categoryInput)
  }

  function handleReset() {
    setSearch("")
    setSearchInput("")

    setMinPrice("")
    setMaxPrice("")
    setCategoryId("")

    setMinPriceInput("")
    setMaxPriceInput("")
    setCategoryInput("")

    setCurrentPage(1)
  }

  function handleAiChange(event) {
    const { name, value } = event.target

    setAiForm({
      ...aiForm,
      [name]: value,
    })
  }

  async function handleAiSubmit(event) {
    try {
      event.preventDefault()

      const accessToken = localStorage.getItem("access_token")

      if (!accessToken) {
        errorToast("Please login first to use AI recommendation")
        return
      }

      setAiLoading(true)
      setAiSummary("")
      setAiRecommendations([])

      const { data } = await axios.post(`${baseUrl}/ai/recommendation`, aiForm, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      setAiSummary(data.summary || "")
      setAiRecommendations(data.recommendations || [])

      successToast(data.message || "AI recommendation generated successfully")
    } catch (error) {
      console.log(error)

      let message = "Failed to generate AI recommendation"

      if (error.response) {
        message = error.response.data.message
      } else {
        message = error.message
      }

      errorToast(message)
    } finally {
      setAiLoading(false)
    }
  }

  function handleAiReset() {
    setAiForm({
      occasion: "",
      budget: "",
      notes: "",
    })
    setAiSummary("")
    setAiRecommendations([])
  }

  function handlePrevPage() {
    if (currentPage === 1) return
    setCurrentPage(currentPage - 1)
  }

  function handleNextPage() {
    if (currentPage === totalPage) return
    setCurrentPage(currentPage + 1)
  }

  useEffect(() => {
    fetchProducts()
  }, [currentPage, search, minPrice, maxPrice, CategoryId])

  useEffect(() => {
    fetchCategories()
  }, [])

  return (
    <div className="min-h-screen bg-pink-50/70">
      <Navbar />

      <section className="mx-auto max-w-7xl px-8 py-10">
        <div className="mb-10 rounded-[32px] border border-pink-100 bg-gradient-to-br from-white via-rose-50 to-pink-50 px-8 py-10 shadow-sm">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-pink-500">
            Hunnyfloe Florist
          </p>

          <h1
            className="max-w-4xl text-5xl leading-tight text-gray-800 md:text-6xl"
            style={{ fontFamily: '"Cormorant Garamond", serif', fontWeight: 700 }}
          >
            Fresh Flowers for Every Moment
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-8 text-gray-600 md:text-lg">
            Welcome to Hunnyfloe florist shop, where every arrangement is crafted to
            bring warmth, beauty, and meaning to your special moments.
          </p>
        </div>


        <div className="mb-8 rounded-3xl bg-white p-6 shadow-sm">
          <div className="mb-5">
            <h2 className="text-2xl font-bold text-gray-800">Search & Filter</h2>
            <p className="mt-1 text-sm text-gray-500">
              Find your favorite flowers by keyword, price range, and category
            </p>
          </div>

          <div className="space-y-5">
            <form
              onSubmit={handleSearch}
              className="rounded-2xl border border-pink-100 bg-indigo-50/35 p-4"
            >
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Search Product
              </label>

              <div className="flex flex-col gap-3 md:flex-row">
                <input
                  type="text"
                  value={searchInput}
                  onChange={(event) => setSearchInput(event.target.value)}
                  placeholder="Search flowers..."
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-pink-500"
                />

                <button
                  type="submit"
                  className="rounded-xl bg-pink-600 px-6 py-3 font-medium text-white transition hover:bg-pink-700"
                >
                  Search
                </button>
              </div>
            </form>

            <div className="rounded-2xl border border-pink-100 bg-indigo-50/35 p-4">
              <label className="mb-3 block text-sm font-semibold text-gray-700">
                Filter Product
              </label>

              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-600">
                    Min Price
                  </label>
                  <input
                    type="number"
                    value={minPriceInput}
                    onChange={(event) => setMinPriceInput(event.target.value)}
                    placeholder="Minimum price"
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-pink-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-600">
                    Max Price
                  </label>
                  <input
                    type="number"
                    value={maxPriceInput}
                    onChange={(event) => setMaxPriceInput(event.target.value)}
                    placeholder="Maximum price"
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-pink-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-600">
                    Category
                  </label>
                  <select
                    value={categoryInput}
                    onChange={(event) => setCategoryInput(event.target.value)}
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-pink-500"
                  >
                    <option value="">All Category</option>
                    {allCategories.map((category) => {
                      return (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      )
                    })}
                  </select>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  onClick={handleFilter}
                  className="rounded-xl bg-pink-600 px-6 py-3 font-medium text-white transition hover:bg-pink-700"
                >
                  Apply Filter
                </button>

                <button
                  onClick={handleReset}
                  className="rounded-xl border border-gray-300 bg-white px-6 py-3 font-medium text-gray-700 transition hover:bg-gray-50"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 overflow-hidden rounded-[28px] border border-pink-100 bg-gradient-to-r from-rose-50 via-pink-50 to-fuchsia-50 shadow-sm">
          <div className="flex flex-col items-center justify-center px-6 py-10 text-center">
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.35em] text-pink-500">
              ✿ Hunnyfloe Collection ✿
            </p>

            <h2 className="text-4xl font-semibold tracking-wide text-gray-800 md:text-5xl"
              style={{ fontFamily: '"Playfair Display", "Georgia", serif' }}
            >
              Blooming Product Selection
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-600 md:text-base">
              Discover elegant floral arrangements crafted for every moment, from warm
              celebrations to heartfelt condolences.
            </p>
          </div>
        </div>

        <div className="mb-5 mt-20 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="rounded-xl border border-gray-300 px-4 py-2 font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Prev
          </button>

          <span className="rounded-xl bg-white px-4 py-2 font-medium text-gray-700 shadow-sm">
            Page {currentPage} of {totalPage}
          </span>

          <button
            type="button"
            onClick={handleNextPage}
            disabled={currentPage === totalPage}
            className="rounded-xl border border-gray-300 px-4 py-2 font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>
        </div>

        {loading ? (
          <p className="text-gray-600">Loading...</p>
        ) : products.length === 0 ? (
          <p className="text-gray-600">No products found</p>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => {
                return <ProductCard key={product.id} product={product} />
              })}
            </div>

            <div className="mt-5 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="rounded-xl border border-gray-300 px-4 py-2 font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Prev
              </button>

              <span className="rounded-xl bg-white px-4 py-2 font-medium text-gray-700 shadow-sm">
                Page {currentPage} of {totalPage}
              </span>

              <button
                type="button"
                onClick={handleNextPage}
                disabled={currentPage === totalPage}
                className="rounded-xl border border-gray-300 px-4 py-2 font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>
            </div>
            <div className="mt-10 mb-8 rounded-2xl bg-white p-6 shadow-sm">
              <div className="mb-5">
                <h2 className="text-2xl font-bold text-gray-800">
                  AI Flower Recommendation
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Tell Hunnyfloe AI about your needs and get product suggestions
                </p>
              </div>

              <form onSubmit={handleAiSubmit}>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Occasion
                    </label>
                    <input
                      type="text"
                      name="occasion"
                      value={aiForm.occasion}
                      onChange={handleAiChange}
                      placeholder="Example: birthday, graduation, condolence"
                      className="w-full rounded-xl border border-gray-300 px-4 py-2 outline-none focus:border-pink-500"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Budget
                    </label>
                    <input
                      type="number"
                      name="budget"
                      value={aiForm.budget}
                      onChange={handleAiChange}
                      placeholder="Enter your budget"
                      className="w-full rounded-xl border border-gray-300 px-4 py-2 outline-none focus:border-pink-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Notes
                    </label>
                    <textarea
                      name="notes"
                      value={aiForm.notes}
                      onChange={handleAiChange}
                      placeholder="Example: elegant, soft colors, for mother, urgent delivery"
                      rows="4"
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-pink-500"
                    ></textarea>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    type="submit"
                    disabled={aiLoading}
                    className="rounded-xl bg-pink-600 px-5 py-2 font-medium text-white hover:bg-pink-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {aiLoading ? "Generating..." : "Get AI Recommendation"}
                  </button>

                  <button
                    type="button"
                    onClick={handleAiReset}
                    className="rounded-xl border border-gray-300 px-5 py-2 font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Reset AI
                  </button>
                </div>
              </form>

              {aiSummary && (
                <div className="mt-6 rounded-2xl bg-pink-50 p-4">
                  <h3 className="mb-2 text-lg font-semibold text-gray-800">
                    AI Summary
                  </h3>
                  <p className="text-gray-600">{aiSummary}</p>
                </div>
              )}

              {aiRecommendations.length > 0 && (
                <div className="mt-6">
                  <h3 className="mb-4 text-lg font-semibold text-gray-800">
                    Recommended Products
                  </h3>

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {aiRecommendations.map((item, index) => {
                      if (!item.product) return null

                      return (
                        <ProductCard
                          key={item.product.id || index}
                          product={item.product}
                          reason={item.reason}
                        />
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </section>
      <Footer />
    </div>
  )
}