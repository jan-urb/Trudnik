export interface CompanyData {
    id: number;
    company_name: string;
    company_website: string;
    registration_number: string;
    address: string;
    city_name: string;
    employees_lower: number;
    employees_upper: number;
    founded_date: string;
    activity_name: string;
}

export interface CompanyCardData {
    id: number;
    company_name: string;
    city_name: string;
    employees_lower: number;
    employees_upper: number;
    activity_name: string;
    company_website: string;
}
