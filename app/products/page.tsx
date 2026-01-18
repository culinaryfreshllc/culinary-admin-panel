import ProductList from "../../components/products/ProductList";
import api from "../../lib/axios";
import { Product, ProductStatus } from "../../context/StoreContext";
import { MOCK_PRODUCTS_DATA } from "../../lib/mock-data";



async function getProducts(page: number, limit: number): Promise<{ products: Product[], pagination: any }> {
    try {
        const response = await api.get(`/products?page=${page}&limit=${limit}`);
        const products = response.data.data.map((item: any, index: number) => {
            // Try to find a mock product by fuzzy name matching or just round-robin for demo
            const mockProduct = MOCK_PRODUCTS_DATA.find(p => item.name.toLowerCase().includes(p.name.toLowerCase())) || MOCK_PRODUCTS_DATA[index % MOCK_PRODUCTS_DATA.length];

            const stock = Math.floor(Math.random() * 500);
            const status: ProductStatus = stock > 0 ? "In Stock" : "Out of Stock";

            return {
                id: item.id,
                name: item.name,
                sku: item.id.substring(0, 8).toUpperCase(),
                price: mockProduct.price || (Math.floor(Math.random() * 100) + 20),
                stock,
                views: mockProduct.reviews * 10 || Math.floor(Math.random() * 1000),
                status,
                featured: index % 3 === 0, // Just a dummy logic for featured
                category: mockProduct.category || "General",
                imageUrl: item.imageUrl || mockProduct.image,
                description: item.shortDescription || mockProduct.description,
                rating: mockProduct.rating,
                reviews: mockProduct.reviews,
                tag: mockProduct.tag,
                weight: mockProduct.weight
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
