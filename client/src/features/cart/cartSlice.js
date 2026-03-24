import { createSlice } from "@reduxjs/toolkit"
import axios from "axios"
import baseUrl from "../../config/baseUrl"

const initialState = {
  cartItems: [],
  loading: false,
  error: null,
}

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    fetchCartPending(state) {
      state.loading = true
      state.error = null
    },
    fetchCartSuccess(state, action) {
      state.loading = false
      state.cartItems = action.payload
    },
    fetchCartFailed(state, action) {
      state.loading = false
      state.error = action.payload
    },
  },
})

export const { fetchCartPending, fetchCartSuccess, fetchCartFailed } =
  cartSlice.actions

export const fetchCartAsync = () => {
  return async function (dispatch) {
    try {
      dispatch(fetchCartPending())

      const accessToken = localStorage.getItem("access_token")

      const { data } = await axios.get(`${baseUrl}/carts`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      dispatch(fetchCartSuccess(data.CartItems || []))
    } catch (error) {
      dispatch(fetchCartFailed(error))
    }
  }
}

export const addToCartAsync = (productId) => {
  return async function (dispatch) {
    try {
      const accessToken = localStorage.getItem("access_token")

      await axios.post(
        `${baseUrl}/carts/${productId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )

      dispatch(fetchCartAsync())
    } catch (error) {
      dispatch(fetchCartFailed(error))
      throw error
    }
  }
}

export const deleteCartItemAsync = (cartItemId) => {
  return async function (dispatch) {
    try {
      const accessToken = localStorage.getItem("access_token")

      await axios.delete(`${baseUrl}/carts/item/${cartItemId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      dispatch(fetchCartAsync())
    } catch (error) {
      dispatch(fetchCartFailed(error))
      throw error
    }
  }
}

export const updateCartItemQtyAsync = (cartItemId, qty) => {
  return async function (dispatch) {
    try {
      const accessToken = localStorage.getItem("access_token")

      await axios.patch(
        `${baseUrl}/carts/item/${cartItemId}`,
        {
          qty,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )

      dispatch(fetchCartAsync())
    } catch (error) {
      dispatch(fetchCartFailed(error))
      throw error
    }
  }
}

export default cartSlice.reducer