import Header from "./Header"
import Footer from "./Footer"
import { Outlet } from "react-router-dom"
import BackgroundDecoration from "./BackgroundDecoration"

const Layout = () => {
  return (
    <>
      <BackgroundDecoration />
      <Header />
      <Outlet />
      <Footer />
    </>
  )
}

export default Layout