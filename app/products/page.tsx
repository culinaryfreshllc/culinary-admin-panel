import ProductList from "../../components/products/ProductList";
import api from "../../lib/axios";
import { Product, ProductStatus } from "../../context/StoreContext";



async function getProducts(page: number, limit: number): Promise<{ products: Product[], pagination: any }> {
    try {
        const response = await api.get(`/products?page=${page}&limit=${limit}`);
        const products = response.data.data.map((item: any, index: number) => {
            // Get the first category name for backward compatibility, or "Uncategorized"
            const categoryName = item.categories && item.categories.length > 0
                ? item.categories[0].name
                : "Uncategorized";

            return {
                id: item.id,
                name: item.name,
                views: item.views || 0,
                status: item.status as ProductStatus, // API returns IN_STOCK or OUT_OF_STOCK
                featured: item.featured || false,
                category: categoryName, // Legacy field - first category name
                categoryId: item.categoryIds || [], // Array of category IDs
                categoryIds: item.categoryIds || [], // API field name
                categories: item.categories || [], // New categories array with id and name
                imageUrl: item.imageUrl || "",
                rating: item.rating,
                reviews: item.reviews,
                tag: item.tag,
                description: item.description,
                createdAt: item.createdAt,
                updatedAt: item.updatedAt,
            };
        });

        return {
            products,
            pagination: response.data.pagination
        };
    } catch (error) {
        console.error("Failed to fetch products:", error);
        return { products: [], pagination: null };
    }
}

export default async function ProductsPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const resolvedSearchParams = await searchParams;
    const page = typeof resolvedSearchParams.page === 'string' ? parseInt(resolvedSearchParams.page) : 1;
    const limit = typeof resolvedSearchParams.limit === 'string' ? parseInt(resolvedSearchParams.limit) : 10;

    const { products, pagination } = await getProducts(page, limit);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-800">Products</h1>
            </div>
            <ProductList initialProducts={products} pagination={pagination} />
        </div>
    );
}
