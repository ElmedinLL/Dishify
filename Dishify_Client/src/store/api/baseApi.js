import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { API_BASE_URL } from "../../utility/constants"
import { getToken } from "../../utility/jwtHelper"
import { logout } from "../slices/authSlice"

// In dev, use relative /api so Vite proxy forwards to backend
const baseUrl = import.meta.env.DEV ? "/api" : API_BASE_URL + "/api"

const baseQuery = fetchBaseQuery({
  baseUrl,
  prepareHeaders: (headers) => {
    const token = getToken()
    if (token) {
      headers.set("Authorization", `Bearer ${token}`)
    }
    return headers
  },
})

const baseQueryWithAuth = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions)

  if (result.error?.status === 401 || result.error?.status === 403) {
    api.dispatch(logout())
    try {
      sessionStorage.setItem("redirectAfterLogin", window.location.pathname + window.location.search)
    } catch (e) {}
    window.location.href = "/login"
  }

  return result
}

export const baseApi = createApi({
    reducerPath: "api",
    baseQuery: baseQueryWithAuth,
    tagTypes: ["MenuItem", "Order"],
    endpoints: () => ({}),
});