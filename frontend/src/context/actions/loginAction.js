import axiosInstance from "../../utils/axios"
import { LOGIN_ERROR, LOGIN_LOADING, LOGIN_SUCCESS } from "./actionTypes"
// so actions are responsible for making api calls and tells the reducer how to update the state.

export const loginAction = (user) => (dispatch) => {
  dispatch({ type: LOGIN_LOADING })

  axiosInstance()
    .post("/login", user)
    .then((response) => {
      localStorage.token = response.data.token
      console.log("response from LOGINAction", response.data)
      dispatch({ type: LOGIN_SUCCESS, payload: response.data })
    })
    .catch((error) => {
      console.log("error from LOGINAction", error)
      dispatch({
        type: LOGIN_ERROR,
        payload: error.response ? error.response.data : "Could not connect",
      })
    })
}
