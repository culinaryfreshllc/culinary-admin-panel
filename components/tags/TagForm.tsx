"use client";

import React, { useState, useEffect } from "react";
import { useStore, Tag } from "../../context/StoreContext";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

interface TagFormProps {
    initialData?: Tag;
    onClose: () => void;
}

export function TagForm({ initialData, onClose }: TagFormProps) {
    const { addTag, updateTag } = useStore();
    const [formData, setFormData] = useState({
        name: "",
        slug: "",
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name,
                slug: initialData.slug,
            });
        }
    }, [initialData]);

    // Auto-generate slug from name if not manually edited
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.value;
        setFormData(prev => ({
            ...prev,
            name,
            slug: !initialData ? name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') : prev.slug
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (initialData) {
            updateTag(initialData.id, formData);
        } else {
            addTag(formData);
        }
        onClose();
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
                label="Tag Name"
                value={formData.name}
                onChange={handleNameChange}
                required
            />
            <Input
                label="Slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                required
            />

            <div className="flex justify-end gap-3 mt-4">
                <Button type="button" variant="secondary" onClick={onClose}>
                    Cancel
                </Button>
                <Button type="submit">
                    {initialData ? "Update Tag" : "Add Tag"}
                </Button>
            </div>
        </form>
    );
}
