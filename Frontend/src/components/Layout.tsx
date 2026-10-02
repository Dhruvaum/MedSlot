import Header from "./Header"
import Footer from "./Footer"
import { Outlet } from "react-router-dom"
import { Toaster } from "sonner"
import BackgroundDecoration from "./BackgroundDecoration"

const Layout = () => {
  return (
    <>
      <BackgroundDecoration />
      <Toaster richColors position="top-right" />
      <Header />
      <Outlet />
      <Footer />
    </>
  )
}

export default Layout