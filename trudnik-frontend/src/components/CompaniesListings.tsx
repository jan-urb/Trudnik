import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import { Spinner } from "@/components/ui/spinner"
import type { CompanyCardData } from "@/types/Company";
import CompanyCard from "./CompanyCard";

interface CompanyListingsProps {
    companies: CompanyCardData[];
    loading: boolean;
    offset: number;
    setOffset: (offset: number) => void;
    currentPage: number;
    totalPages: number;
    LIMIT: number;
}

const CompaniesListings = ({ companies, loading, offset, setOffset, currentPage, totalPages, LIMIT }: CompanyListingsProps) => {
    return (
        <div>
            <div className="w-full">
                {loading ? (
                    <div className="flex justify-center py-12">
                        <Spinner />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {companies.map((company: CompanyCardData) => (
                            <CompanyCard key={company.id} company={company} />
                        ))}
                    </div>
                )}
            </div>
            <div className="mt-4">
                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                className={
                                    offset === 0 ? "pointer-events-none opacity-50" : undefined
                                }
                                onClick={() => {
                                    setOffset(offset - LIMIT);
                                }}
                            />
                        </PaginationItem>
                        <PaginationItem>
                            <span className="text-sm text-muted-foreground px-3">
                                Stran {currentPage} od {totalPages}
                            </span>
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationNext
                                className={
                                    currentPage >= totalPages ? "pointer-events-none opacity-50" : undefined
                                }
                                onClick={() => {
                                    setOffset(offset + LIMIT);
                                }}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
        </div>
    )
}

export default CompaniesListings