import { useLocation, Link } from "react-router-dom"
import { ROUTES } from "../../utility/constants"

export default function OrderConfirmation() {
  const location = useLocation()
  const orderId = location.state?.orderId

  return (
    <div className="container py-5">
      <div className="text-center py-5">
        <div style={{ width: 80, height: 80, borderRadius: "50%", background: "linear-gradient(135deg, #81b29a, #5a9a7a)", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: "1.5rem" }}>
          <i className="bi bi-check-lg text-white" style={{ fontSize: "2.5rem" }} />
        </div>
        <h2 className="mt-3 fw-bold" style={{ letterSpacing: "-0.02em" }}>Order Confirmed!</h2>
        <p className="lead text-muted">
          Thank you for your order.
          {orderId && (
            <span className="d-block mt-2">
              Order ID: <strong>#{orderId}</strong>
            </span>
          )}
        </p>
        <Link to={ROUTES.HOME} className="btn btn-primary mt-3">
          Continue Shopping
        </Link>
        <Link
          to={ROUTES.ORDER_MANAGEMENT}
          className="btn btn-outline-secondary mt-3 ms-2"
        >
          View My Orders
        </Link>
      </div>
    </div>
  )
}
