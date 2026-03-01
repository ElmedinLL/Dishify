import { configureStore } from "@reduxjs/toolkit"
import { baseApi } from "./api/baseApi"
import cartReducer from "./slices/cartSlice"
import authReducer from "./slices/authSlice"
import checkoutReducer from "./slices/checkoutSlice"
import themeReducer from "./slices/themeSlice"

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    cart: cartReducer,
    auth: authReducer,
    checkout: checkoutReducer,
    theme: themeReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
})