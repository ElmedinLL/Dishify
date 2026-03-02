import { createSlice } from "@reduxjs/toolkit"

const THEME_KEY = "dishify_theme"

const loadTheme = () => {
  try {
    const stored = localStorage.getItem(THEME_KEY)
    if (stored === "dark" || stored === "light") return stored
  } catch (e) {
    console.warn("Failed to load theme", e)
  }
  return "light"
}

const saveTheme = (theme) => {
  try {
    localStorage.setItem(THEME_KEY, theme)
  } catch (e) {
    console.warn("Failed to save theme", e)
  }
}

const themeSlice = createSlice({
  name: "theme",
  initialState: loadTheme(),
  reducers: {
    toggleTheme: (state) => {
      const next = state === "light" ? "dark" : "light"
      saveTheme(next)
      return next
    },
    setTheme: (state, action) => {
      const theme = action.payload === "dark" ? "dark" : "light"
      saveTheme(theme)
      return theme
    },
  },
})

export const { toggleTheme, setTheme } = themeSlice.actions
export const selectTheme = (state) => state.theme
export default themeSlice.reducer
