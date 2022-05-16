import { createReducer } from "@reduxjs/toolkit";
const initialState = {
  products:{}
};

export const productReducer = createReducer(initialState, {
   PRODUCTS_LOADING: (state) => {
    state.loading = true;
  },
  PRODUCTS_SUCCESS: (state, action) => {
    state.loading = false;
    state.products = action.payload;
  },
  PRODUCTS_ERROR: (state, action) => {
    state.loading = false;
    state.error = action.payload;
  }
});