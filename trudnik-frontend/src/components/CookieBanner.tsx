import { Cookie } from "lucide-react"
import { Button } from "./ui/button"
import { useState } from "react";
import { usePostHog } from '@posthog/react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Link } from "react-router-dom"

const CookieBanner = () => {
    const posthog = usePostHog();
    const [consentGiven, setConsentGiven] = useState(posthog.get_explicit_consent_status());

    const handleAcceptCookies = () => {
        posthog.opt_in_capturing();
        setConsentGiven('granted');
    };

    const handleDeclineCookies = () => {
        posthog.opt_out_capturing();
        setConsentGiven('denied');
    };

    return (
        <>
            {consentGiven === 'pending' && (
                <div className="fixed bottom-0 w-full sm:w-fit left-0 sm:left-auto right-0 sm:right-5">
                    <Card className="m-3 shadow-lg">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-lg">Uporabljamo piškotke</CardTitle>
                            <Cookie className="h-5 w-5" />
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <CardDescription className="text-sm">
                                Ta stran uporablja piškotke za izboljšanje vaše izkušnje.
                            </CardDescription>
                            <p className="text-xs text-muted-foreground">
                                S klikom na <span className="font-medium">"Sprejmi"</span> se strinjate z uporabo piškotkov.
                            </p>
                            <Link
                                to="/cookie-policy"
                                className="text-xs text-primary underline underline-offset-4 hover:no-underline"
                            >
                                Več o piškotkih
                            </Link>
                        </CardContent>
                        <CardFooter className="flex gap-2 pt-2">
                            <Button
                                onClick={handleDeclineCookies}
                                variant="secondary"
                                className="flex-1"
                            >
                                Zavrni
                            </Button>
                            <Button
                                onClick={handleAcceptCookies}
                                className="flex-1"
                            >
                                Sprejmi
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            )}
        </>
    )
}

export default CookieBanner