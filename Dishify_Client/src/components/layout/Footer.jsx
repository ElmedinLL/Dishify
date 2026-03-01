import { useSelector } from "react-redux"
import { selectTheme } from "../../store/slices/themeSlice"

export default function Footer() {
  const theme = useSelector(selectTheme)
  const isDark = theme === "dark"

  return (
    <footer
      className="mt-auto py-4 border-top"
      style={{
        background: isDark ? "rgba(26,26,46,0.6)" : "rgba(255,255,255,0.7)",
        backdropFilter: "blur(8px)",
        borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
      }}
    >
      <div className="container">
        <div className="row align-items-center">
          <div className="col-md-6 text-center text-md-start mb-2 mb-md-0">
            <span className="text-muted small fw-500">
              © {new Date().getFullYear()} Dishify. Crafted with care.
            </span>
          </div>
          <div className="col-md-6 text-center text-md-end">
            <span className="text-muted small fw-500">Made by Elmedin</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
