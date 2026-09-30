import { Link, useLocation } from "react-router-dom"
import { Button } from "./ui/button"
import { Switch } from "./ui/switch"
import { useTheme } from "@/components/theme-provider"

const NavBar = () => {
    const location = useLocation()
    const isCompaniesActive = location.pathname.startsWith("/companies")
    const { setTheme } = useTheme()

    return (
        <nav className="sticky top-0 z-50 bg-primary-foreground/20 backdrop-blur-sm border-b border-accent/40 w-full">
            <div className="flex items-center gap-6 px-6 py-4">
                <Link to="/" className="flex items-center gap-2">
                    <img src="/logo.svg" alt="" className="h-8 w-8" />
                    <h1 className="font-serif text-3xl font-bold tracking-tight text-accent cursor-pointe leading-tight">
                        Kariernik
                    </h1>
                </Link>
                <Button className={`${isCompaniesActive ? "bg-accent/20" : "bg-transparent"} hover:bg-accent/40 text-accent p-2 text-base`}>
                    <Link to="/companies">Podjetja</Link>
                </Button>
                <Switch id="switch-focus-mode" onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")} />
            </div>
        </nav >
    )
}

export default NavBar