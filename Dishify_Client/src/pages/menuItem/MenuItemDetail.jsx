import { useParams, useNavigate, Link } from "react-router-dom"
import { useGetMenuItemByIdQuery } from "../../store/api/menuItemApi"
import { useDispatch } from "react-redux"
import { addToCart } from "../../store/slices/cartSlice"
import { ROUTES } from "../../utility/constants"
import { getImageUrl } from "../../utility/constants"
import { useState } from "react"
import { toast } from "react-toastify"
import Rating from "../../components/Rating"

export default function MenuItemDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [quantity, setQuantity] = useState(1)

  const { data: menuItem, error, isLoading } = useGetMenuItemByIdQuery(id, {
    skip: !id,
  })

  const handleAddToCart = () => {
    if (!menuItem) return
    dispatch(addToCart({ menuItem, quantity }))
    toast.success(`Added ${quantity} x ${menuItem.name} to cart`)
    setQuantity(1)
  }

  if (isLoading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading menu item...</p>
      </div>
    )
  }

  if (error || !menuItem) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">
          <h5>Menu item not found</h5>
          <p>This item may have been removed or the link is invalid.</p>
          <button
            className="btn btn-outline-danger"
            onClick={() => navigate(ROUTES.HOME)}
          >
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-5">
      {/* Breadcrumbs */}
      <nav className="mb-4" aria-label="breadcrumb">
        <ol className="breadcrumb mb-0">
          <li className="breadcrumb-item">
            <Link to={ROUTES.HOME} className="text-decoration-none">Home</Link>
          </li>
          <li className="breadcrumb-item">
            <Link to={ROUTES.HOME} className="text-decoration-none">Menu</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">{menuItem.name}</li>
        </ol>
      </nav>

      <div className="row">
        <div className="col-12 col-md-5 mb-4">
          <img
            src={getImageUrl(menuItem.image)}
            className="img-fluid rounded-4 shadow"
            alt={menuItem.name}
            style={{ maxHeight: "420px", width: "100%", objectFit: "cover" }}
            onError={(e) => {
              e.target.src = "https://placehold.co/600x400"
            }}
          />
        </div>
        <div className="col-12 col-md-7">
          <div className="d-flex gap-2 mb-2 flex-wrap">
            <span className="badge bg-light text-dark" style={{ fontSize: "0.8rem" }}>{menuItem.category}</span>
            <span className="badge d-inline-flex align-items-center gap-1" style={{ background: "rgba(129,178,154,0.2)", color: "#2d6a4f", fontSize: "0.8rem" }}>
              <i className="bi bi-check-circle-fill" />
              Available
            </span>
          </div>
          <h1 className="mb-3 fw-bold" style={{ letterSpacing: "-0.03em", lineHeight: 1.2 }}>{menuItem.name}</h1>
          {menuItem.rating > 0 && (
            <div className="d-flex align-items-center gap-2 mb-2">
              <Rating value={menuItem.rating} readonly size="1.2rem" />
              <span className="text-muted small">{menuItem.rating?.toFixed(1)}</span>
            </div>
          )}
          <h3 className="text-primary mb-3">${menuItem.price?.toFixed(2)}</h3>
          <p className="text-muted mb-4">{menuItem.description}</p>

          <div className="mb-3">
            <label className="form-label small text-uppercase fw-bold text-muted">Quantity</label>
            <div className="d-flex align-items-center gap-2">
              <div className="input-group quantity-input" style={{ width: "140px" }}>
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                >
                  -
                </button>
                <input
                  type="number"
                  className="form-control text-center"
                  min="1"
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                  }
                />
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <div className="d-flex flex-column flex-md-row gap-2 mb-3">
            <button
              className="btn btn-primary btn-lg px-5"
              style={{ borderRadius: 12 }}
              onClick={handleAddToCart}
            >
              <i className="bi bi-cart-plus me-2" />
              Add to Cart
            </button>
            <button
              className="btn btn-outline-secondary d-flex align-items-center justify-content-center gap-2"
              style={{ borderRadius: 12 }}
              onClick={() => navigate(ROUTES.HOME)}
            >
              <i className="bi bi-arrow-left" />
              Continue Shopping
            </button>
          </div>

          <div className="mt-4 p-3 rounded-3" style={{ background: "rgba(0,0,0,0.03)" }}>
            <div className="small text-muted">Subtotal ({quantity} item{quantity > 1 ? "s" : ""})</div>
            <div className="fw-bold fs-5">${(menuItem.price * quantity).toFixed(2)}</div>
          </div>

          <div className="d-flex gap-2 mt-3 flex-wrap">
            <span className="badge d-inline-flex align-items-center gap-1 px-3 py-2" style={{ background: "rgba(129,178,154,0.15)", color: "#2d6a4f" }}>
              <i className="bi bi-clock" />
              Ready in 15-20 mins
            </span>
            <span className="badge d-inline-flex align-items-center gap-1 px-3 py-2" style={{ background: "rgba(59,130,246,0.15)", color: "#1d4ed8" }}>
              <i className="bi bi-geo-alt" />
              Free Pickup
            </span>
          </div>
        </div>
      </div>

      {/* Product Information */}
      <div className="card mt-5" style={{ borderRadius: 16, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
        <div className="card-header d-flex align-items-center gap-2 py-3" style={{ background: "var(--color-primary)", color: "white", border: "none", borderRadius: "16px 16px 0 0" }}>
          <i className="bi bi-info-circle" />
          <span className="fw-bold">Product Information</span>
        </div>
        <div className="card-body">
          <div className="row g-3">
            <div className="col-6 col-md-3">
              <div className="text-muted small mb-1">
                <i className="bi bi-tag me-1" />
                Category
              </div>
              <div className="fw-semibold">{menuItem.category}</div>
            </div>
            <div className="col-6 col-md-3">
              <div className="text-muted small mb-1">
                <i className="bi bi-star me-1" />
                Special Tag
              </div>
              <div className="fw-semibold">{menuItem.specialTag || "—"}</div>
            </div>
            <div className="col-6 col-md-3">
              <div className="text-muted small mb-1">
                <i className="bi bi-currency-dollar me-1" />
                Price
              </div>
              <div className="fw-semibold">${menuItem.price?.toFixed(2)}</div>
            </div>
            <div className="col-6 col-md-3">
              <div className="text-muted small mb-1">
                <i className="bi bi-check-circle me-1" />
                Availability
              </div>
              <div className="fw-semibold text-success">In Stock</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
