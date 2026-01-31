"use client";

import React, { useState, useEffect } from "react";
import { AboutUs } from "../../context/StoreContext";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { ImageUpload } from "../ui/ImageUpload";
import api from "../../lib/axios";
import { useRouter } from "next/navigation";

interface AboutUsFormProps {
    initialData?: AboutUs;
    onClose: () => void;
}

export function AboutUsForm({ initialData, onClose }: AboutUsFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        titleDescription: "",
        subtitle: "",
        content: "",
        imageUrl: "",
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                title: initialData.title,
                titleDescription: initialData.titleDescription || "",
                subtitle: initialData.subtitle || "",
                content: initialData.content,
                imageUrl: initialData.imageUrl || "",
            });
        }
    }, [initialData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Prepare payload with null for empty optional fields
            const payload = {
                title: formData.title,
                titleDescription: formData.titleDescription || null,
                subtitle: formData.subtitle || null,
                content: formData.content,
                imageUrl: formData.imageUrl || null,
            };

            if (initialData) {
                // Update existing About Us
                await api.put(`/about-us/${initialData.id}`, payload);
            } else {
                // Create new About Us
                await api.post('/about-us', payload);
            }

            // Refresh the page to show updated data
            router.refresh();
            onClose();
        } catch (error) {
            console.error("Failed to save About Us:", error);
            alert("Failed to save content. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
                label="Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
            />

            <Input
                label="Title Description"
                value={formData.titleDescription}
                onChange={(e) => setFormData({ ...formData, titleDescription: e.target.value })}
                placeholder="Brief description for the title"
            />

            <Input
                label="Subtitle"
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                placeholder="Subtitle text"
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

            <ImageUpload
                label="About Us Image"
                value={formData.imageUrl}
                onChange={(url) => setFormData({ ...formData, imageUrl: url })}
            />

            <div className="flex justify-end gap-3 mt-4">
                <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>
                    Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                    {loading ? "Saving..." : (initialData ? "Update Content" : "Add Content")}
                </Button>
            </div>
        </form>
    );
}
