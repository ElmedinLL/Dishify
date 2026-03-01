import { useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useLoginMutation } from "../../store/api/authApi"
import { useDispatch } from "react-redux"
import { setUser } from "../../store/slices/authSlice"
import { setToken, getStoredUser } from "../../utility/jwtHelper"
import { getErrorMessage } from "../../utility/helperFunc"
import { toast } from "react-toastify"
import { ROUTES } from "../../utility/constants"

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  const getRedirectPath = () => {
    const fromState = location.state?.from
    if (fromState?.pathname) return fromState.pathname
    try {
      return sessionStorage.getItem("redirectAfterLogin")
    } catch (e) {}
    return null
  }
  const [login, { isLoading }] = useLoginMutation()

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.email?.trim()) {
      toast.error("Email is required")
      return
    }
    if (!formData.password) {
      toast.error("Password is required")
      return
    }

    try {
      const result = await login(formData).unwrap()
      const data = result?.result || result
      if (data?.token) {
        setToken(data.token)
        const user = getStoredUser()
        dispatch(setUser(user || { email: data.email, role: data.role }))
        toast.success("Login successful!")
        const redirectTo = getRedirectPath() || ROUTES.HOME
        try {
          sessionStorage.removeItem("redirectAfterLogin")
        } catch (e) {}
        navigate(redirectTo, { replace: true })
      } else {
        toast.error("Invalid response from server")
      }
    } catch (err) {
      toast.error(getErrorMessage(err))
    }
  }

  return (
    <div className="container-fluid p-0 min-vh-100">
      <div className="row g-0 min-vh-100">
        {/* Left: Welcome section */}
        <div
          className="col-12 col-lg-6 d-flex flex-column justify-content-center p-5"
          style={{
            background: "linear-gradient(135deg, #f8e8e4 0%, #e8d5e8 40%, #f5d5ce 100%)",
          }}
        >
          <div className="mb-4">
            <div
              className="d-inline-flex align-items-center justify-content-center rounded-3 mb-4"
              style={{ width: 64, height: 64, background: "rgba(59,130,246,0.15)" }}
            >
              <i className="bi bi-basket3 text-primary" style={{ fontSize: "2rem" }} />
            </div>
            <h1 className="display-5 fw-bold mb-3" style={{ letterSpacing: "-0.03em", color: "#2d3142" }}>
              Welcome to Dishify
            </h1>
            <p className="lead text-muted mb-4" style={{ maxWidth: 400 }}>
              Sign in to explore fresh flavors, manage your cart, and place your orders seamlessly.
            </p>
            <ul className="list-unstyled mb-0">
              <li className="d-flex align-items-center gap-2 mb-2">
                <i className="bi bi-check-circle-fill text-primary" />
                <span>Secure account access</span>
              </li>
              <li className="d-flex align-items-center gap-2 mb-2">
                <i className="bi bi-check-circle-fill text-primary" />
                <span>Track past orders</span>
              </li>
              <li className="d-flex align-items-center gap-2">
                <i className="bi bi-check-circle-fill text-primary" />
                <span>Save your favorites</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right: Sign In form */}
        <div className="col-12 col-lg-6 d-flex flex-column justify-content-center align-items-center p-5">
          <div className="card shadow-sm w-100" style={{ maxWidth: 420, borderRadius: 20, border: "none" }}>
            <div className="card-body p-5">
              <h3 className="card-title fw-bold mb-1" style={{ letterSpacing: "-0.02em" }}>Sign In</h3>
              <p className="text-muted small mb-4">Access your account</p>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Email address</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    autoComplete="email"
                    style={{ borderRadius: 10 }}
                  />
                </div>
                <div className="mb-4">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    style={{ borderRadius: 10 }}
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-primary w-100 py-3"
                  style={{ borderRadius: 12 }}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="spinner-border spinner-border-sm me-2" />
                  ) : null}
                  Sign In
                </button>
              </form>
              <p className="text-center mt-4 mb-0">
                No account?{" "}
                <Link to={ROUTES.REGISTER} className="fw-semibold">Create one</Link>
              </p>
              <div className="text-center mt-3">
                <Link to={ROUTES.HOME} className="text-muted small text-decoration-none">
                  <i className="bi bi-arrow-left me-1" />
                  Back to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
