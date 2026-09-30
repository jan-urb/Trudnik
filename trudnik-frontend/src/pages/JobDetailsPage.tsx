import CompanyLogo from "../components/CompanyLogo"
import { Link, useParams } from "react-router-dom";
import type { JobDetailsData } from "../types/Job";
import { useEffect } from "react";
import { useState } from "react";
import type { CompanyData } from "../types/Company";
import { Link as LinkIcon, MapPin, Calendar, Users, ExternalLink } from 'lucide-react';
import {
    Card,
    CardContent,
    CardHeader,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

const JobDetailsPage = () => {
    const { id } = useParams();
    const [job, setJob] = useState<JobDetailsData>();
    const [loading, setLoading] = useState<boolean>(true);
    const [company, setCompany] = useState<CompanyData | null>(null);
    const [loadingCompany, setLoadingCompany] = useState(true);

    useEffect(() => {
        const fetchJob = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/jobs/${id}`);
                if (!response.ok) throw new Error(`HTTP error ${response.status}`);
                const data = await response.json();
                setJob(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchJob();
    }, [id]);


    useEffect(() => {
        if (!job?.company_id) return;

        const fetchCompany = async () => {
            setLoadingCompany(true);
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/companies/${job.company_id}`);
                if (!response.ok) throw new Error(`HTTP error ${response.status}`);
                const data = await response.json();
                setCompany(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoadingCompany(false);
            }
        };
        fetchCompany();
    }, [job]);

    return (
        <>
            {loading ? (
                <div className="">
                    <Spinner />
                </div>
            ) : (
                <div>
                    <div className="flex flex-col md:flex-row items-start md:justify-between md:items-center">
                        <div className="text-2xl md:text-5xl border-b pb-0 md:pb-2 mb-2 md:mb-5">
                            {job?.title}
                        </div>

                        <div >
                            {
                                job?.url ?
                                    // <Button className="py-4 md:py-6 text-sm md:text-xl hover:bg-accent/80"> <Link to={job.url} target="_blank" ><div className="flex flex-row gap-2 items-center">Povezava do oglasa <ExternalLink className="w-5 h-5" /></div></Link></Button> 
                                    <Button className="py-4 md:py-6 text-sm md:text-xl hover:bg-accent/80"> <a href={job.url} target="_blank" rel="noopener noreferrer"><div className="flex flex-row gap-2 items-center">Povezava do oglasa <ExternalLink className="w-5 h-5" /></div></a></Button>
                                    : <></>
                            }
                        </div>
                    </div>
                    <div>
                        <div className="flex flex-col md:flex-row gap-4 mt-5">
                            <div className="flex flex-col gap-5 w-full md:w-4/5">
                                <div>
                                    <div className="uppercase">Zahteve</div>
                                    <Card>
                                        <CardContent>
                                            <div className="font-mono leading-8">
                                                {job?.requirements ? job.requirements : "Ni podatka..."}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                                <div>
                                    <div className="uppercase">Obveznosti</div>
                                    <Card>
                                        <CardContent>
                                            <div className="font-mono leading-8">
                                                {job?.responsibilities ? job.responsibilities : "Ni podatka..."}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                                <div>
                                    <div className="uppercase">Tehnologije</div>
                                    <Card>
                                        <CardContent>
                                            <div className="flex flex-row gap-2 ">
                                                {job?.technologies ? job.technologies.map((technology: string) => (
                                                    <Badge key={technology}>
                                                        {technology}
                                                    </Badge>
                                                )) : <div className="font-mono leading-8">Ni podatka...</div>}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                                <div>
                                    <div className="uppercase">Datum najdbe oglasa</div>
                                    <Card>
                                        <CardContent>
                                            <div className="font-mono leading-8">
                                                {job?.created_at ? new Date(job.created_at).toLocaleDateString() : "Ni podatka..."}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>

                            <div className="w-full md:w-1/5">
                                {loadingCompany ? (
                                    <Spinner />
                                ) : (
                                    <Card>
                                        <CardHeader className="flex flex-row items-center gap-4 border-b">
                                            <CompanyLogo name={company?.company_name} size={"lg"} />
                                            <div>
                                                <Link to={`/company/${company?.id}`}>
                                                    <h2 className="text-xl md:text-2xl font-semibold">
                                                        {company?.company_name ? company?.company_name : "Ni podatka..."}
                                                    </h2>
                                                </Link>
                                                <p className="text-sm tracking-wide">
                                                    {company?.activity_name ? company?.activity_name : "Ni podatka..."}
                                                </p>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="p-0">
                                            <div className="flex flex-col gap-5">
                                                <div className="flex flex-row justify-between px-4">
                                                    <div className="flex items-center gap-1.5 text-muted-foreground">
                                                        <Calendar className="w-3.5 h-3.5" />
                                                        <span className="uppercase font-mono text-xs tracking-wider">Leto ustanovitve:</span>
                                                    </div>
                                                    <div className="text-sm font-mono">{company?.founded_date ? new Date(company.founded_date).getFullYear().toString() : "Ni podatka..."}</div>
                                                </div>
                                                <div className="border-b" />

                                                <div className="flex flex-row justify-between px-4">
                                                    <div className="flex items-center gap-1.5 text-muted-foreground">
                                                        <Users className="w-3.5 h-3.5" />
                                                        <span className="uppercase font-mono text-xs tracking-wider">Št. zaposlenih:</span>
                                                    </div>
                                                    <div className="text-sm font-mono">{company?.employees_lower && company?.employees_upper ? `${company.employees_lower.toLocaleString("sl-SI")} - ${company.employees_upper.toLocaleString("sl-SI")}` : "Ni podatka..."}</div>
                                                </div>
                                                <div className="border-b" />

                                                <div className="flex flex-row justify-between px-4">
                                                    <div className="flex items-center gap-1.5 text-muted-foreground">
                                                        <MapPin className="w-3.5 h-3.5" />
                                                        <span className="uppercase font-mono text-xs tracking-wider">Mesto:</span>
                                                    </div>
                                                    <div className="text-sm font-mono">{company?.city_name ? company?.city_name : "Ni podatka..."}</div>
                                                </div>
                                                <div className="border-b" />

                                                <div className="flex flex-row justify-between px-4">
                                                    <div className="flex items-center gap-1.5 text-muted-foreground">
                                                        <LinkIcon className="w-3.5 h-3.5" />
                                                        <span className="uppercase font-mono text-xs tracking-wider">Spletna stran:</span>
                                                    </div>
                                                    {company?.company_website ?
                                                        <a
                                                            href={company?.company_website}
                                                            className="text-accent text-lg font-medium hover:underline">
                                                            {company.company_website}
                                                        </a>
                                                        : <div>Ni podatka...</div>}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default JobDetailsPage