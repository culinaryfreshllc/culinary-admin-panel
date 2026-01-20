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
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name,
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
