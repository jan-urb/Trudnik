import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import type { CompanyData } from "../types/Company"
import { Building2, Link, MapPin, Hash, Calendar, Activity, House, Users, ExternalLink } from 'lucide-react';
import CompanyLogo from "@/components/CompanyLogo";
import { Spinner } from "@/components/ui/spinner"

const CompanyDetails = () => {
    const { id } = useParams()
    const [company, setCompany] = useState<CompanyData>();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCompany = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/companies/${id}`);
                if (!response.ok) throw new Error(`HTTP error ${response.status}`);
                const data = await response.json();
                setCompany(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchCompany();
    }, [id]);

    const company_name = company?.company_name ?? "Ni podatka...";
    const company_website = company?.company_website ?? "Ni podatka...";
    const registration_number = company?.registration_number ?? "Ni podatka...";
    const address = company?.address ?? "Ni podatka...";
    const founded_date = company?.founded_date ? new Date(company.founded_date).toLocaleDateString() : "Ni podatka...";
    const activity_name = company?.activity_name ?? "Ni podatka...";
    const employees_lower = company?.employees_lower != null ? Number(company.employees_lower) : undefined;
    const employees_upper = company?.employees_upper != null ? Number(company.employees_upper) : undefined;
    const city_name = company?.city_name ?? "Ni podatka...";

    const hasEmployees = employees_lower != null && !isNaN(employees_lower) && employees_upper != null && !isNaN(employees_upper);

    const labelClass = "flex items-center gap-1.5 text-muted-foreground";
    const labelTextClass = "uppercase font-mono text-xs tracking-wider";
    const valueClass = "font-mono text-base mt-1";
    const cellClass = "flex flex-col p-5";

    return (
        <>
            {loading ? (
                <div className="flex items-center justify-center">
                    <Spinner />
                </div>
            ) : (
                <div className="w-full">
                    <div className="flex flex-row items-center gap-4 border-b pb-3 mb-10">
                        <CompanyLogo name={company?.company_name} size={"lg"} />
                        <div className="text-2xl md:text-5xl">
                            {company_name}
                        </div>
                    </div>
                    <div className="flex flex-col w-full border rounded-2xl">
                        <div className="flex flex-col md:flex-row">
                            <div className={`${cellClass} w-full border-b md:border-r`}>
                                <div className={labelClass}>
                                    <Building2 className="w-3.5 h-3.5" />
                                    <span className={labelTextClass}>ime podjetja</span>
                                </div>
                                <div className={valueClass}>{company_name}</div>
                            </div>
                            <div className={`${cellClass} w-full border-b md:border-r`}>
                                <div className={labelClass}>
                                    <Link className="w-3.5 h-3.5" />
                                    <span className={labelTextClass}>spletna stran</span>
                                </div>
                                <div className={`${valueClass} flex items-center gap-1`}>
                                    <a href={`${company_website}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1">
                                        {company_website}
                                        <ExternalLink className="w-3 h-3" />
                                    </a>
                                </div>
                            </div>
                            <div className={`${cellClass} w-full border-b`}>
                                <div className={labelClass}>
                                    <MapPin className="w-3.5 h-3.5" />
                                    <span className={labelTextClass}>mesto</span>
                                </div>
                                <div className={valueClass}>{city_name}</div>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row">
                            <div className={`${cellClass} w-full border-b md:border-r`}>
                                <div className={labelClass}>
                                    <Hash className="w-3.5 h-3.5" />
                                    <span className={labelTextClass}>matična številka</span>
                                </div>
                                <div className={valueClass}>{registration_number}</div>
                            </div>
                            <div className={`${cellClass} w-full border-b md:border-r`}>
                                <div className={labelClass}>
                                    <Calendar className="w-3.5 h-3.5" />
                                    <span className={labelTextClass}>datum ustanovitve</span>
                                </div>
                                <div className={valueClass}>{founded_date}</div>
                            </div>
                            <div className={`${cellClass} w-full border-b`}>
                                <div className={labelClass}>
                                    <House className="w-3.5 h-3.5" />
                                    <span className={labelTextClass}>naslov</span>
                                </div>
                                <div className={valueClass}>{address}</div>
                            </div>
                        </div>

                        <div className="flex flex-row">
                            <div className={`${cellClass} w-full border-b`}>
                                <div className={labelClass}>
                                    <Activity className="w-3.5 h-3.5" />
                                    <span className={labelTextClass}>dejavnost</span>
                                </div>
                                <div className={valueClass}>{activity_name}</div>

                            </div>
                        </div>

                        <div className="flex flex-row">
                            <div className={`${cellClass} w-full pb-4`}>
                                <div className={labelClass}>
                                    <Users className="w-3.5 h-3.5" />
                                    <span className={labelTextClass}>število zaposlenih</span>
                                </div>
                                <div className={`${valueClass}`}>
                                    {hasEmployees ? `${employees_lower.toLocaleString()} – ${employees_upper.toLocaleString()}` : "Ni podatka..."}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default CompanyDetails