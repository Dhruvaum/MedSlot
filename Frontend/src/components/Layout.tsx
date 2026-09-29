import Header from "./Header"
import Footer from "./Footer"
import { Outlet } from "react-router-dom"
import { Toaster } from "sonner"

const Layout = () => {
  return (
    <>
        <Toaster richColors position="top-right"/>
        <Header/>
        <Outlet/>
        <Footer/>
    </>
  )
}

export default Layout