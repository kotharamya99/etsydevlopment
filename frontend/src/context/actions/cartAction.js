import axiosInstance from "../../utils/axios"
import {
  CART_ERROR,
  CART_LOADING,
  CART_SUCCESS,
  ADD_CART_ITEM_LOADING,
  ADD_CART_ITEM_SUCCESS,
  ADD_CART_ITEM_ERROR,
  UPDATE_CART_ITEM_LOADING,
  UPDATE_CART_ITEM_SUCCESS,
  UPDATE_CART_ITEM_ERROR,
  DELETE_CART_ERROR,
  DELETE_CART_LOADING,
  DELETE_CART_SUCCESS,
} from "./actionTypes"
// so actions are responsible for making api calls and tells the reducer how to update the state.

export const cartAction =
  (userId, query = "") =>
  (dispatch) => {
    dispatch({ type: CART_LOADING })

    axiosInstance()
      .get(`/users/${userId}/cart`)
      .then((response) => {
        console.log("response from cart action", response.data)
        dispatch({ type: CART_SUCCESS, payload: response.data })
      })
      .catch((error) => {
        console.log("error from cart action", error)
        dispatch({
          type: CART_ERROR,
          payload: error.response ? error.response.data : "Could not connect",
        })
      })
  }

export const postCartAction = (productId, quantity, userID) => (dispatch) => {
  dispatch({ type: ADD_CART_ITEM_LOADING })

  axiosInstance()
    .post(`/users/${userID}/cart`, { productId: productId, quantity: quantity })
    .then((response) => {
      console.log("response from  post cart action", response.data)
      dispatch({ type: ADD_CART_ITEM_SUCCESS, payload: response.data })
    })
    .catch((error) => {
      console.log("error from post cart action", error)
      dispatch({
        type: ADD_CART_ITEM_ERROR,
        payload: error.response ? error.response.data : "Could not connect",
      })
    })
}

export const putCartAction =
  (userID, productId, quantity = null) =>
  (dispatch) => {
    dispatch({ type: UPDATE_CART_ITEM_LOADING })

    axiosInstance()
      .put(`/users/${userID}/cart/`, {
        productId: productId,
        quantity: quantity,
      })
      .then((response) => {
        console.log("response from  put cart action", response.data)
        dispatch({ type: UPDATE_CART_ITEM_SUCCESS, payload: response.data })
      })
      .catch((error) => {
        console.log("error from put cart action", error)
        dispatch({
          type: UPDATE_CART_ITEM_ERROR,
          payload: error.response ? error.response.data : "Could not connect",
        })
      })
  }

export const deleteCartAction = (userId, cartId) => (dispatch) => {
  dispatch({ type: DELETE_CART_LOADING })

  axiosInstance()
    .delete(`/users/${userId}/cart/${cartId}`)
    .then((response) => {
      console.log("response from delete cart action", response.data)
      dispatch({ type: DELETE_CART_SUCCESS, payload: cartId })
    })
    .catch((error) => {
      console.log("error from delete cart action", error)
      dispatch({
        type: DELETE_CART_ERROR,
        payload: error.response ? error.response.data : "Could not connect",
      })
    })
}
