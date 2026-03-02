import { NavLink, useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { selectCartCount } from "../../store/slices/cartSlice"
import { selectUser, selectIsAuthenticated, logout } from "../../store/slices/authSlice"
import { selectTheme, toggleTheme } from "../../store/slices/themeSlice"
import { ROUTES } from "../../utility/constants"

export default function Header() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const cartCount = useSelector(selectCartCount)
  const user = useSelector(selectUser)
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const theme = useSelector(selectTheme)

  const handleLogout = () => {
    dispatch(logout())
    navigate(ROUTES.HOME)
  }

  return (
    <div>
      <nav
        className="navbar navbar-expand-lg border-bottom"
        style={{
          background: theme === "dark" ? "rgba(26,26,46,0.9)" : "rgba(255,255,255,0.9)",
          backdropFilter: "blur(12px)",
          borderColor: theme === "dark" ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
        }}
      >
        <div className="container py-2">
          <NavLink
            to={ROUTES.HOME}
            className="navbar-brand d-flex align-items-center gap-2"
            style={{ fontSize: "1.4rem" }}
          >
            <span style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, #e07a5f, #f4a896)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <i className="bi bi-fire text-white" style={{ fontSize: "1.1rem" }} />
            </span>
            <span className="fw-bold">Dishify</span>
          </NavLink>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#mainNav"
            aria-controls="mainNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="mainNav">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <NavLink to={ROUTES.ORDER_MANAGEMENT} className="nav-link">
                  {user?.role?.toLowerCase() === "admin" ? "Order Management" : "My Orders"}
                </NavLink>
              </li>
            </ul>
            <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-1">
              <li className="nav-item me-lg-2">
                <button
                  className="btn btn-link nav-link p-0"
                  onClick={() => dispatch(toggleTheme())}
                  title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
                  aria-label="Toggle theme"
                >
                  <i className={`bi ${theme === "light" ? "bi-moon-stars" : "bi-sun"} fs-5`} />
                </button>
              </li>
              <li className="nav-item me-lg-2">
                <NavLink
                  to={ROUTES.CART}
                  className="nav-link position-relative d-flex align-items-center justify-content-center border-0 rounded-circle"
                  style={{ width: "44px", height: "44px", background: "rgba(224, 122, 95, 0.12)", color: "#e07a5f" }}
                >
                  <i className="bi bi-cart3 fs-5"></i>
                  {cartCount > 0 && (
                    <span
                      className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger text-white shadow-sm"
                      style={{ fontSize: "0.7rem" }}
                    >
                      {cartCount}
                    </span>
                  )}
                </NavLink>
              </li>

              {isAuthenticated && user ? (
                <li className="nav-item dropdown">
                  <button
                    className="nav-link dropdown-toggle btn btn-link d-flex align-items-center gap-2"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <i className="bi bi-person-circle fs-5 text-primary"></i>
                    <span className="text-truncate" style={{ maxWidth: "120px" }}>
                      Hello, {user.fullname || user.email?.split("@")[0] || "User"}
                    </span>
                  </button>
                  <ul
                    className="dropdown-menu dropdown-menu-end shadow border rounded-3 p-2 small"
                    style={{
                      minWidth: "220px",
                      "--bs-dropdown-link-active-bg":
                        "rgba(var(--bs-primary-rgb), .12)",
                      "--bs-dropdown-link-active-color": "var(--bs-body-color)",
                      "--bs-dropdown-link-hover-bg":
                        "rgba(var(--bs-primary-rgb), .08)",
                    }}
                  >
                    <li>
                      <NavLink
                        to={ROUTES.ORDER_MANAGEMENT}
                        className="dropdown-item d-flex align-items-center gap-2 rounded-2"
                      >
                        <i className="bi bi-receipt text-primary"></i>
                        <span>{user?.role?.toLowerCase() === "admin" ? "Order Management" : "My Orders"}</span>
                      </NavLink>
                    </li>
                    {user?.role?.toLowerCase() === "admin" && (
                      <li>
                        <NavLink
                          to={ROUTES.MENU_MANAGEMENT}
                          className="dropdown-item d-flex align-items-center gap-2 rounded-2"
                        >
                          <i className="bi bi-list-ul text-primary"></i>
                          <span>Menu Management</span>
                        </NavLink>
                      </li>
                    )}
                    <li>
                      <hr className="dropdown-divider my-2" />
                    </li>
                    <li>
                      <button
                        className="dropdown-item d-flex align-items-center gap-2 text-danger rounded-2"
                        onClick={handleLogout}
                      >
                        <i className="bi bi-box-arrow-right"></i>
                        <span>Logout</span>
                      </button>
                    </li>
                  </ul>
                </li>
              ) : (
                <>
                  <li className="nav-item">
                    <NavLink to={ROUTES.LOGIN} className="nav-link">
                      Login
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink to={ROUTES.REGISTER} className="nav-link">
                      Register
                    </NavLink>
                  </li>
                </>
              )}
            </ul>
        </div>
      </div>
    </nav>
    </div>
  )
}
