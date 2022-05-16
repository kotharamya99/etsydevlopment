import { configureStore } from "@reduxjs/toolkit";
import { userReducer } from "../Redux/Reducers/user";
import { productReducer } from "../Redux/Reducers/products";
import { cartReducer } from "../Redux/Reducers/cart";

const store = configureStore({
    reducer: {
      user: userReducer,
      products: productReducer,
      cart: cartReducer
    },
  });


export default store;