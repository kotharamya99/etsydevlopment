import React, { createContext, useReducer } from "react"
import authInitialState from "./initialState/authInitialState"
import globalInitialState from "./initialState/globalInitialState"
import authReducer from "./reducers/authReducer"
import globalReducer from "./reducers/globalReducer"

export const GlobalContext = createContext({})

export const GlobalProvider = ({ children }) => {
  // in here we want define our state changes
  const [authState, authDispatch] = useReducer(authReducer, authInitialState)
  const [globalState, globalDispatch] = useReducer(
    globalReducer,
    globalInitialState
  )
  // const [userState, userDispatch] = useReducer(user, globalInitialState);

  return (
    <GlobalContext.Provider
      value={{
        authState,
        authDispatch,
        globalState,
        globalDispatch,
      }}
    >
      {children}
    </GlobalContext.Provider>
  )
}
