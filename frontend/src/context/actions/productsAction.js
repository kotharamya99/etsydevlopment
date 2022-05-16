import axiosInstance from "../../utils/axios"
import {
  PRODUCTS_ERROR,
  PRODUCTS_LOADING,
  PRODUCTS_SUCCESS,
} from "./actionTypes"
// so actions are responsible for making api calls and tells the reducer how to update the state.

export const productsAction =
  (userId, query = "") =>
  (dispatch) => {
    dispatch({ type: PRODUCTS_LOADING })

    axiosInstance()
      .post(`/users/${userId}/products`, { search: query })
      .then((response) => {
        console.log("response from productsAction", response.data)
        dispatch({ type: PRODUCTS_SUCCESS, payload: response.data })
      })
      .catch((error) => {
        console.log("error from productsAction", error)
        dispatch({
          type: PRODUCTS_ERROR,
          payload: error.response ? error.response.data : "Could not connect",
        })
      })
  }
