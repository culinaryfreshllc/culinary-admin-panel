"use client";

import { useState, useEffect } from "react";
import { AboutUs } from "../../context/StoreContext";
import { AboutUsForm } from "./AboutUsForm";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { Edit2, FileText } from "lucide-react";

interface AboutUsListProps {
    initialData?: AboutUs | null;
}

export default function AboutUsList({ initialData }: AboutUsListProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [aboutUsData, setAboutUsData] = useState<AboutUs | null>(initialData || null);

    useEffect(() => {
        if (initialData) {
            setAboutUsData(initialData);
        }
    }, [initialData]);

    const handleEdit = () => {
        setIsModalOpen(true);
    };

    if (!aboutUsData) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-12 text-center text-gray-500">
                    <FileText size={48} className="mx-auto mb-3 text-gray-300" />
                    <p>No About Us content found.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Content Display */}
            <div className="p-6">
                <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white shrink-0">
                                    <FileText size={24} />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 text-xl">{aboutUsData.title}</h3>
                                    <p className="text-xs text-gray-500">
                                        Last updated: {aboutUsData.updated_at
                                            ? new Date(aboutUsData.updated_at).toLocaleDateString()
                                            : (aboutUsData.created_at
                                                ? new Date(aboutUsData.created_at).toLocaleDateString()
                                                : 'N/A')}
                                    </p>
                                </div>
                            </div>
                            <div className="prose prose-sm max-w-none">
                                <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{aboutUsData.content}</p>
                            </div>
                            {aboutUsData.image_url && (
                                <div className="mt-4">
                                    <img
                                        src={aboutUsData.image_url}
                                        alt={aboutUsData.title}
                                        className="rounded-lg max-w-md h-48 object-cover"
                                    />
                                </div>
                            )}
                        </div>
                        <div>
                            <Button
                                onClick={handleEdit}
                                variant="secondary"
                                icon={<Edit2 size={16} />}
                            >
                                Edit
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Edit About Us Content"
            >
                <AboutUsForm
                    initialData={aboutUsData}
                    onClose={() => setIsModalOpen(false)}
                />
            </Modal>
        </div>
    );
}
