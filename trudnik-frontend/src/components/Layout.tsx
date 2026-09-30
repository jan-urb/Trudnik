import { Outlet } from "react-router-dom"
import NavBar from "./NavBar"
import CookieBanner from "./CookieBanner"
import Footer from "./Footer"

const Layout = () => {
    return (
        <div className="min-h-screen flex flex-col">
            <NavBar />
            <div className="px-10 py-5">
                <Outlet />
            </div>
            <CookieBanner />
            <Footer />
        </div>
    )
}

export default Layout