import { useSelector, useDispatch } from "react-redux"
import {
  selectCartItems,
  selectCartSubtotal,
  selectCartCount,
  clearCart,
} from "../../store/slices/cartSlice"
import { selectPickupDetails, clearPickupDetails } from "../../store/slices/checkoutSlice"
import { selectUser } from "../../store/slices/authSlice"
import { getStoredUser } from "../../utility/jwtHelper"
import { useCreateOrderMutation } from "../../store/api/orderApi"
import { useNavigate } from "react-router-dom"
import { ROUTES } from "../../utility/constants"
import { getImageUrl } from "../../utility/constants"
import { useState } from "react"
import { toast } from "react-toastify"
import { getErrorMessage } from "../../utility/helperFunc"

export default function Checkout() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const items = useSelector(selectCartItems)
  const subtotal = useSelector(selectCartSubtotal)
  const cartCount = useSelector(selectCartCount)
  const pickupDetails = useSelector(selectPickupDetails)
  const user = useSelector(selectUser)

  const [createOrder, { isLoading }] = useCreateOrderMutation()

  const handlePlaceOrder = async () => {
    if (!items.length) {
      toast.error("Your cart is empty")
      return
    }

    const currentUser = user || getStoredUser()
    const orderData = {
      pickUpName: pickupDetails.pickUpName,
      pickUpPhoneNumber: pickupDetails.pickUpPhoneNumber,
      pickUpEmail: pickupDetails.pickUpEmail,
      applicationUserId: currentUser?.id || "",
      orderTotal: subtotal,
      totalItems: cartCount,
      orderDetailsDTO: items.map(({ menuItem, quantity }) => ({
        menuItemId: menuItem.id,
        quantity,
        itemName: menuItem.name,
        price: menuItem.price,
      })),
    }

    try {
      const result = await createOrder(orderData).unwrap()
      const order = result?.result || result
      dispatch(clearCart())
      dispatch(clearPickupDetails())
      toast.success("Order placed successfully!")
      navigate(ROUTES.ORDER_CONFIRMATION, {
        state: { orderId: order?.orderHeaderId },
      })
    } catch (err) {
      toast.error(getErrorMessage(err))
    }
  }

  if (!items.length && !pickupDetails.pickUpName) {
    return (
      <div className="container py-5">
        <div className="text-center py-5">
          <h4 className="text-muted">No items to checkout</h4>
          <p className="text-muted">Add items to your cart first.</p>
          <button
            className="btn btn-primary mt-3"
            onClick={() => navigate(ROUTES.CART)}
          >
            View Cart
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-4">
      <h2 className="mb-4">Checkout</h2>

      <div className="row">
        <div className="col-12 col-lg-8">
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title mb-3">Order Summary</h5>
              {items.map(({ menuItem, quantity }) => (
                <div
                  key={menuItem.id}
                  className="d-flex align-items-center gap-3 py-2 border-bottom"
                >
                  <img
                    src={getImageUrl(menuItem.image)}
                    alt={menuItem.name}
                    className="rounded"
                    style={{
                      width: "50px",
                      height: "50px",
                      objectFit: "cover",
                    }}
                    onError={(e) => {
                      e.target.src = "https://placehold.co/100"
                    }}
                  />
                  <div className="flex-grow-1">
                    <strong>{menuItem.name}</strong>
                    <span className="text-muted ms-2">x {quantity}</span>
                  </div>
                  <strong>${(menuItem.price * quantity).toFixed(2)}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Pickup Details</h5>
              <p className="mb-1"><strong>{pickupDetails.pickUpName}</strong></p>
              <p className="mb-1 text-muted small">{pickupDetails.pickUpPhoneNumber}</p>
              <p className="mb-3 text-muted small">{pickupDetails.pickUpEmail}</p>
              <hr />
              <div className="d-flex justify-content-between mb-2">
                <span>Total ({cartCount} items)</span>
                <strong>${subtotal.toFixed(2)}</strong>
              </div>
              <button
                className="btn btn-primary w-100 mt-3"
                onClick={handlePlaceOrder}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="spinner-border spinner-border-sm me-2" />
                ) : null}
                Place Order
              </button>
              <button
                className="btn btn-outline-secondary w-100 mt-2"
                onClick={() => navigate(ROUTES.CART)}
              >
                Back to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
