"use client";

import React, { useState, useEffect } from "react";
import { CompanyInfo } from "../../context/StoreContext";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import api from "../../lib/axios";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

const LeafletMap = dynamic(() => import("../ui/LeafletMap"), { ssr: false });

interface CompanyInfoFormProps {
    initialData?: CompanyInfo;
    onClose: () => void;
}

export function CompanyInfoForm({ initialData, onClose }: CompanyInfoFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        companyName: "",
        phone: "",
        email: "",
        address: "",
        location: "",
        businessHours: "",
        latitude: undefined as number | undefined,
        longitude: undefined as number | undefined,
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                companyName: initialData.companyName,
                phone: initialData.phone,
                email: initialData.email,
                address: initialData.address,
                location: initialData.location,
                businessHours: initialData.businessHours,
                latitude: initialData.latitude,
                longitude: initialData.longitude,
            });
        }
    }, [initialData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (initialData) {
                // Update existing
                await api.put(`/company-info/${initialData.id}`, formData);
            } else {
                // Create new
                await api.post('/company-info', formData);
            }

            router.refresh();
            onClose();
        } catch (error) {
            console.error("Failed to save Company Info:", error);
            alert("Failed to save. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
                label="Company Name"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                    label="Phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                />
                <Input
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <textarea
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    rows={3}
                    required
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                    label="Location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    required
                />
                <Input
                    label="Business Hours"
                    value={formData.businessHours}
                    onChange={(e) => setFormData({ ...formData, businessHours: e.target.value })}
                    placeholder="e.g. Mon-Fri 9AM-6PM"
                    required
                />
            </div>

            {/* Dummy Map Selector */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location Coordinates</label>
                <div className="grid grid-cols-2 gap-4 mb-3">
                    <Input
                        label="Latitude"
                        type="number"
                        step="any"
                        value={formData.latitude || ""}
                        onChange={(e) => setFormData({ ...formData, latitude: parseFloat(e.target.value) })}
                        placeholder="e.g. 25.2048"
                    />
                    <Input
                        label="Longitude"
                        type="number"
                        step="any"
                        value={formData.longitude || ""}
                        onChange={(e) => setFormData({ ...formData, longitude: parseFloat(e.target.value) })}
                        placeholder="e.g. 55.2708"
                    />
                </div>

                <div className="border border-gray-200 rounded-xl overflow-hidden bg-gray-50 h-[300px]">
                    <LeafletMap
                        center={
                            (formData.latitude && formData.longitude)
                                ? [formData.latitude, formData.longitude]
                                : [25.2048, 55.2708]
                        }
                        markerPosition={
                            (formData.latitude && formData.longitude)
                                ? [formData.latitude, formData.longitude]
                                : null
                        }
                        onPositionChange={(lat, lng) => {
                            setFormData(prev => ({ ...prev, latitude: lat, longitude: lng }));
                        }}
                    />
                </div>
            </div>

            <div className="flex justify-end gap-3 mt-4">
                <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>
                    Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                    {loading ? "Saving..." : (initialData ? "Update Info" : "Add Info")}
                </Button>
            </div>
        </form>
    );
}
