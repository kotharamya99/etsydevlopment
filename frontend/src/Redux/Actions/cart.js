import axiosInstance from "../../utils/axios"


export const cartAction =
  (userId, query = "") =>
  (dispatch) => {
    dispatch({ type: "CART_LOADING" })

    axiosInstance()
      .get(`/users/${userId}/cart`)
      .then((response) => {
        console.log("response from cart action", response.data)
        dispatch({ type: "CART_SUCCESS", payload: response.data })
      })
      .catch((error) => {
        console.log("error from cart action", error)
        dispatch({
          type: "CART_ERROR",
          payload: error.response ? error.response.data : "Could not connect",
        })
      })
  }

export const postCartAction = (productId, quantity, userID) => (dispatch) => {
  dispatch({ type: "ADD_CART_ITEM_LOADING" })

  axiosInstance()
    .post(`/users/${userID}/cart`, { productId: productId, quantity: quantity })
    .then((response) => {
      console.log("response from  post cart action", response.data)
      dispatch({ type: "ADD_CART_ITEM_SUCCESS", payload: response.data })
    })
    .catch((error) => {
      console.log("error from post cart action", error)
      dispatch({
        type: "ADD_CART_ITEM_ERROR",
        payload: error.response ? error.response.data : "Could not connect",
      })
    })
}

export const putCartAction =
  (userID, productId, quantity = -15, isGiftWrap = null, giftWrapDescription = null) =>
  // (userID, productId, quantity = null, isGiftWrap = null, giftWrapDescription = null) =>
  (dispatch) => {
    dispatch({ type: "UPDATE_CART_ITEM_LOADING" })

    axiosInstance()
      .put(`/users/${userID}/cart/`, {
        productId: productId,
        quantity: quantity,
        isGiftWrap: isGiftWrap,
        giftWrapDescription: giftWrapDescription
      })
      .then((response) => {
        console.log("response from  put cart action", response.data)
        dispatch({ type: "UPDATE_CART_ITEM_SUCCESS", payload: response.data })
      })
      .catch((error) => {
        console.log("error from put cart action", error)
        dispatch({
          type: "UPDATE_CART_ITEM_ERROR",
          payload: error.response ? error.response.data : "Could not connect",
        })
      })
  }

export const deleteCartAction = (userId, cartId) => (dispatch) => {
  dispatch({ type: "DELETE_CART_LOADING" })

  axiosInstance()
    .delete(`/users/${userId}/cart/${cartId}`)
    .then((response) => {
      console.log("response from delete cart action", response.data)
      dispatch({ type: "DELETE_CART_SUCCESS", payload: cartId })
    })
    .catch((error) => {
      console.log("error from delete cart action", error)
      dispatch({
        type: "DELETE_CART_ERROR",
        payload: error.response ? error.response.data : "Could not connect",
      })
    })
}

export const cartCheckout = (userId) => (dispatch) => {
  dispatch({ type: "UPDATE_CART_ITEM_LOADING" })

  axiosInstance()
    .post(`/users/${userId}/cart/checkout`)
      .then((response) => {
        console.log("response.data", response.data);
        // globalDispatch({ type: UPDATE_CART_ITEM_SUCCESS, payload: [] });
        dispatch({ type: "UPDATE_CART_ITEM_SUCCESS", payload: [] });
        
        //setProduct(response.data)
        //setLoading(false)
      })
      .catch((error) => {
        //setLoading(false)
        console.log(error);
        dispatch({
          type: "UPDATE_CART_ITEM_ERROR",
          payload: error.response ? error.response.data : "Could not connect",
        })
      });
}







// export const cartAction =
//   (userId, query = "") =>
//   (dispatch) => {
//     dispatch({ type: "CART_LOADING" })
//     axiosInstance()
//       .get(`/users/${userId}/cart`)
//       .then((response) => {
//         console.log("response from cart action", response.data)
//         dispatch({ type: "CART_SUCCESS", payload: response.data })
//       })
//       .catch((error) => {
//         console.log("error from cart action", error)
//         dispatch({
//           type: "CART_ERROR",
//           payload: error.response ? error.response.data : "Could not connect",
//         })
//       })
//   }

// export const postCartAction = (productId, quantity, userID) => (dispatch) => {
//   dispatch({ type: "ADD_CART_ITEM_LOADING" })

//   axiosInstance()
//     .post(`/users/${userID}/cart`, { productId: productId, quantity: quantity })
//     .then((response) => {
//       console.log("response from  post cart action", response.data)
//       dispatch({ type: "ADD_CART_ITEM_SUCCESS", payload: response.data })
//     })
//     .catch((error) => {
//       console.log("error from post cart action", error)
//       dispatch({
//         type: "ADD_CART_ITEM_ERROR",
//         payload: error.response ? error.response.data : "Could not connect",
//       })
//     })
// }

// export const putCartAction =
//   (userID, productId, quantity = null, isGiftWrap = null, giftWrapDescription = null) =>
//   (dispatch) => {
//     dispatch({ type: "UPDATE_CART_ITEM_LOADING" })

//     axiosInstance()
//       .put(`/users/${userID}/cart/`, {
//         productId: productId,
//         quantity: quantity,
//         isGiftWrap: isGiftWrap,
//         giftWrapDescription: giftWrapDescription
//       })
//       .then((response) => {
//         console.log("response from  put cart action", response.data)
//         dispatch({ type: "UPDATE_CART_ITEM_SUCCESS", payload: response.data })
//       })
//       .catch((error) => {
//         console.log("error from put cart action", error)
//         dispatch({
//           type: "UPDATE_CART_ITEM_ERROR",
//           payload: error.response ? error.response.data : "Could not connect",
//         })
//       })
//   }

// export const deleteCartAction = (userId, cartId) => (dispatch) => {
//   dispatch({ type: "DELETE_CART_LOADING" })

//   axiosInstance()
//     .delete(`/users/${userId}/cart/${cartId}`)
//     .then((response) => {
//       console.log("response from delete cart action", response.data)
//       dispatch({ type: "DELETE_CART_SUCCESS", payload: cartId })
//     })
//     .catch((error) => {
//       console.log("error from delete cart action", error)
//       dispatch({
//         type: "DELETE_CART_ERROR",
//         payload: error.response ? error.response.data : "Could not connect",
//       })
//     })
// }
