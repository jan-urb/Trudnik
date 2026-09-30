import { useState } from "react";
import { usePostHog } from "@posthog/react";
import { Button } from "@/components/ui/button";

const CookiePolicy = () => {
    const posthog = usePostHog();
    const [status, setStatus] = useState(posthog.get_explicit_consent_status());

    const handleWithdraw = () => {
        posthog.opt_out_capturing();
        posthog.clear_opt_in_out_capturing();
        setStatus("pending");
    };

    return (
        <div className="max-w-3xl mx-auto py-10 px-4">
            <h1 className="text-3xl font-serif font-light mb-2">Politika piškotkov</h1>
            <p className="text-xs font-mono text-muted-foreground mb-8">Veljavno od: 17. 3. 2026</p>

            <section className="mb-8">
                <h2 className="text-lg font-semibold mb-2">1. Kaj so piškotki?</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                    Piškotki so majhne besedilne datoteke, ki jih spletno mesto shrani na vaš računalnik ali mobilno napravo ob obisku. Omogočajo, da si spletno mesto zapomni vaše akcije in nastavitve skozi čas, tako da jih ni treba vsakič znova vnašati.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-lg font-semibold mb-2">2. Kateri piškotki se uporabljajo</h2>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    Kariernik.com uporablja piškotke analitičnega orodja <strong>PostHog</strong> za razumevanje, kako obiskovalci uporabljajo portal. To nam pomaga izboljševati storitev.
                </p>
                <div className="border rounded-md overflow-hidden">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b bg-muted/50">
                                <th className="text-left px-4 py-2 font-medium">Ime</th>
                                <th className="text-left px-4 py-2 font-medium">Namen</th>
                                <th className="text-left px-4 py-2 font-medium">Vrsta</th>
                                <th className="text-left px-4 py-2 font-medium">Trajanje</th>
                            </tr>
                        </thead>
                        <tbody className="text-muted-foreground">
                            <tr className="border-b">
                                <td className="px-4 py-2 font-mono text-xs">ph_*</td>
                                <td className="px-4 py-2">Analitika obiskov (PostHog)</td>
                                <td className="px-4 py-2">Analitični</td>
                                <td className="px-4 py-2">1 leto</td>
                            </tr>
                            <tr>
                                <td className="px-4 py-2 font-mono text-xs">ph_opt_in_out</td>
                                <td className="px-4 py-2">Shranjevanje vaše odločitve o piškotkih</td>
                                <td className="px-4 py-2">Funkcionalni</td>
                                <td className="px-4 py-2">1 leto</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

            <section className="mb-8">
                <h2 className="text-lg font-semibold mb-2">3. Zakaj jih uporabljamo</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                    Analitične piškotke PostHog uporabljamo izključno za merjenje prometa in razumevanje obnašanja uporabnikov na portalu (npr. katere strani so obiskane najpogosteje, kako dolgo obiskovalci ostanejo na strani). Teh podatkov ne delimo s tretjimi oglaševalci.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-lg font-semibold mb-2">4. Vaša privolitev</h2>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    Ob prvem obisku portala vam prikažemo obvestilo o piškotkih, kjer lahko izberete, ali analitične piškotke sprejemate ali zavrnete. Vaša odločitev se shrani in ob naslednjih obiskih ne boste znova povprašani.
                </p>
                {status === "pending" ? (
                    <p className="text-sm text-muted-foreground">Vaša privolitev je trenutno <strong>čakajoča</strong> — ob naslednjem obisku boste povprašani.</p>
                ) : (
                    <div className="flex items-center gap-4">
                        <p className="text-sm text-muted-foreground">
                            Trenutni status:{" "}
                            <strong>{status === "granted" ? "sprejeto" : "zavrnjeno"}</strong>.
                        </p>
                        <Button variant="outline" size="sm" onClick={handleWithdraw}>
                            Prekliči privolitev
                        </Button>
                    </div>
                )}
            </section>

            <section className="mb-8">
                <h2 className="text-lg font-semibold mb-2">5. Upravljanje piškotkov v brskalniku</h2>
                <p className="text-sm text-muted-foreground leading-relaxed mb-2">
                    Večina brskalnikov vam omogoča upravljanje piškotkov prek nastavitev. Piškotke lahko:
                </p>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 leading-relaxed">
                    <li>pregledujete in brišete,</li>
                    <li>blokirate za posamezna ali vsa spletna mesta,</li>
                    <li>nastavite brskalnik, da vas obvesti pred shranjevanjem piškotka.</li>
                </ul>
                <p className="text-sm text-muted-foreground leading-relaxed mt-2">
                    Upoštevajte, da onemogočitev vseh piškotkov lahko vpliva na delovanje nekaterih funkcij portala.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-lg font-semibold mb-2">6. Spremembe politike piškotkov</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                    Kariernik.com si pridržuje pravico do spremembe te politike piškotkov. Vse spremembe bodo objavljene na tej strani z posodobljenim datumom veljavnosti.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-lg font-semibold mb-2">7. Kontakt</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                    <div className="flex flex-row items-center gap-1">
                        Za vprašanja v zvezi s piškotki ali obdelavo podatkov nas kontaktirajte na:
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

export default CookiePolicy;
