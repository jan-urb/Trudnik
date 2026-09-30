import type { JobCardData } from "@/types/Job";
import type { SearchData } from "@/types/Search";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import CategoriesBar from "@/components/CategoriesBar";
import JobListings from "@/components/JobListings";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import {
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxList,
} from "@/components/ui/combobox"
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "@/components/ui/input-group"
import type { City } from "@/types/City";
import { Card } from "@/components/ui/card";
import AiNotice from "@/components/AiNotice";
import { Spinner } from "@/components/ui/spinner"

const HomePage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [totalCompaniesCount, setTotalCompaniesCount] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [searchQuery, setSearchQuery] = useState<string>(() => searchParams.get("q") ?? "");
    const [jobs, setJobs] = useState<JobCardData[]>([]);
    const [loadingJobs, setLoadingJobs] = useState(true);
    const [totalJobs, setTotalJobs] = useState<number>(0);
    const [cities, setCities] = useState<City[]>([]);
    const [selectedCity, setSelectedCity] = useState<City | null>(null);
    const [fetchKey, setFetchKey] = useState<number>(0);

    const LIMIT: number = 10;

    const selectedCategory = Number(searchParams.get("category") ?? 0);
    const offset = (Number(searchParams.get("page") ?? 1) - 1) * LIMIT;
    const activeSearch = searchParams.get("q") ?? "";
    const activeCity = searchParams.get("city") ?? "";

    const setSelectedCategory = (category: number) => {
        setSearchParams(prev => {
            const next = new URLSearchParams(prev);
            if (category === 0) next.delete("category"); else next.set("category", String(category));
            next.delete("page");
            next.delete("q");
            next.delete("city");
            return next;
        }, { replace: true });
    };

    const setOffset = (newOffset: number) => {
        const page = Math.floor(newOffset / LIMIT) + 1;
        setSearchParams(prev => {
            const next = new URLSearchParams(prev);
            if (page === 1) next.delete("page"); else next.set("page", String(page));
            return next;
        }, { replace: false });
    };

    useEffect(() => {
        try {
            const fetchTotalCount = async () => {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/other/totalJobsCompaniesCount`);
                if (!response.ok) throw new Error(`HTTP error ${response.status}`);
                const data = await response.json();
                setTotalCompaniesCount(data.companiesCount);
            };
            fetchTotalCount();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        try {
            const fetchCities = async () => {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/other/cities`);
                if (!response.ok) throw new Error(`HTTP error ${response.status}`);
                const data = await response.json();
                setCities(data);
            };
            fetchCities();
        } catch (error) {
            console.error(error);
        }
    }, []);

    useEffect(() => {
        const fetchJobs = async () => {
            setLoadingJobs(true);
            try {
                if (activeSearch || activeCity) {
                    const postData: SearchData = {
                        search: activeSearch,
                        city: activeCity || undefined,
                        limit: LIMIT,
                        offset,
                    };
                    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/jobs/search`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(postData),
                    });
                    if (!response.ok) throw new Error(`HTTP error ${response.status}`);
                    const data = await response.json();
                    setJobs(data.data ?? []);
                    setTotalJobs(data.pagination?.total ?? 0);
                } else {
                    let url: string;
                    if (selectedCategory === 0) {
                        url = `${import.meta.env.VITE_API_URL}/api/jobs?limit=${LIMIT}&offset=${offset}`;
                    } else {
                        url = `${import.meta.env.VITE_API_URL}/api/jobs/category/${selectedCategory}?limit=${LIMIT}&offset=${offset}`;
                    }
                    const response = await fetch(url);
                    if (!response.ok) throw new Error(`HTTP error ${response.status}`);
                    const data = await response.json();
                    setJobs(data.data ?? []);
                    setTotalJobs(data.pagination.total);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoadingJobs(false);
            }
        };

        fetchJobs();
    }, [offset, selectedCategory, fetchKey, activeSearch, activeCity]);

    const totalPages = Math.ceil(totalJobs / LIMIT);
    const currentPage = Math.floor(offset / LIMIT) + 1;

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setSearchParams(prev => {
            const next = new URLSearchParams(prev);
            if (searchQuery) next.set("q", searchQuery); else next.delete("q");
            if (selectedCity?.name) next.set("city", selectedCity.name); else next.delete("city");
            next.delete("page");
            return next;
        }, { replace: true });
    };

    const handleReset = () => {
        setSearchParams({}, { replace: true });
        setSearchQuery("");
        setSelectedCity(null);
        setFetchKey(k => k + 1);
    };

    return (
        <div className="">
            {loading ? (
                <Spinner />
            ) : (
                <div className="flex flex-col md:flex-row justify-between gap-4 mb-5">
                    <div className="flex flex-row justify-center md:justify-start gap-4">
                        <div className="text-center">
                            <span className="text-2xl md:text-5xl font-serif font-light text-foreground">{totalJobs}</span>
                            <p className="text-xs font-mono text-muted-foreground mt-1">Delovnih mest</p>
                        </div>
                        <div className="text-center">
                            <span className="text-2xl md:text-5xl font-serif font-light text-foreground">{totalCompaniesCount}</span>
                            <p className="text-xs font-mono text-muted-foreground mt-1">Podjetij</p>
                        </div>
                    </div>
                    <div>
                        <AiNotice />
                    </div>
                </div>
            )}
            <Card className="flex items-center gap-2 p-4 mb-10">
                <form onSubmit={handleSearch} className="relative w-full flex flex-col md:flex-row items-start md:items-center gap-2">
                    <InputGroup className="w-full md:w-auto">
                        <InputGroupInput placeholder="Najdi..." value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)} />
                        <InputGroupAddon>
                            <Search />
                        </InputGroupAddon>
                    </InputGroup>
                    <Combobox
                        items={cities}
                        value={selectedCity?.name ?? ""}
                        onValueChange={(value) => setSelectedCity(cities.find(c => c.name === value) ?? null)}

                    >
                        <ComboboxInput className="w-full md:w-auto" placeholder="Izberite mesto..." />
                        <ComboboxContent>
                            <ComboboxEmpty>Ni podatka.</ComboboxEmpty>
                            <ComboboxList>
                                {(item) => (
                                    <ComboboxItem key={item.id} value={item.name}>
                                        {item.name}
                                    </ComboboxItem>
                                )}
                            </ComboboxList>
                        </ComboboxContent>
                    </Combobox>
                    <div className="flex flex-row gap-2">
                        <Button type="reset" variant="outline" className="hover:cursor-pointer" onClick={handleReset}>
                            Poenostavi
                        </Button>
                        <Button type="submit" disabled={loadingJobs} className="hover:cursor-pointer hover:bg-primary/70">
                            {loadingJobs ? <Spinner className="size-4" /> : "Najdi"}
                        </Button>
                    </div>
                </form>
            </Card>


            <div className="flex flex-col md:flex-row gap-4">
                <div className="basis-1/6">
                    <CategoriesBar
                        selectedCategory={selectedCategory}
                        setSelectedCategory={setSelectedCategory}
                    />
                </div>

                <div className="basis-5/6">
                    <JobListings
                        jobs={jobs}
                        loading={loadingJobs}
                        offset={offset}
                        setOffset={setOffset}
                        currentPage={currentPage}
                        totalPages={totalPages}
                        LIMIT={LIMIT}
                    />
                </div>
            </div>
        </div>
    );
};

export default HomePage;

