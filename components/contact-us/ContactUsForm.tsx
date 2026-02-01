"use client";

import React, { useState, useEffect } from "react";
import { useStore, ContactUs } from "../../context/StoreContext";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

interface ContactUsFormProps {
    initialData?: ContactUs;
    onClose: () => void;
}

export function ContactUsForm({ initialData, onClose }: ContactUsFormProps) {
    const { addContactUs, updateContactUs } = useStore();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        message: "",
        status: "PENDING" as ContactUs["status"],
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name,
                email: initialData.email,
                phone: initialData.phone || "",
                message: initialData.message,
                status: initialData.status || "PENDING",
            });
        }
    }, [initialData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (initialData) {
            updateContactUs(initialData.id, formData);
        } else {
            addContactUs(formData);
        }
        onClose();
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
                label="Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
            />

            <Input
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
            />

            <Input
                label="Phone (optional)"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={4}
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as ContactUs["status"] })}
                >
                    <option value="PENDING">Pending</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="RESOLVED">Resolved</option>
                    <option value="CLOSED">Closed</option>
                    <option value="SPAM">Spam</option>
                </select>
            </div>

            <div className="flex justify-end gap-3 mt-4">
                <Button type="button" variant="secondary" onClick={onClose}>
                    Cancel
                </Button>
                <Button type="submit">
                    {initialData ? "Update" : "Add"}
                </Button>
            </div>
        </form>
    );
}
