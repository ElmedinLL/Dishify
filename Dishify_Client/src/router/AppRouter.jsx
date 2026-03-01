import { Routes, Route } from "react-router-dom"
import Home from "../pages/Home"
import { ROUTES } from "../utility/constants"
import Login from "../pages/auth/Login"
import Register from "../pages/auth/Register"
import Cart from "../pages/cart/Cart"
import Checkout from "../pages/cart/Checkout"
import OrderConfirmation from "../pages/order/OrderConfirmation"
import MenuManagement from "../pages/menuItem/MenuItemManagement"
import MenuItemDetail from "../pages/menuItem/MenuItemDetail"
import OrderManagement from "../pages/order/OrderManagement"
import ProtectedRoute from "../components/ProtectedRoute"

const AppRoutes = () => {
  return (
    <Routes>
      <Route path={ROUTES.HOME} element={<Home />} />
      <Route path={ROUTES.MENU_ITEM_DETAIL} element={<MenuItemDetail />} />
      <Route path={ROUTES.LOGIN} element={<Login />} />
      <Route path={ROUTES.REGISTER} element={<Register />} />
      <Route
        path={ROUTES.CART}
        element={
          <ProtectedRoute>
            <Cart />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.CHECKOUT}
        element={
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        }
      />
      <Route path={ROUTES.ORDER_CONFIRMATION} element={<OrderConfirmation />} />
      <Route
        path={ROUTES.MENU_MANAGEMENT}
        element={
          <ProtectedRoute requireAdmin>
            <MenuManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.ORDER_MANAGEMENT}
        element={
          <ProtectedRoute>
            <OrderManagement />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

export default AppRoutes