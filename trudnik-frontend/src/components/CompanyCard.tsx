import { MapPin } from 'lucide-react';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import type { CompanyCardData } from "@/types/Company"
import { Link } from "react-router-dom"
import CompanyLogo from "./CompanyLogo";

interface CompanyCardProps {
    company: CompanyCardData
}

const CompanyCard = ({ company }: CompanyCardProps) => {
    return (
        <Link to={`/company/${company.id}`} className="contents">
            <Card
                key={company.id}
                className="cursor-pointer transition-colors hover:bg-muted/40 p-5"
            >
                <CardHeader>
                    <div className="flex flex-row gap-2">
                        <CompanyLogo name={company.company_name} size="md" />
                        <CardTitle className="text-lg">{company.company_name}</CardTitle>
                    </div>

                </CardHeader>
                <CardContent className="">
                    <CardDescription className="font-mono text-xs">{company.company_website}</CardDescription>
                </CardContent>
                <CardFooter className="bg-muted-background">
                    <div className="flex flex-row items-center gap-2">
                        <MapPin className="w-3.5 h-3.5" />
                        <div className="font-mono text-xs">{company.city_name}</div>
                    </div>
                </CardFooter>
            </Card>
        </Link >
    )
}

export default CompanyCard