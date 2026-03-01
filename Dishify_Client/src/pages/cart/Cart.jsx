import { useSelector, useDispatch } from "react-redux"
import {
  selectCartItems,
  selectCartSubtotal,
  selectCartCount,
  updateQuantity,
  removeFromCart,
} from "../../store/slices/cartSlice"
import { selectPickupDetails, setPickupDetails } from "../../store/slices/checkoutSlice"
import { Link, useNavigate } from "react-router-dom"
import { ROUTES } from "../../utility/constants"
import { getImageUrl } from "../../utility/constants"

export default function Cart() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const items = useSelector(selectCartItems)
  const subtotal = useSelector(selectCartSubtotal)
  const cartCount = useSelector(selectCartCount)
  const pickupDetails = useSelector(selectPickupDetails)

  const handleQuantityChange = (menuItemId, newQuantity) => {
    dispatch(updateQuantity({ menuItemId, quantity: newQuantity }))
  }

  const handleRemove = (menuItemId) => {
    dispatch(removeFromCart(menuItemId))
  }

  const handlePickupChange = (e) => {
    const { name, value } = e.target
    dispatch(setPickupDetails({ [name]: value }))
  }

  const handleProceedToCheckout = () => {
    if (!pickupDetails.pickUpName?.trim()) return
    if (!pickupDetails.pickUpPhoneNumber?.trim()) return
    if (!pickupDetails.pickUpEmail?.trim()) return
    navigate(ROUTES.CHECKOUT)
  }

  const isFormValid =
    pickupDetails.pickUpName?.trim() &&
    pickupDetails.pickUpPhoneNumber?.trim() &&
    pickupDetails.pickUpEmail?.trim()

  if (!items.length) {
    return (
      <div className="container py-5">
        <div className="text-center py-5 empty-state">
          <i className="bi bi-cart-x empty-state-icon" style={{ fontSize: "4rem" }} />
          <h4 className="mt-3 fw-bold">Your cart is empty</h4>
          <p className="text-muted mb-4">Add some delicious items from our menu!</p>
          <Link to={ROUTES.HOME} className="btn btn-primary px-4 py-3" style={{ borderRadius: 12 }}>
            Browse Menu
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-5">
      <h2 className="mb-4 fw-bold" style={{ letterSpacing: "-0.02em" }}>Shopping Cart <span className="text-muted fw-normal fs-6">({cartCount} items)</span></h2>

      <div className="row">
        <div className="col-12 col-lg-8">
          <div className="card mb-4" style={{ borderRadius: 16, overflow: "hidden" }}>
            <div className="card-body p-0">
              {items.map(({ menuItem, quantity }) => (
                <div
                  key={menuItem.id}
                  className="d-flex align-items-center gap-3 p-4 border-bottom"
                  style={{ borderColor: "rgba(0,0,0,0.06)" }}
                >
                  <img
                    src={getImageUrl(menuItem.image)}
                    alt={menuItem.name}
                    className="rounded"
                    style={{
                      width: "80px",
                      height: "80px",
                      objectFit: "cover",
                    }}
                    onError={(e) => {
                      e.target.src = "https://placehold.co/100"
                    }}
                  />
                  <div className="flex-grow-1">
                    <h6 className="mb-1">{menuItem.name}</h6>
                    <p className="text-muted small mb-0">
                      ${menuItem.price?.toFixed(2)} each
                    </p>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() =>
                        handleQuantityChange(menuItem.id, quantity - 1)
                      }
                    >
                      -
                    </button>
                    <span className="fw-bold" style={{ minWidth: "2rem" }}>
                      {quantity}
                    </span>
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() =>
                        handleQuantityChange(menuItem.id, quantity + 1)
                      }
                    >
                      +
                    </button>
                  </div>
                  <div className="text-end" style={{ minWidth: "80px" }}>
                    <strong>
                      ${(menuItem.price * quantity).toFixed(2)}
                    </strong>
                  </div>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleRemove(menuItem.id)}
                    title="Remove"
                  >
                    <i className="bi bi-trash" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-4">
          <div className="card mb-4" style={{ borderRadius: 16 }}>
            <div className="card-body">
              <h5 className="card-title mb-3 fw-bold">Pickup Details</h5>
              <form onSubmit={(e) => { e.preventDefault(); handleProceedToCheckout(); }}>
                <div className="mb-3">
                  <label className="form-label">Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="pickUpName"
                    value={pickupDetails.pickUpName}
                    onChange={handlePickupChange}
                    placeholder="Your name"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Phone *</label>
                  <input
                    type="tel"
                    className="form-control"
                    name="pickUpPhoneNumber"
                    value={pickupDetails.pickUpPhoneNumber}
                    onChange={handlePickupChange}
                    placeholder="Phone number"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email *</label>
                  <input
                    type="email"
                    className="form-control"
                    name="pickUpEmail"
                    value={pickupDetails.pickUpEmail}
                    onChange={handlePickupChange}
                    placeholder="Email address"
                    required
                  />
                </div>
              </form>
            </div>
          </div>

          <div className="card" style={{ borderRadius: 16 }}>
            <div className="card-body">
              <h5 className="card-title fw-bold">Order Summary</h5>
              <hr />
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal ({cartCount} items)</span>
                <strong>${subtotal.toFixed(2)}</strong>
              </div>
              <hr />
              <div className="d-flex justify-content-between fw-bold fs-5">
                <span>Total</span>
                <span className="text-primary">${subtotal.toFixed(2)}</span>
              </div>
              <button
                className="btn btn-primary w-100 mt-3 py-3"
                style={{ borderRadius: 12 }}
                onClick={handleProceedToCheckout}
                disabled={!isFormValid}
              >
                Proceed to Checkout
              </button>
              <Link
                to={ROUTES.HOME}
                className="btn btn-outline-secondary w-100 mt-2"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
