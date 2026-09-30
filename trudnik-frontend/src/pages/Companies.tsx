import CompaniesListings from '@/components/CompaniesListings';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import { Spinner } from '@/components/ui/spinner';
import type { CompanyCardData } from '@/types/Company';
import type { CompanySearchData } from '@/types/Search';
import { Search } from 'lucide-react';
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom';

const Companies = () => {
    const LIMIT: number = 20;
    const [searchParams, setSearchParams] = useSearchParams();
    const [loadingCompanies, setLoadingCompanies] = useState(true);
    const [companies, setCompanies] = useState<CompanyCardData[]>([]);
    const [totalCompanies, setTotalCompanies] = useState<number>(0);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [fetchKey, setFetchKey] = useState<number>(0);

    const offset = (Number(searchParams.get("page") ?? 1) - 1) * LIMIT;
    const activeSearch = searchParams.get("q") ?? "";

    const setOffset = (newOffset: number) => {
        const page = Math.floor(newOffset / LIMIT) + 1;
        setSearchParams(prev => {
            const next = new URLSearchParams(prev);
            if (page === 1) next.delete("page"); else next.set("page", String(page));
            return next;
        }, { replace: false });
    };

    useEffect(() => {
        const fetchCompanies = async () => {
            setLoadingCompanies(true);
            try {
                let data;
                if (activeSearch) {
                    const postData: CompanySearchData = { search: activeSearch, limit: LIMIT, offset };
                    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/companies/search`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(postData),
                    });
                    if (!response.ok) throw new Error(`HTTP error ${response.status}`);
                    data = await response.json();
                } else {
                    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/companies?limit=${LIMIT}&offset=${offset}`);
                    if (!response.ok) throw new Error(`HTTP error ${response.status}`);
                    data = await response.json();
                }
                setCompanies(data.data ?? []);
                setTotalCompanies(data.pagination?.total ?? 0);
            } catch (error) {
                console.error(error);
            } finally {
                setLoadingCompanies(false);
            }
        };
        fetchCompanies();
    }, [offset, activeSearch, fetchKey]);

    const totalPages = Math.ceil(totalCompanies / LIMIT);
    const currentPage = Math.floor(offset / LIMIT) + 1;

    const handleSearch = (e: { preventDefault: () => void }) => {
        e.preventDefault();
        setSearchParams(searchQuery ? { q: searchQuery } : {}, { replace: true });
        setSearchQuery("");
    };

    const handleReset = () => {
        setSearchParams({}, { replace: true });
        setSearchQuery("");
        setFetchKey(k => k + 1);
    };

    return (
        <>
            <Card className="flex items-center gap-2 p-4 mb-10">
                <form onSubmit={handleSearch} className="relative w-full flex flex-col md:flex-row items-start md:items-center gap-2">
                    <InputGroup className="w-full md:w-auto">
                        <InputGroupInput placeholder="Najdi..." value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)} />
                        <InputGroupAddon>
                            <Search />
                        </InputGroupAddon>
                    </InputGroup>
                    <div className="flex flex-row gap-2">
                        <Button type="reset" variant="outline" className="hover:cursor-pointer" onClick={handleReset}>
                            Poenostavi
                        </Button>
                        <Button type="submit" disabled={loadingCompanies} className="hover:cursor-pointer hover:bg-primary/70">
                            {loadingCompanies ? <Spinner className="size-4" /> : "Najdi"}
                        </Button>
                    </div>
                </form>
            </Card>

            <CompaniesListings
                companies={companies}
                loading={loadingCompanies}
                offset={offset}
                setOffset={setOffset}
                currentPage={currentPage}
                totalPages={totalPages}
                LIMIT={LIMIT}
            />
        </>
    )
}

export default Companies