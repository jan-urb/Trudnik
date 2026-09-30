const Tos = () => {
    return (
        <div className="max-w-3xl mx-auto py-10 px-4">
            <h1 className="text-3xl font-serif font-light mb-2">Pogoji uporabe</h1>
            <p className="text-xs font-mono text-muted-foreground mb-8">Veljavno od: 17. 3. 2026</p>

            <section className="mb-8">
                <h2 className="text-lg font-semibold mb-2">1. Sprejetje pogojev</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                    Z dostopom do spletnega mesta Kariernik.com in njegovo uporabo se strinjate s temi pogoji uporabe. Če se s pogoji ne strinjate, vas prosimo, da ne uporabljate naše spletne strani.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-lg font-semibold mb-2">2. Opis storitve</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                    Kariernik.com je spletni portal za iskanje zaposlitve, ki zbira in prikazuje oglase za delovna mesta ter profile podjetij v Sloveniji. Namen portala je olajšati iskanje zaposlitve iskalcem dela in povečati prepoznavnost delodajalcem.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-lg font-semibold mb-2">3. Obveznosti uporabnikov</h2>
                <p className="text-sm text-muted-foreground leading-relaxed mb-2">
                    Kot uporabnik spletnega mesta se zavezujete, da:
                </p>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 leading-relaxed">
                    <li>ne boste zlorabljali ali ovirali delovanja portala,</li>
                    <li>ne boste objavljali lažnih, zavajajočih ali žaljivih vsebin,</li>
                    <li>ne boste uporabljali portala za nezakonite namene,</li>
                    <li>ne boste poskušali pridobiti nepooblaščenega dostopa do sistemov ali podatkov portala,</li>
                    <li>boste spoštovali veljavno slovensko in evropsko zakonodajo.</li>
                </ul>
            </section>

            <section className="mb-8">
                <h2 className="text-lg font-semibold mb-2">4. Točnost podatkov</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                    Kariernik.com si prizadeva zagotavljati točne in ažurne informacije, vendar ne jamči za popolnost, točnost ali aktualnost objavljenih oglasov in podatkov o podjetjih. Podatki o prostih delovnih mestih izhajajo iz javno dostopnih virov. Kariernik.com ne prevzema odgovornosti za morebitne napake ali zastarelost vsebine.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-lg font-semibold mb-2">5. Omejitev odgovornosti</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                    Kariernik.com ne prevzema nikakršne odgovornosti za škodo, ki bi nastala zaradi uporabe ali nezmožnosti uporabe portala, vključno z izgubo podatkov, izgubo zaslužka ali kakršnokoli drugo posredno ali neposredno škodo. Portal je na voljo brez vsakršnih jamstev, bodisi izrecnih ali implicitnih.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-lg font-semibold mb-2">6. Zasebnost in piškotki</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                    Kariernik.com spoštuje vašo zasebnost. Za delovanje portala in analitiko lahko uporabljamo piškotke. Z nadaljnjo uporabo spletnega mesta se strinjate z uporabo piškotkov v skladu z veljavno zakonodajo (GDPR). Vaših osebnih podatkov ne prodajamo tretjim osebam.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-lg font-semibold mb-2">7. Povezave na zunanje spletne strani</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                    Portal lahko vsebuje povezave do zunanjih spletnih strani. Kariernik.com ne prevzema odgovornosti za vsebino ali zasebnostne prakse teh strani. Priporočamo, da preberete pogoje uporabe in politike zasebnosti vsakega zunanjega spletnega mesta, ki ga obiščete.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-lg font-semibold mb-2">8. Spremembe pogojev</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                    Kariernik.com si pridržuje pravico do spremembe teh pogojev uporabe kadarkoli brez predhodnega obvestila. Spremembe začnejo veljati takoj po objavi na tej strani. Priporočamo, da redno preverjate to stran. Z nadaljnjo uporabo portala po objavi sprememb se šteje, da ste spremembe sprejeli.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-lg font-semibold mb-2">9. Kontakt</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                    <div className="flex flex-row items-center gap-1">
                        Za vprašanja v zvezi s temi pogoji uporabe nas lahko kontaktirate na:
                        <p className="underline hover:text-foreground transition-colors">
                            kariernik@protonmail.com
                        </p>
                    </div>
                </p>
            </section>

            <p className="text-xs font-mono text-muted-foreground mt-10">
                © {new Date().getFullYear()} Kariernik.com. Vse pravice pridržane.
            </p>
        </div>
    );
};

export default Tos;
