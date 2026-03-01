import { useEffect } from "react"
import { Navigate, useLocation } from "react-router-dom"
import { useSelector } from "react-redux"
import { selectUser, selectIsAuthenticated } from "../store/slices/authSlice"
import { ROUTES } from "../utility/constants"
import { toast } from "react-toastify"

export default function ProtectedRoute({ children, requireAdmin = false }) {
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const user = useSelector(selectUser)
  const location = useLocation()
  const isFromCart = location.pathname === ROUTES.CART

  useEffect(() => {
    if (!isAuthenticated && isFromCart) {
      toast.info("Please sign in to access your cart")
    }
  }, [isAuthenticated, isFromCart])

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />
  }

  if (requireAdmin && user?.role?.toLowerCase() !== "admin") {
    return <Navigate to={ROUTES.HOME} replace />
  }

  return children
}
