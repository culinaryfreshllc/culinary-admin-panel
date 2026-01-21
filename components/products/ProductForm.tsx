"use client";

import React, { useState, useEffect } from "react";
import { useStore, Product, ProductStatus } from "../../context/StoreContext";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { MultiSelect } from "../ui/MultiSelect";
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
        shortDescription: "",
        imageUrl: "",
        categoryId: [] as string[],
        // Keeping these for UI state even if API doesn't use them all yet
        // price: 0,
        // stock: 0,

        category: "",
        status: "In Stock" as ProductStatus,
        featured: false,
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

            // Extract category IDs - API returns categoryIds array
            const categoryIds = (initialData as any).categoryIds
                || ((initialData as any).categories
                    ? (initialData as any).categories.map((cat: any) => cat.id || cat._id)
                    : initialData.categoryId || []);

            setFormData({
                name: initialData.name,
                shortDescription: initialData.description || "",
                imageUrl: initialData.imageUrl || "",
                categoryId: categoryIds,
                // price: initialData.price,
                // stock: initialData.stock,

                category: initialData.category,
                status: initialData.status,
                featured: initialData.featured,
            });

        }
    }, [initialData, categoryOptions]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (initialData) {
                // Update logic
                await api.put(`/products/${initialData.id}`, {
                    name: formData.name,
                    shortDescription: formData.shortDescription,
                    imageUrl: formData.imageUrl,
                    categoryId: formData.categoryId,
                });

                // Refresh the page to show updated data
                router.refresh();
                onClose();
            } else {
                // Create logic
                const payload = {
                    name: formData.name,
                    shortDescription: formData.shortDescription,
                    imageUrl: formData.imageUrl,
                    categoryId: formData.categoryId.length > 0 ? formData.categoryId : [] // Default if empty
                };

                const response = await api.post('/products', payload);

                // Refresh the page to show new data since we're using server components for the main list
                router.refresh();
                onClose();
            }
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
                    value={formData.shortDescription}
                    onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                    required
                />
            </div>

            <ImageUpload
                value={formData.imageUrl}
                onChange={(url) => setFormData({ ...formData, imageUrl: url })}
                required
            />

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Categories</label>
                <MultiSelect
                    options={categoryOptions.map(c => ({ label: c.name, value: c.id }))}
                    selected={formData.categoryId}
                    onChange={(selected) => setFormData({ ...formData, categoryId: selected })}
                    placeholder="Select categories..."
                />
            </div>

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
