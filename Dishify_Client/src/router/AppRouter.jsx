
import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home"
import { ROUTES } from "../utility/constants";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Cart from "../pages/cart/Cart";
import Checkout from "../pages/cart//Checkout";
import OrderConfirmation from "../pages/order/OrderConfirmation";
import MenuManagement from "../pages/menuItem/MenuItemManagement";
import OrderManagement from "../pages/order/OrderManagement";


const AppRoutes  = () => {
   return(
        <Routes>
            <Route path={ROUTES.HOME} element={<Home/>} />
             <Route path={ROUTES.LOGIN} element={<Login/>} />
              <Route path={ROUTES.REGISTER} element={<Register/>} />
               <Route path={ROUTES.CART} element={<Cart/>} />
                <Route path={ROUTES.CHECKOUT} element={<Checkout/>} />
                 <Route path={ROUTES.ORDER_CONFIRMATION} element={<OrderConfirmation/>} />
                  <Route path={ROUTES.MENU_MANAGEMENT} element={<MenuManagement/>} />
                   <Route path={ROUTES.ORDER_MANAGEMENT} element={<OrderManagement/>} />
        </Routes>
   )
}

export default AppRoutes ;