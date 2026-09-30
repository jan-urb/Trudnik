import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { TriangleAlert } from 'lucide-react';

const AiNotice = () => {
    return (
        <Alert className="max-w-md border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-50">
            <TriangleAlert />
            <AlertTitle className="font-mono text-sm">Obvestilo!</AlertTitle>
            <AlertDescription className="font-mono text-xs">
                Podatki o delovnih mestih in podjetjih so pridobljeni in obdelani s pomočjo umetne inteligence, zato lahko vsebujejo napake.
            </AlertDescription>
        </Alert>
    )
}

export default AiNotice