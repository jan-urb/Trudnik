import { Link } from "react-router-dom"

const NotFoundPage = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <h1 className="font-mono text-6xl font-black text-ink mb-4">404</h1>
            <p className="text-lg text-ink-light mb-6">Ta stran ne obstaja.</p>
            <Link to="/" className="bg-primary/80 hover:bg-primary/70 px-8 py-3 rounded-xl text-base font-medium cursor-pointer transition-colors">
                ← Nazaj domov
            </Link>
        </div>
    )
}

export default NotFoundPage