import {
  SET_USER,
  PRODUCTS_LOADING,
  PRODUCTS_SUCCESS,
  PRODUCTS_ERROR,
  FAVORITES_LOADING,
  FAVORITES_SUCCESS,
  FAVORITES_ERROR,
  ADD_FAVORITE_ITEM_LOADING,
  ADD_FAVORITE_ITEM_SUCCESS,
  ADD_FAVORITE_ITEM_ERROR,
  CART_LOADING,
  CART_SUCCESS,
  CART_ERROR,
  DELETE_FAVORITES_LOADING,
  DELETE_FAVORITES_SUCCESS,
  DELETE_FAVORITES_ERROR,
  DELETE_CART_LOADING,
  DELETE_CART_SUCCESS,
  DELETE_CART_ERROR,
  GET_SHOP_LOADING,
  GET_SHOP_SUCCESS,
  GET_SHOP_ERROR,
  LOGOUT_USER,
} from "../actions/actionTypes"

import globalInitialState from "../initialState/globalInitialState"
import authInitialState from "../initialState/authInitialState"

const globalReducer = (state, action) => {
  switch (action.type) {
    case SET_USER:
      return {
        ...state,
        user: action.payload,
      }
    case PRODUCTS_LOADING:
      return {
        ...state,
        products: {
          ...state.products,
          loading: true,
          error: false,
        },
      }
    case PRODUCTS_SUCCESS:
      return {
        ...state,
        products: {
          ...state.products,
          loading: false,
          error: false,
          data: action.payload,
        },
      }
    case PRODUCTS_ERROR:
      return {
        ...state,
        products: {
          ...state.products,
          loading: false,
          error: action.payload,
        },
      }
    case FAVORITES_LOADING:
      return {
        ...state,
        favorites: {
          ...state.favorites,
          loading: true,
          error: false,
        },
      }
    case FAVORITES_SUCCESS:
      return {
        ...state,
        favorites: {
          ...state.favorites,
          loading: false,
          error: false,
          data: action.payload,
        },
      }
    case FAVORITES_ERROR:
      return {
        ...state,
        favorites: {
          ...state.favorites,
          loading: false,
          error: action.payload,
        },
      }
    case ADD_FAVORITE_ITEM_LOADING:
      return {
        ...state,
        addToFavorite: {
          ...state.addToFavorite,
          loading: true,
          error: false,
        },
      }
    case ADD_FAVORITE_ITEM_SUCCESS:
      return {
        ...state,
        addToFavorite: {
          ...state.addToFavorite,
          loading: false,
          error: false,
          data: action.payload,
        },
      }
    case ADD_FAVORITE_ITEM_ERROR:
      return {
        ...state,
        addToFavorite: {
          ...state.addToFavorite,
          loading: false,
          error: action.payload,
        },
      }

    case CART_LOADING:
      return {
        ...state,
        cart: {
          ...state.cart,
          loading: true,
          error: false,
        },
      }
    case CART_SUCCESS:
      return {
        ...state,
        cart: {
          ...state.cart,
          loading: false,
          error: false,
          data: action.payload,
        },
      }
    case CART_ERROR:
      return {
        ...state,
        cart: {
          ...state.cart,
          loading: false,
          error: action.payload,
        },
      }

    case DELETE_FAVORITES_LOADING:
      return {
        ...state,
        favorites: {
          ...state.favorites,
          loading: true,
          error: false,
        },
      }
    case DELETE_FAVORITES_SUCCESS:
      console.log("DELETE FAV DATA is", state.favorites.data)
      return {
        ...state,
        favorites: {
          ...state.favorites,
          loading: false,
          error: false,
          data: {
            favorites: (state.favorites.data
              ? state.favorites.data.favorites
              : []
            ).filter((item) => item._id !== action.payload),
          },
        },
      }
    case DELETE_FAVORITES_ERROR:
      return {
        ...state,
        favorites: {
          ...state.favorites,
          loading: false,
          error: action.payload,
        },
      }

    case DELETE_CART_LOADING:
      return {
        ...state,
        cart: {
          ...state.cart,
          loading: true,
          error: false,
        },
      }
    case DELETE_CART_SUCCESS:
      console.log("DELETE CART SUCCESS", state.cart.data.cartItems)
      return {
        ...state,
        cart: {
          ...state.cart,
          loading: false,
          error: false,
          data: {
            cartItems: (state.cart.data
              ? state.cart.data.cartItems
              : []
            ).filter((item) => item._id !== action.payload),
          },
        },
      }
    case DELETE_CART_ERROR:
      return {
        ...state,
        cart: {
          ...state.cart,
          loading: false,
          error: action.payload,
        },
      }

    case GET_SHOP_LOADING:
      return {
        ...state,
        shop: {
          ...state.shop,
          loading: true,
          error: false,
        },
      }
    case GET_SHOP_SUCCESS:
      return {
        ...state,
        shop: {
          ...state.shop,
          loading: false,
          error: false,
          data: action.payload,
        },
      }
    case GET_SHOP_ERROR:
      return {
        ...state,
        shop: {
          ...state.shop,
          loading: false,
          error: action.payload,
        },
      }

    case LOGOUT_USER:
      return {
        ...state,
        ...globalInitialState,
      }
    default:
      return state
  }
}

export default globalReducer
