export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  CART: "/cart",
  CHECKOUT: "/checkout",
  ORDER_CONFIRMATION: "/order-confirmation",
  MENU_MANAGEMENT: "/menu-management",
  ORDER_MANAGEMENT: "/order-management",
  MENU_ITEM_DETAIL: "/menu-item/:id",
  getMenuItemDetailUrl: (id) => `/menu-item/${id}`,
}

export const API_BASE_URL = "http://localhost:5150"
// In dev, use empty string so Vite proxy forwards /images to backend
export const getImageUrl = (path) => {
  if (!path) return ""
  if (path.startsWith("http://") || path.startsWith("https://")) return path
  return import.meta.env.DEV ? `/${path}` : `${API_BASE_URL}/${path}`
}