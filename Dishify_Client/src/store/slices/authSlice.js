import { createSlice } from "@reduxjs/toolkit"
import { getStoredUser, setToken, removeToken } from "../../utility/jwtHelper"

const storedUser = getStoredUser()

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: storedUser,
    isAuthenticated: !!storedUser,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload
      state.isAuthenticated = !!action.payload
    },
    logout: (state) => {
      state.user = null
      state.isAuthenticated = false
      removeToken()
    },
  },
})

export const { setUser, logout } = authSlice.actions

export const selectUser = (state) => state.auth.user
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated

export default authSlice.reducer
