import { useState, useMemo } from "react"
import { useGetMenuItemQuery } from "../store/api/menuItemApi"
import { useDispatch } from "react-redux"
import { addToCart } from "../store/slices/cartSlice"
import { Link } from "react-router-dom"
import { ROUTES } from "../utility/constants"
import { getImageUrl } from "../utility/constants"
import { toast } from "react-toastify"
import Rating from "../components/Rating"

const CATEGORIES = ["All", "Appetizer", "Entrée", "Dessert"]

export default function Home() {
  const dispatch = useDispatch()
  const { data: menuItems = [], error, isLoading } = useGetMenuItemQuery()
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [searchTerm, setSearchTerm] = useState("")

  const handleAddToCart = (e, item) => {
    e.preventDefault()
    e.stopPropagation()
    dispatch(addToCart({ menuItem: item, quantity: 1 }))
    toast.success(`Added ${item.name} to cart`)
  }

  const topRatedItems = useMemo(() => {
    return [...menuItems]
      .filter((i) => i.rating > 0)
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 5)
  }, [menuItems])

  const filteredItems = useMemo(() => {
    let items = menuItems
    if (selectedCategory && selectedCategory !== "All") {
      items = items.filter((i) => i.category === selectedCategory)
    }
    if (searchTerm?.trim()) {
      const term = searchTerm.toLowerCase()
      items = items.filter(
        (i) =>
          i.name?.toLowerCase().includes(term) ||
          i.description?.toLowerCase().includes(term)
      )
    }
    return items
  }, [menuItems, selectedCategory, searchTerm])

  return (
    <div className="container-fluid py-5 px-4">
      {/* Hero */}
      <div
        className="text-center py-5 mb-5 rounded-4"
        style={{
          background: "linear-gradient(135deg, rgba(224,122,95,0.08) 0%, rgba(129,178,154,0.06) 100%)",
          border: "1px solid rgba(224,122,95,0.15)",
        }}
      >
        <h1 className="display-5 fw-bold mb-2" style={{ letterSpacing: "-0.03em" }}>
          Welcome to Dishify
        </h1>
        <p className="lead text-muted mb-0" style={{ fontSize: "1.15rem", maxWidth: 480, margin: "0 auto" }}>
          Discover our delicious menu and order your favorites for pickup
        </p>
      </div>

      {/* Savor Every Bite Hero */}
      <div
        className="row align-items-center rounded-4 overflow-hidden mb-5 position-relative"
        style={{
          background: "linear-gradient(135deg, #f8e8e4 0%, #f5d5ce 30%, #e8b4a8 70%, #e07a5f 100%)",
          minHeight: 380,
          boxShadow: "0 20px 60px rgba(224, 122, 95, 0.2)",
        }}
      >
        <div className="col-12 col-lg-7 p-5">
          <span
            className="badge mb-3 px-3 py-2 d-inline-flex align-items-center gap-2"
            style={{ background: "#ffd54f", color: "#2d3142", fontSize: "0.85rem", fontWeight: 600 }}
          >
            <i className="bi bi-fire" />
            Fresh & Hot
          </span>
          <h1 className="display-4 fw-bold mb-3 text-white" style={{ letterSpacing: "-0.03em", lineHeight: 1.2 }}>
            Savor Every <span style={{ color: "#ffd54f" }}>Bite</span>
          </h1>
          <p className="text-white mb-4" style={{ fontSize: "1.1rem", opacity: 0.95 }}>
            Experience culinary excellence with our carefully crafted dishes. Made{" "}
            <span style={{ color: "#ffd54f", fontWeight: 600 }}>fresh daily</span>, served with passion.
          </p>
          <ul className="list-unstyled mb-4">
            <li className="d-flex align-items-center gap-2 mb-2 text-white">
              <i className="bi bi-check-circle-fill" style={{ color: "#81b29a", fontSize: "1.2rem" }} />
              Fresh Ingredients Daily
            </li>
            <li className="d-flex align-items-center gap-2 text-white">
              <i className="bi bi-check-circle-fill" style={{ color: "#81b29a", fontSize: "1.2rem" }} />
              Quick Pickup Service
            </li>
          </ul>
          <a
            href="#menu"
            className="btn d-inline-flex align-items-center gap-2 px-4 py-3"
            style={{ background: "#ffd54f", color: "#2d3142", fontWeight: 700, borderRadius: 12 }}
          >
            <i className="bi bi-cart3" />
            Order Now
          </a>
        </div>
        <div className="col-12 col-lg-5 p-4 d-none d-lg-block">
          <div
            className="rounded-4 p-4 h-100"
            style={{
              background: "rgba(255,255,255,0.25)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.4)",
            }}
          >
            <div className="d-flex align-items-center gap-2 mb-3">
              <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: 48, height: 48, background: "#ffd54f" }}>
                <i className="bi bi-cup-hot text-dark" style={{ fontSize: "1.5rem" }} />
              </div>
              <h5 className="fw-bold text-white mb-0">Fresh & Delicious</h5>
            </div>
            <p className="text-white small mb-4" style={{ opacity: 0.95 }}>
              Every dish is prepared with the freshest ingredients and utmost care.
            </p>
            <div className="d-flex gap-4">
              <div>
                <div className="fw-bold text-white" style={{ fontSize: "1.5rem" }}>{menuItems.length > 0 ? menuItems.length : "50"}+</div>
                <div className="text-white small" style={{ opacity: 0.9 }}>Dishes</div>
              </div>
              <div>
                <div className="fw-bold" style={{ fontSize: "1.5rem", color: "#ffd54f" }}>15min</div>
                <div className="text-white small" style={{ opacity: 0.9 }}>Pickup Time</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Rated Carousel */}
      {topRatedItems.length > 0 && (
        <div className="mb-5">
          <h4 className="mb-4 fw-bold" style={{ letterSpacing: "-0.02em" }}>Top Rated</h4>
          <div
            id="topRatedCarousel"
            className="carousel slide"
            data-bs-ride="carousel"
          >
            <div className="carousel-inner">
              {topRatedItems.map((item, index) => (
                <div
                  key={item.id}
                  className={`carousel-item ${index === 0 ? "active" : ""}`}
                >
                  <Link
                    to={ROUTES.getMenuItemDetailUrl(item.id)}
                    className="text-decoration-none text-dark d-block"
                  >
                    <div className="row align-items-center rounded-4 p-4 shadow-sm" style={{ background: "var(--color-card)", transition: "transform 0.2s" }}>
                      <div className="col-md-4">
                        <img
                          src={getImageUrl(item.image)}
                          className="img-fluid rounded"
                          alt={item.name}
                          style={{ maxHeight: "200px", objectFit: "cover" }}
                          onError={(e) => { e.target.src = "https://placehold.co/400x200" }}
                        />
                      </div>
                      <div className="col-md-8">
                        <h5>{item.name}</h5>
                        {item.rating > 0 && (
                          <div className="d-flex align-items-center gap-2">
                            <Rating value={item.rating} readonly size="1.2rem" />
                            <span className="text-muted small">{item.rating?.toFixed(1)}</span>
                          </div>
                        )}
                        <p className="text-muted mb-0 mt-2">{item.description?.slice(0, 120)}...</p>
                        <strong className="text-primary mt-2 d-block">${item.price?.toFixed(2)}</strong>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
            {topRatedItems.length > 1 && (
              <>
                <button
                  className="carousel-control-prev"
                  type="button"
                  data-bs-target="#topRatedCarousel"
                  data-bs-slide="prev"
                >
                  <span className="carousel-control-prev-icon" aria-hidden="true" />
                  <span className="visually-hidden">Previous</span>
                </button>
                <button
                  className="carousel-control-next"
                  type="button"
                  data-bs-target="#topRatedCarousel"
                  data-bs-slide="next"
                >
                  <span className="carousel-control-next-icon" aria-hidden="true" />
                  <span className="visually-hidden">Next</span>
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Filters */}
      <div id="menu" className="row mb-4 align-items-end">
        <div className="col-12 col-md-6 mb-3 mb-md-0">
          <label className="form-label small text-uppercase fw-bold text-muted mb-2">Search</label>
          <input
            type="text"
            className="form-control form-control-lg"
            placeholder="Search menu items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ borderRadius: 12 }}
          />
        </div>
        <div className="col-12 col-md-6">
          <label className="form-label small text-uppercase fw-bold text-muted mb-2 d-block">Category</label>
          <div className="d-flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`btn ${selectedCategory === cat ? "btn-primary" : "btn-outline-secondary"}`}
                onClick={() => setSelectedCategory(cat)}
                style={{ borderRadius: 10 }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Items Grid */}
      <div className="row">
        {isLoading ? (
          <div className="col-12 text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2">Loading menu items...</p>
          </div>
        ) : error ? (
          <div className="col-12">
            <div className="alert alert-danger">
              <h5>Error Loading Menu</h5>
              <p>Unable to load menu items. Please try again later.</p>
            </div>
          </div>
        ) : !filteredItems.length ? (
          <div className="col-12 text-center py-5">
            <i className="bi bi-basket text-muted" style={{ fontSize: "3rem" }} />
            <h4 className="mt-3 text-muted">No menu items found</h4>
            <p className="text-muted">
              {selectedCategory !== "All" || searchTerm
                ? "Try adjusting your filters."
                : "Check back soon for our menu."}
            </p>
          </div>
        ) : (
          filteredItems.map((item) => (
            <div key={item.id} className="col-12 col-sm-6 col-lg-4 col-xl-3 mb-4">
              <div className="card h-100 menu-card" style={{ borderRadius: 16, overflow: "hidden" }}>
                <Link
                  to={ROUTES.getMenuItemDetailUrl(item.id)}
                  className="text-decoration-none text-dark"
                >
                  <div className="position-relative overflow-hidden">
                    <img
                      src={getImageUrl(item.image)}
                      className="card-img-top"
                      style={{ height: "200px", objectFit: "cover", transition: "transform 0.3s" }}
                      alt={item.name}
                      onError={(e) => {
                        e.target.src = "https://placehold.co/400x200"
                      }}
                    />
                    <button
                      type="button"
                      className="btn btn-primary position-absolute bottom-0 end-0 m-3 rounded-circle shadow"
                      style={{ width: 44, height: 44, padding: 0 }}
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        handleAddToCart(e, item)
                      }}
                      title="Add to cart"
                    >
                      <i className="bi bi-cart-plus fs-5" />
                    </button>
                    {item.specialTag && (
                      <span
                        className="position-absolute top-0 start-0 m-3 badge"
                        style={{ background: "rgba(224,122,95,0.95)", fontSize: "0.7rem" }}
                      >
                        {item.specialTag}
                      </span>
                    )}
                  </div>
                  <div className="card-body d-flex flex-column p-4">
                    <span className="badge bg-light text-dark mb-2 align-self-start" style={{ fontSize: "0.7rem" }}>
                      {item.category}
                    </span>
                    <h5 className="card-title mb-1 fw-bold" style={{ lineHeight: 1.3 }}>{item.name}</h5>
                    {item.rating > 0 && (
                      <div className="d-flex align-items-center gap-2 mb-2">
                        <Rating value={item.rating} readonly size="0.9rem" />
                        <span className="text-muted small">{item.rating?.toFixed(1)}</span>
                      </div>
                    )}
                    <p className="card-text text-muted small flex-grow-1 mb-3" style={{ lineHeight: 1.5, fontSize: "0.9rem" }}>
                      {item.description?.slice(0, 75)}
                      {item.description?.length > 75 ? "..." : ""}
                    </p>
                    <div className="d-flex justify-content-between align-items-center mt-auto">
                      <strong style={{ color: "var(--color-primary)", fontSize: "1.1rem" }}>
                        ${item.price?.toFixed(2)}
                      </strong>
                    </div>
                  </div>
                </Link>
                <div className="p-4 pt-0">
                  <Link
                    to={ROUTES.getMenuItemDetailUrl(item.id)}
                    className="btn btn-outline-primary btn-sm w-100"
                    style={{ borderRadius: 10 }}
                  >
                    <i className="bi bi-info-circle me-1" />
                    Details
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Why Choose Dishify */}
      <div
        className="why-choose-section mt-5 pt-5 pb-5 px-4"
        style={{
          border: "3px solid rgba(224,122,95,0.25)",
          borderRadius: 24,
          background: "linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(250,249,247,0.95) 100%)",
          boxShadow: "0 8px 32px rgba(224,122,95,0.08)",
        }}
      >
        <div className="text-center mb-5">
          <h2 className="fw-bold mb-2" style={{ letterSpacing: "-0.03em", fontSize: "1.75rem" }}>
            Why Choose Dishify
          </h2>
          <p className="text-muted mb-0" style={{ maxWidth: 480, margin: "0 auto" }}>
            We're committed to delivering an exceptional dining experience from order to pickup.
          </p>
        </div>
        <div className="row g-4 justify-content-center">
          <div className="col-12 col-md-6 col-lg-4">
            <div
              className="card h-100 text-center p-4 position-relative overflow-hidden why-choose-card"
              style={{
                borderRadius: 16,
                border: "2px solid rgba(224,122,95,0.2)",
                boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
              }}
            >
              <div
                className="mb-3 mx-auto rounded-circle d-flex align-items-center justify-content-center"
                style={{ width: 72, height: 72, background: "linear-gradient(135deg, rgba(224,122,95,0.15), rgba(129,178,154,0.1))" }}
              >
                <i className="bi bi-egg-fried text-primary" style={{ fontSize: "2rem" }} />
              </div>
              <h5 className="fw-bold mb-2" style={{ letterSpacing: "-0.02em" }}>Quality Food</h5>
              <p className="text-muted mb-0 small" style={{ lineHeight: 1.6 }}>
                Fresh ingredients and expert preparation for every dish. We take pride in serving the best.
              </p>
            </div>
          </div>
          <div className="col-12 col-md-6 col-lg-4">
            <div
              className="card h-100 text-center p-4 position-relative overflow-hidden why-choose-card"
              style={{
                borderRadius: 16,
                border: "2px solid rgba(224,122,95,0.2)",
                boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
              }}
            >
              <div
                className="mb-3 mx-auto rounded-circle d-flex align-items-center justify-content-center"
                style={{ width: 72, height: 72, background: "linear-gradient(135deg, rgba(224,122,95,0.15), rgba(129,178,154,0.1))" }}
              >
                <i className="bi bi-lightning-charge text-primary" style={{ fontSize: "2rem" }} />
              </div>
              <h5 className="fw-bold mb-2" style={{ letterSpacing: "-0.02em" }}>Fast Pickup</h5>
              <p className="text-muted mb-0 small" style={{ lineHeight: 1.6 }}>
                Order ahead and pick up when ready. Quick turnaround so your food is hot and fresh.
              </p>
            </div>
          </div>
          <div className="col-12 col-md-6 col-lg-4">
            <div
              className="card h-100 text-center p-4 position-relative overflow-hidden why-choose-card"
              style={{
                borderRadius: 16,
                border: "2px solid rgba(224,122,95,0.2)",
                boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
              }}
            >
              <div
                className="mb-3 mx-auto rounded-circle d-flex align-items-center justify-content-center"
                style={{ width: 72, height: 72, background: "linear-gradient(135deg, rgba(224,122,95,0.15), rgba(129,178,154,0.1))" }}
              >
                <i className="bi bi-heart text-primary" style={{ fontSize: "2rem" }} />
              </div>
              <h5 className="fw-bold mb-2" style={{ letterSpacing: "-0.02em" }}>Great Service</h5>
              <p className="text-muted mb-0 small" style={{ lineHeight: 1.6 }}>
                Friendly staff and a smooth ordering experience. Your satisfaction is our priority.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
