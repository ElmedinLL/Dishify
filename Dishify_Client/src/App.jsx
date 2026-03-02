import { useEffect } from "react"
import { useSelector } from "react-redux"
import { selectTheme } from "./store/slices/themeSlice"
import AppRoutes from "./router/AppRouter"
import Header from "./components/layout/Header"
import Footer from "./components/layout/Footer"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

function App() {
  const theme = useSelector(selectTheme)
  const isDark = theme === "dark"

  useEffect(() => {
    document.documentElement.setAttribute("data-bs-theme", theme)
  }, [theme])

  return (
    <div
      className={`d-flex flex-column min-vh-100 ${isDark ? "text-light" : ""}`}
      data-bs-theme={theme}
      style={{
        background: isDark
          ? "linear-gradient(160deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)"
          : "linear-gradient(160deg, #ffffff 0%, #fefefe 30%, #fcfcfc 60%, #fafafa 100%)",
        minHeight: "100vh",
      }}
    >
     <Header/>
     <main className="flex-grow-1">
     <AppRoutes/>
     </main>
     <Footer/>
     <ToastContainer position="top-right" autoClose={3000} theme="colored" />
    </div>
  )
}

export default App
