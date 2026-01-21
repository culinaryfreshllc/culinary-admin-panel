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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (initialData) {
                // Update existing About Us
                await api.put(`/about-us/${initialData.id}`, formData);
            } else {
                // Create new About Us (though typically there's only one)
                await api.post('/about-us', formData);
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
                value={formData.image_url}
                onChange={(url) => setFormData({ ...formData, image_url: url })}
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
