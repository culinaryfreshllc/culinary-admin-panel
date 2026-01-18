"use client";

import React, { useState, useEffect } from "react";
import { useStore, AboutUs } from "../../context/StoreContext";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

interface AboutUsFormProps {
    initialData?: AboutUs;
    onClose: () => void;
}

export function AboutUsForm({ initialData, onClose }: AboutUsFormProps) {
    const { addAboutUs, updateAboutUs } = useStore();
    const [formData, setFormData] = useState({
        title: "",
        content: "",
        image_url: "",
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                title: initialData.title,
                content: initialData.content,
                image_url: initialData.image_url || "",
            });
        }
    }, [initialData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (initialData) {
            updateAboutUs(initialData.id, formData);
        } else {
            addAboutUs(formData);
        }
        onClose();
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
                label="Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
            />

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                <textarea
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    rows={6}
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
                    {initialData ? "Update Content" : "Add Content"}
                </Button>
            </div>
        </form>
    );
}
