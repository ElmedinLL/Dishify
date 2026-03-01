import { createSlice } from "@reduxjs/toolkit"

const loadCartFromStorage = () => {
  try {
    const stored = localStorage.getItem("dishify_cart")
    if (stored) return JSON.parse(stored)
  } catch (e) {
    console.warn("Failed to load cart from storage", e)
  }
  return []
}

const saveCartToStorage = (items) => {
  try {
    localStorage.setItem("dishify_cart", JSON.stringify(items))
  } catch (e) {
    console.warn("Failed to save cart to storage", e)
  }
}

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: loadCartFromStorage(),
  },
  reducers: {
    addToCart: (state, action) => {
      const { menuItem, quantity = 1 } = action.payload
      const existing = state.items.find((i) => i.menuItem.id === menuItem.id)
      if (existing) {
        existing.quantity += quantity
      } else {
        state.items.push({ menuItem, quantity })
      }
      saveCartToStorage(state.items)
    },
    updateQuantity: (state, action) => {
      const { menuItemId, quantity } = action.payload
      const item = state.items.find((i) => i.menuItem.id === menuItemId)
      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter((i) => i.menuItem.id !== menuItemId)
        } else {
          item.quantity = quantity
        }
        saveCartToStorage(state.items)
      }
    },
    removeFromCart: (state, action) => {
      const menuItemId = action.payload
      state.items = state.items.filter((i) => i.menuItem.id !== menuItemId)
      saveCartToStorage(state.items)
    },
    clearCart: (state) => {
      state.items = []
      saveCartToStorage(state.items)
    },
  },
})

export const { addToCart, updateQuantity, removeFromCart, clearCart } =
  cartSlice.actions

export const selectCartItems = (state) => state.cart.items
export const selectCartCount = (state) =>
  state.cart.items.reduce((sum, i) => sum + i.quantity, 0)
export const selectCartSubtotal = (state) =>
  state.cart.items.reduce(
    (sum, i) => sum + i.menuItem.price * i.quantity,
    0
  )

export default cartSlice.reducer
