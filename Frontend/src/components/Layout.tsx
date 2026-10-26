import Header from "./Header"
import Footer from "./Footer"
import { Outlet } from "react-router-dom"
import BackgroundDecoration from "./BackgroundDecoration"

const Layout = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <BackgroundDecoration />
      <Header />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
    </div>
  )
}

export default Layout