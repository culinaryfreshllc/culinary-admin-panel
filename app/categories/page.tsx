import CategoryList from "../../components/categories/CategoryList";
import api from "../../lib/axios";
import { Category } from "../../context/StoreContext";

async function getCategories(page: number, limit: number): Promise<{ categories: Category[], pagination: any }> {
    try {
        const response = await api.get(`/categories?page=${page}&limit=${limit}`);
        const categories = response.data.data.map((item: any) => ({
            id: item.id,
            name: item.name
        }));

        return {
            categories,
            pagination: response.data.pagination
        };
    } catch (error) {
        console.error("Failed to fetch categories:", error);
        return { categories: [], pagination: null };
    }
}

export default async function CategoriesPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const resolvedSearchParams = await searchParams;
    const page = typeof resolvedSearchParams.page === 'string' ? parseInt(resolvedSearchParams.page) : 1;
    const limit = typeof resolvedSearchParams.limit === 'string' ? parseInt(resolvedSearchParams.limit) : 10;

    const { categories, pagination } = await getCategories(page, limit);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-800">Categories</h1>
            </div>
            <CategoryList initialCategories={categories} pagination={pagination} />
        </div>
    );
}
