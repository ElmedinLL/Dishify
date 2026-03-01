import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useRegisterMutation } from "../../store/api/authApi"
import { getErrorMessage } from "../../utility/helperFunc"
import { toast } from "react-toastify"
import { ROUTES } from "../../utility/constants"

const ROLES = ["Customer", "Admin"]

export default function Register() {
  const navigate = useNavigate()
  const [register, { isLoading }] = useRegisterMutation()

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "Customer",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.name?.trim()) {
      toast.error("Name is required")
      return
    }
    if (!formData.email?.trim()) {
      toast.error("Email is required")
      return
    }
    if (!formData.password) {
      toast.error("Password is required")
      return
    }
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters")
      return
    }

    try {
      await register(formData).unwrap()
      toast.success("Registration successful! Please log in.")
      navigate(ROUTES.LOGIN)
    } catch (err) {
      toast.error(getErrorMessage(err))
    }
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-6 col-lg-5">
          <div className="card shadow" style={{ borderRadius: 20, border: "none" }}>
            <div className="card-body p-5">
              <h3 className="card-title text-center mb-4 fw-bold" style={{ letterSpacing: "-0.02em" }}>Register</h3>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    autoComplete="name"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    autoComplete="email"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password (min 6 characters)"
                    autoComplete="new-password"
                  />
                </div>
                <div className="mb-4">
                  <label className="form-label">Role</label>
                  <select
                    className="form-select"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                  >
                    {ROLES.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
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
                  Register
                </button>
              </form>
              <p className="text-center mt-3 mb-0">
                Already have an account? <Link to={ROUTES.LOGIN}>Log In</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
