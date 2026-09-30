import type { JobCardData } from '../types/Job';
import { Spinner } from "@/components/ui/spinner"
import JobCard from '../components/JobCard';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

interface JobListingsProps {
    jobs: JobCardData[];
    loading: boolean;
    offset: number;
    setOffset: (offset: number) => void;
    currentPage: number;
    totalPages: number;
    LIMIT: number;
}

const JobListings = ({ jobs, loading, offset, setOffset, currentPage, totalPages, LIMIT }: JobListingsProps) => {
    return (
        <div>
            {loading ? (
                <Spinner />
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                        {jobs.map((job: JobCardData) => (
                            <JobCard key={job.id} job={job} />
                        ))}
                    </div>
                </>
            )}
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
    );
};

export default JobListings;