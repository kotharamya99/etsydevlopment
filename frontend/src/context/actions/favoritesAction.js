import axiosInstance from "../../utils/axios"
import {
  FAVORITES_ERROR,
  FAVORITES_LOADING,
  FAVORITES_SUCCESS,
  ADD_FAVORITE_ITEM_LOADING,
  ADD_FAVORITE_ITEM_SUCCESS,
  ADD_FAVORITE_ITEM_ERROR,
  DELETE_FAVORITES_ERROR,
  DELETE_FAVORITES_LOADING,
  DELETE_FAVORITES_SUCCESS,
} from "./actionTypes"
// so actions are responsible for making api calls and tells the reducer how to update the state.

export const favoritesAction =
  (userId, query = "") =>
  (dispatch) => {
    dispatch({ type: FAVORITES_LOADING })

    axiosInstance()
      .get(`/users/${userId}/favorites?search=${query}`)
      .then((response) => {
        console.log("response from favoritesAction", response.data)
        dispatch({ type: FAVORITES_SUCCESS, payload: response.data })
      })
      .catch((error) => {
        console.log("error from favoritesAction", error)
        dispatch({
          type: FAVORITES_ERROR,
          payload: error.response ? error.response.data : "Could not connect",
        })
      })
  }

export const postFavoritesAction = (productId, userID) => (dispatch) => {
  dispatch({ type: ADD_FAVORITE_ITEM_LOADING })

  axiosInstance()
    .post(`/users/${userID}/favorites`, { productId })
    .then((response) => {
      console.log("response from  postFavoritesAction", response.data)
      dispatch({ type: ADD_FAVORITE_ITEM_SUCCESS, payload: response.data })
    })
    .catch((error) => {
      console.log("error from postFavoritesAction", error)
      dispatch({
        type: ADD_FAVORITE_ITEM_ERROR,
        payload: error.response ? error.response.data : "Could not connect",
      })
    })
}

export const deleteFavoritesAction = (userId, id) => (dispatch) => {
  dispatch({ type: DELETE_FAVORITES_LOADING })
  axiosInstance()
    .delete(`/users/${userId}/favorites/${id}`)
    .then((response) => {
      console.log("response from deleteFavoritesAction", response.data)
      dispatch({ type: DELETE_FAVORITES_SUCCESS, payload: id })
    })
    .catch((error) => {
      console.log("error from deleteFavoritesAction", error)
      dispatch({
        type: DELETE_FAVORITES_ERROR,
        payload: error.response ? error.response.data : "Could not connect",
      })
    })
}
