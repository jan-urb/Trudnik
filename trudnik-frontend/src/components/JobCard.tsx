import { Link } from "react-router-dom"
import type { JobCardData } from "../types/Job"
import { Badge } from "@/components/ui/badge"
import { MapPin } from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import CompanyLogo from "./CompanyLogo"

interface JobCardProps {
  job: JobCardData
}

const JobCard = ({ job }: JobCardProps) => {
  return (
    <Link to={`/job/${job.id}`} className="contents">
      <Card
        key={job.id}
        className="cursor-pointer transition-colors hover:bg-muted/40 p-5"
      >
        <CardHeader>
          <div className="flex flex-row gap-2">
            <CompanyLogo name={job.company_name} size="md" />
            <CardTitle className="text-lg">{job.title}</CardTitle>
          </div>

        </CardHeader>
        <CardContent className="">
          <CardDescription className="font-mono text-xs">{job.company_name}</CardDescription>
          <div className="flex flex-row gap-2 pt-2 flex-wrap">
            {job.technologies?.map((technology: string) => (
              <Badge key={technology}>
                {technology}
              </Badge>
            ))}
          </div>
        </CardContent>
        <CardFooter className="bg-transparent">
          <div className="flex flex-row items-center gap-2">
            <MapPin className="w-3.5 h-3.5" />
            <div className="font-mono text-xs">{job.city_name}</div>
          </div>
        </CardFooter>
      </Card>
    </Link >
  )
}

export default JobCard
