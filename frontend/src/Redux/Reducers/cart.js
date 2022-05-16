import { createReducer } from "@reduxjs/toolkit";
const initialState = {
  cart:{}
};

export const cartReducer = createReducer(initialState, {
   CART_LOADING: (state) => {
    state.loading = true;
  },
  CART_SUCCESS: (state, action) => {
    state.loading = false;
    state.cart = action.payload;
  },
  CART_ERROR: (state, action) => {
    state.loading = false;
    state.error = action.payload;
  },
  ADD_CART_ITEM_LOADING: (state) => {
    state.loading = true;
  },
  ADD_CART_ITEM_SUCCESS: (state, action) => {
    state.loading = false;
    state.cart = action.payload;
  },
  ADD_CART_ITEM_ERROR: (state, action) => {
    state.loading = false;
    state.error = action.payload;
  },
  UPDATE_CART_ITEM_LOADING: (state) => {
    state.loading = true;
  },
  UPDATE_CART_ITEM_SUCCESS: (state, action) => {
    state.loading = false;
    state.cart = action.payload;
  },
  UPDATE_CART_ITEM_ERROR: (state, action) => {
    state.loading = false;
    state.error = action.payload;
  },
  DELETE_CART_LOADING: (state) => {
    state.loading = true;
  },
  DELETE_CART_SUCCESS: (state, action) => {
    console.log(action.payload);
    state.loading = false;
    state.cart = {cartItems: state.cart?.cartItems.filter((item) => item._id !== action.payload)};
  },
  DELETE_CART_ERROR: (state, action) => {
    state.loading = false;
    state.error = action.payload;
  }
});