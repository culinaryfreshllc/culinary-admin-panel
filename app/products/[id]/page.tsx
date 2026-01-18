import api from "../../../lib/axios";
import { ArrowLeft, Edit2, Calendar, Tag, Package, Star, Eye } from "lucide-react";
import Link from "next/link";
import { Button } from "../../../components/ui/Button";
import { MOCK_PRODUCT_DETAILS } from "../../../lib/mock-data";

interface ProductDetail {
    id: string;
    name: string;
    shortDescription: string;
    imageUrl: string;
    categoryIds: string[];
}

async function getProduct(id: string): Promise<ProductDetail | null> {
    try {
        const response = await api.get(`/products/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Failed to fetch product ${id}:`, error);
        return null; // Handle 404/500 appropriately in UI
    }
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const product = await getProduct(id);

    if (!product) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
                <p className="text-gray-500 mb-6">The product you correspond to could not be found.</p>
                <Link href="/products">
                    <Button variant="secondary" icon={<ArrowLeft size={16} />}>Back to Products</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            {/* Header / Nav */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/products" className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors">
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 leading-tight">Product Details</h1>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                            <span>Products</span>
                            <span>/</span>
                            <span className="text-gray-900 font-medium truncate max-w-[200px]">{product.name}</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="secondary" icon={<Edit2 size={16} />}>Edit Product</Button>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Column: Image */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sticky top-6">
                        <div className="aspect-square bg-gray-50 rounded-xl overflow-hidden relative group">
                            {product.imageUrl ? (
                                <img
                                    src={product.imageUrl}
                                    alt={product.name}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-4xl text-gray-300">
                                    🖼️
                                </div>
                            )}
                            <div className="absolute top-4 left-4">
                                <span className="bg-white/90 backdrop-blur text-green-700 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm border border-green-100">
                                    {MOCK_PRODUCT_DETAILS.status}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Details */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Core Info Card */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
                        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>

                                <div className="flex items-center gap-4 text-sm">
                                    <div className="flex items-center text-amber-500 font-bold gap-1">
                                        <Star size={16} className="fill-current" />
                                        <span>{MOCK_PRODUCT_DETAILS.rating}</span>
                                        <span className="text-gray-400 font-normal">({MOCK_PRODUCT_DETAILS.reviews} reviews)</span>
                                    </div>
                                    <div className="w-px h-4 bg-gray-200"></div>
                                    <div className="flex items-center gap-1.5 text-gray-500">
                                        <Eye size={16} />
                                        <span>{MOCK_PRODUCT_DETAILS.views.toLocaleString()} views</span>
                                    </div>
                                </div>
                            </div>

                            <div className="text-right">
                                <div className="text-3xl font-bold text-gray-900">${MOCK_PRODUCT_DETAILS.price}</div>
                                <div className="text-sm text-gray-500 font-medium">USD</div>
                            </div>
                        </div>

                        <div className="prose prose-gray max-w-none">
                            <h3 className="text-base font-semibold text-gray-900 mb-2">Description</h3>
                            <p className="text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">
                                {product.shortDescription || "No description available for this product."}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
                            <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                                <div className="text-xs text-gray-500 font-medium mb-1">SKU</div>
                                <div className="font-mono text-sm font-semibold text-gray-900">{MOCK_PRODUCT_DETAILS.sku}</div>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                                <div className="text-xs text-gray-500 font-medium mb-1">Stock</div>
                                <div className="font-mono text-sm font-semibold text-gray-900">{MOCK_PRODUCT_DETAILS.stock} units</div>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                                <div className="text-xs text-gray-500 font-medium mb-1">Created</div>
                                <div className="font-mono text-sm font-semibold text-gray-900">Jan 15, 2024</div>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                                <div className="text-xs text-gray-500 font-medium mb-1">Weight</div>
                                <div className="font-mono text-sm font-semibold text-gray-900">1.2 lbs</div>
                            </div>
                        </div>
                    </div>

                    {/* Metadata Card */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Tag size={18} className="text-gray-400" />
                            Categories & Tags
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <span className="text-sm font-medium text-gray-500 block mb-2">Categories</span>
                                <div className="flex flex-wrap gap-2">
                                    {product.categoryIds.map((catId: string) => (
                                        <span key={catId} className="px-3 py-1 bg-indigo-50 text-indigo-700 text-sm font-medium rounded-full border border-indigo-100">
                                            {/* Fetch name by ID ideally, mocking for now */}
                                            Category {catId.substring(0, 6)}...
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-4 border-t border-gray-100">
                                <span className="text-sm font-medium text-gray-500 block mb-2">Technical Details</span>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 text-sm">
                                    <div className="flex justify-between max-w-xs">
                                        <span className="text-gray-500">Product ID:</span>
                                        <span className="font-mono text-gray-900">{product.id}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
