import { useEffect, useState } from "react";
import type { CategoryData } from "../types/Category";
import { Spinner } from "@/components/ui/spinner"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"

interface CategoriesBarProps {
    selectedCategory: number;
    setSelectedCategory: (categoryId: number) => void;
}

const CategoriesBar = ({ selectedCategory, setSelectedCategory }: CategoriesBarProps) => {
    const [categories, setCategories] = useState<CategoryData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/other/categories`);
                if (!response.ok) throw new Error(`HTTP error ${response.status}`);
                const data = await response.json();
                setCategories(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    return (
        <Card>
            <CardHeader>
                <CardTitle className="uppercase text-sm">Kategorije</CardTitle>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <Spinner />
                ) : (
                    <ul className="space-y-1">
                        {categories.map((category) => (
                            <li key={category.id}>
                                <button
                                    className="w-full flex items-center justify-between py-1.5 px-1 rounded-md hover:bg-accent/50 transition-colors"
                                    onClick={() =>
                                        setSelectedCategory(selectedCategory === category.id ? 0 : category.id)
                                    }
                                >
                                    <div className="flex items-center gap-2.5">
                                        <Checkbox
                                            checked={selectedCategory === category.id}
                                            readOnly
                                            tabIndex={-1}
                                        />
                                        <span className="text-xs text-left font-mono">{category.si_name}</span>
                                    </div>
                                    <span className="text-xs font-mono text-muted-foreground ml-2 shrink-0">
                                        {category.job_count}
                                    </span>
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </CardContent>
        </Card>
    );
};

export default CategoriesBar;