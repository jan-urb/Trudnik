export type JobCardData = {
    id: number;
    title: string;
    technologies: string[];
    company_name: string;
    company_id: number;
    city_name: string;
    category_id: number;
}

export type JobDetailsData = {
    id: number;
    title: string;
    requirements: string;
    responsibilities: string;
    url: string;
    created_at: string;
    technologies: string[];
    category_name: string;
    company_id: number;
}

export type Pagination = {
    limit: number;
    offset: number;
    total: number;
}

