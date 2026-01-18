"use client";

import React, { useState, useEffect } from "react";
import { useStore, Category } from "../../context/StoreContext";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import api from "../../lib/axios";
import { useRouter } from "next/navigation";

interface CategoryFormProps {
    initialData?: Category;
    onClose: () => void;
}

export function CategoryForm({ initialData, onClose }: CategoryFormProps) {
    const { addCategory, updateCategory } = useStore();
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        image_url: "",
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name,
                description: initialData.description || "",
                image_url: initialData.image_url || "",
            });
        }
    }, [initialData]);

    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (initialData) {
                await api.put(`/categories/${initialData.id}`, {
                    name: formData.name
                });
            } else {
                await api.post('/categories', {
                    name: formData.name
                });
            }
            router.refresh();
            onClose();
        } catch (error) {
            console.error("Failed to save category:", error);
            alert("Failed to save category. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
                label="Category Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
            />

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    required
                />
            </div>

            <Input
                label="Image URL (optional)"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
            />

            <div className="flex justify-end gap-3 mt-4">
                <Button type="button" variant="secondary" onClick={onClose}>
                    Cancel
                </Button>
                <Button type="submit">
                    {initialData ? "Update Category" : "Add Category"}
                </Button>
            </div>
        </form>
    );
}
