"use client";

import React, { useState, useEffect } from "react";
import { useStore, Product, ProductStatus } from "../../context/StoreContext";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { ImageUpload } from "../ui/ImageUpload";
import api from "../../lib/axios";
import { useRouter } from "next/navigation";

interface ProductFormProps {
    initialData?: Product;
    onClose: () => void;
}

export function ProductForm({ initialData, onClose }: ProductFormProps) {
    const { addProduct, updateProduct, categories } = useStore();
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        imageUrl: "",
        categoryId: "", // Single category ID (string)
        status: "IN_STOCK" as "IN_STOCK" | "OUT_OF_STOCK",
        featured: false,
        category: "", // Category name
        rating: 0,
        reviews: 0,
        tag: "",
    });

    const [categoryOptions, setCategoryOptions] = useState<{ id: string, name: string }[]>([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await api.get('/categories');
                if (response.data && response.data.data) {
                    setCategoryOptions(response.data.data);
                }
            } catch (error) {
                console.error("Failed to fetch categories:", error);
            }
        };

        fetchCategories();
    }, []);

    useEffect(() => {
        if (initialData) {
            // Extract the first category ID from the API structure
            let categoryId = "";
            let categoryName = "";

            if ((initialData as any).categoryIds && Array.isArray((initialData as any).categoryIds) && (initialData as any).categoryIds.length > 0) {
                categoryId = (initialData as any).categoryIds[0];
            } else if ((initialData as any).categories && Array.isArray((initialData as any).categories) && (initialData as any).categories.length > 0) {
                categoryId = (initialData as any).categories[0].id;
                categoryName = (initialData as any).categories[0].name;
            } else if (initialData.categoryId && Array.isArray(initialData.categoryId) && initialData.categoryId.length > 0) {
                categoryId = initialData.categoryId[0];
            }

            // Status is already in correct format (IN_STOCK or OUT_OF_STOCK)
            const apiStatus = initialData.status === "IN_STOCK" ? "IN_STOCK" : "OUT_OF_STOCK";

            setFormData({
                name: initialData.name,
                description: initialData.description || "",
                imageUrl: initialData.imageUrl || "",
                categoryId: categoryId,
                status: apiStatus,
                featured: initialData.featured || false,
                category: categoryName || initialData.category || "",
                rating: initialData.rating || 0,
                reviews: initialData.reviews || 0,
                tag: initialData.tag || "",
            });
        }
    }, [initialData, categoryOptions]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Get the selected category name
            const selectedCategory = categoryOptions.find(cat => cat.id === formData.categoryId);

            const payload = {
                name: formData.name,
                description: formData.description,
                imageUrl: formData.imageUrl,
                categoryId: formData.categoryId,
                status: formData.status,
                featured: formData.featured,
                category: selectedCategory?.name || formData.category,
                rating: formData.rating,
                reviews: formData.reviews,
                tag: formData.tag || undefined, // Send undefined if empty
            };

            if (initialData) {
                // Update logic
                await api.put(`/products/${initialData.id}`, payload);
            } else {
                // Create logic
                await api.post('/products', payload);
            }

            // Refresh the page to show updated/new data
            router.refresh();
            onClose();
        } catch (error) {
            console.error("Failed to save product:", error);
            alert("Failed to save product");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
                label="Product Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
            />

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary min-h-[80px]"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                />
            </div>

            <ImageUpload
                value={formData.imageUrl}
                onChange={(url) => setFormData({ ...formData, imageUrl: url })}
                required
            />

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    required
                >
                    <option value="">Select a category...</option>
                    {categoryOptions.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value as "IN_STOCK" | "OUT_OF_STOCK" })}
                    >
                        <option value="IN_STOCK">In Stock</option>
                        <option value="OUT_OF_STOCK">Out of Stock</option>
                    </select>
                </div>

                <div className="flex items-center">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={formData.featured}
                            onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                            className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                        />
                        <span className="text-sm font-medium text-gray-700">Featured Product</span>
                    </label>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <Input
                    label="Rating (0-5)"
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    value={formData.rating.toString()}
                    onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) || 0 })}
                />

                <Input
                    label="Reviews Count"
                    type="number"
                    min="0"
                    value={formData.reviews.toString()}
                    onChange={(e) => setFormData({ ...formData, reviews: parseInt(e.target.value) || 0 })}
                />
            </div>

            <Input
                label="Tag (optional)"
                value={formData.tag}
                onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                placeholder="e.g., NEW, SALE, POPULAR"
            />

            <div className="flex justify-end gap-3 mt-4">
                <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>
                    Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                    {loading ? "Saving..." : (initialData ? "Update Product" : "Add Product")}
                </Button>
            </div>
        </form>
    );
}
