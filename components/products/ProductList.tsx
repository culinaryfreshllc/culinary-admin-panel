"use client";

import React, { useState } from "react";
import { useStore, Product } from "../../context/StoreContext";
import { ProductForm } from "./ProductForm";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { Edit2, Trash2, Filter, Search, Plus, MoreHorizontal } from "lucide-react";
import api from "../../lib/axios";
import { Pagination } from "../ui/Pagination";

import { useRouter, useSearchParams } from "next/navigation";

interface PaginationProps {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}

export default function ProductList({ initialProducts, pagination }: { initialProducts?: Product[], pagination?: PaginationProps }) {
    const { products, deleteProduct, toggleFeatured, setProducts } = useStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);
    const [searchTerm, setSearchTerm] = useState("");
    const router = useRouter();
    const searchParams = useSearchParams();

    React.useEffect(() => {
        if (initialProducts) {
            setProducts(initialProducts);
        }
    }, [initialProducts, setProducts]);

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };

    const handleAdd = () => {
        setEditingProduct(undefined);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this product?")) {
            try {
                await api.delete(`/products/${id}`);
                router.refresh();
                // We could also call deleteProduct(id) to optimistically update UI if we wanted
            } catch (error) {
                console.error("Failed to delete product:", error);
                alert("Failed to delete product");
            }
        }
    }

    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", newPage.toString());
        router.push(`?${params.toString()}`);
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Filters and Actions Bar */}
            <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3 flex-1">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search customer..."
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="hidden sm:flex items-center text-sm font-medium text-gray-600 gap-2">
                        <span className="text-gray-400">Show:</span>
                        <select className="bg-transparent border-none font-semibold text-gray-800 focus:ring-0 cursor-pointer">
                            <option>All Products</option>
                            <option>In Stock</option>
                            <option>Out of Stock</option>
                        </select>
                    </div>

                    <div className="hidden sm:flex items-center text-sm font-medium text-gray-600 gap-2">
                        <span className="text-gray-400">Sort by:</span>
                        <select className="bg-transparent border-none font-semibold text-gray-800 focus:ring-0 cursor-pointer">
                            <option>Default</option>
                        </select>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="secondary" icon={<Filter size={16} />}>Filter</Button>
                    <Button onClick={handleAdd} icon={<Plus size={16} />}>Add Product</Button>
                </div>
            </div>

            {/* Secondary filter row (categories etc) - simplified from screenshot */}
            <div className="px-5 py-3 border-b border-gray-100 bg-gray-50/50 flex flex-wrap gap-4 text-sm">
                <div className="flex flex-col">
                    <span className="text-xs text-black font-semibold mb-1">Category</span>
                    <select className="bg-white border border-gray-200 rounded px-2 py-1 text-gray-700 text-xs">
                        <option>Jackets (132)</option>
                        <option>Shoes</option>
                    </select>
                </div>
                <div className="flex flex-col">
                    <span className="text-xs text-black font-semibold mb-1">Status</span>
                    <select className="bg-white border border-gray-200 rounded px-2 py-1 text-gray-700 text-xs">
                        <option>All Status</option>
                        <option>In Stock</option>
                        <option>Out of Stock</option>
                    </select>
                </div>
                <div className="flex flex-col">
                    <span className="text-xs text-black font-semibold mb-1">Store</span>
                    <select className="bg-white border border-gray-200 rounded px-2 py-1 text-gray-700 text-xs">
                        <option>All Store</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 font-medium">
                        <tr>
                            <th className="px-6 py-4">Product</th>
                            <th className="px-6 py-4">Category</th>
                            <th className="px-6 py-4">Rating</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredProducts.map((product) => (
                            <tr key={product.id} className="hover:bg-gray-50/50 transition-colors group">
                                <td className="px-6 py-4">
                                    <div
                                        className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
                                        onClick={() => router.push(`/products/${product.id}`)}
                                    >
                                        <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-xl shrink-0 overflow-hidden relative group-hover:scale-105 transition-transform">
                                            {product.imageUrl ? (
                                                <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                                            ) : (
                                                "👕"
                                            )}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <p className="font-semibold text-gray-900 hover:text-indigo-600 transition-colors">{product.name}</p>
                                                {product.tag && (
                                                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-600 border border-blue-100 uppercase tracking-wide">
                                                        {product.tag}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-xs text-gray-500 line-clamp-1 max-w-[200px]">{product.description}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                        {product.category}
                                    </span>
                                </td>

                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-1">
                                        <span className="text-amber-400 text-sm">★</span>
                                        <span className="font-medium text-gray-700">{product.rating || 'N/A'}</span>
                                        <span className="text-xs text-gray-400">({product.reviews || 0})</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <Badge variant={product.status === 'In Stock' ? 'success' : 'default'}>
                                        {product.status}
                                    </Badge>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            onClick={() => handleEdit(product)}
                                            className="p-2 text-primary bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors flex items-center gap-1 text-xs font-semibold"
                                        >
                                            <Edit2 size={14} /> Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(product.id)}
                                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {pagination && (
                <div className="border-t border-gray-100 px-6">
                    <Pagination
                        currentPage={pagination.page}
                        totalPages={pagination.totalPages}
                        onPageChange={handlePageChange}
                        hasNextPage={pagination.hasNextPage}
                        hasPrevPage={pagination.hasPrevPage}
                    />
                </div>
            )}

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingProduct ? "Edit Product" : "Add New Product"}
            >
                <ProductForm
                    initialData={editingProduct}
                    onClose={() => setIsModalOpen(false)}
                />
            </Modal>
        </div>
    );
}
