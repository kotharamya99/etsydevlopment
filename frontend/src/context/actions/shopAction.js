import axiosInstance from "../../utils/axios"
import {
  GET_SHOP_LOADING,
  GET_SHOP_SUCCESS,
  GET_SHOP_ERROR,
  GET_SHOP_PRODUCTS_LOADING,
  GET_SHOP_PRODUCTS_SUCCESS,
  GET_SHOP_PRODUCTS_ERROR,
} from "./actionTypes"

export const shopAction = (userId, shopId) => (dispatch) => {
  dispatch({ type: GET_SHOP_LOADING })
  // /users/${userId}/shops/${response.data.shopId}
  axiosInstance().
    .get(`/users/${userId}/shops/${shopId}`)
    .then((response) => {
      console.log("response from GET_SHOPAction", response.data)
      dispatch({ type: GET_SHOP_SUCCESS, payload: response.data })
    })
    .catch((error) => {
      console.log("error from GET_SHOPAction", error)
      dispatch({
        type: GET_SHOP_ERROR,
        payload: error.response ? error.response.data : "Could not connect",
      })
    })
}

// export const getShopProductsAction = (userId, shopData) => (dispatch) => {
//   dispatch({ type: GET_SHOP_PRODUCTS_LOADING })
//   // /{{host}}/users/{{userId}}/products
//   axiosInstance().
//     .post(`/users/${userId}/products`, shopData)
//     .then((response) => {
//       console.log("response from GET_SHOP_PRODUCTS_ACTION", response.data)
//       dispatch({ type: GET_SHOP_PRODUCTS_SUCCESS, payload: response.data })
//     })
//     .catch((error) => {
//       console.log("error from GET_SHOP_PRODUCTS_ACTION", error)
//       dispatch({
//         type: GET_SHOP_PRODUCTS_ERROR,
//         payload: error.response ? error.response.data : "Could not connect",
//       })
//     })
// }
