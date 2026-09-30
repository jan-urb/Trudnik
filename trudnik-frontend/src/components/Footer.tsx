import { Mail } from 'lucide-react';
import { Separator } from "@/components/ui/separator"
import { Link } from "react-router-dom"


const Footer = () => {
    return (
        <div className="mt-auto w-full border-t h-auto py-6 flex items-center justify-center">
            <div className="flex flex-col md:flex-row gap-2">
                <p className="font-mono text-sm">© {new Date().getFullYear()} Kariernik. Vse pravice pridržane.</p>
                <Separator orientation="vertical" />
                <div className="flex flex-row items-center gap-1">
                    <Mail className="h-4 w-4" />
                    <p className="font-mono text-sm">
                        kariernik@protonmail.com
                    </p>
                </div>
                <Separator orientation="vertical" />
                <Link to="/tos" className="font-mono text-sm hover:text-foreground transition-colors">
                    Pogoji uporabe
                </Link>
                <Separator orientation="vertical" />
                <Link to="/cookie-policy" className="font-mono text-sm hover:text-foreground transition-colors">
                    Politika piškotkov
                </Link>
            </div>
        </div>
    )
}

export default Footer