"use client";

import { useState, useEffect } from "react";
import { AboutUs } from "../../context/StoreContext";
import { AboutUsForm } from "./AboutUsForm";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { Edit2, FileText, Trash2 } from "lucide-react";
import api from "../../lib/axios";
import { useRouter } from "next/navigation";

interface AboutUsListProps {
    initialData?: AboutUs | null;
}

export default function AboutUsList({ initialData }: AboutUsListProps) {
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [aboutUsData, setAboutUsData] = useState<AboutUs | null>(initialData || null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        if (initialData) {
            setAboutUsData(initialData);
        }
    }, [initialData]);

    const handleCreate = () => {
        setAboutUsData(null); // Ensure no initial data for create mode
        setIsModalOpen(true);
    };

    const handleEdit = () => {
        setIsModalOpen(true);
    };

    const handleDelete = async () => {
        if (!aboutUsData || !confirm("Are you sure you want to delete this About Us content?")) return;

        setIsDeleting(true);
        try {
            await api.delete(`/about-us/${aboutUsData.id}`);
            setAboutUsData(null);
            router.refresh();
        } catch (error) {
            console.error("Failed to delete About Us:", error);
            alert("Failed to delete content. Please try again.");
        } finally {
            setIsDeleting(false);
        }
    };

    if (!aboutUsData) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-12 text-center text-gray-500 flex flex-col items-center">
                    <FileText size={48} className="mx-auto mb-3 text-gray-300" />
                    <p className="mb-4">No About Us content found.</p>
                    <Button onClick={handleCreate}>
                        Add About Us
                    </Button>
                </div>
                <Modal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    title="Add About Us Content"
                >
                    <AboutUsForm
                        onClose={() => setIsModalOpen(false)}
                    />
                </Modal>
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
                                <div className="w-12 h-12 rounded-lg bg-linear-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white shrink-0">
                                    <FileText size={24} />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 text-xl">{aboutUsData.title}</h3>
                                    <p className="text-xs text-gray-500">
                                        Last updated: {aboutUsData.updatedAt
                                            ? new Date(aboutUsData.updatedAt).toLocaleDateString()
                                            : (aboutUsData.createdAt
                                                ? new Date(aboutUsData.createdAt).toLocaleDateString()
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
                        <div className="flex flex-col gap-2">
                            <Button
                                onClick={handleEdit}
                                variant="secondary"
                                icon={<Edit2 size={16} />}
                            >
                                Edit
                            </Button>
                            <Button
                                onClick={handleDelete}
                                variant="danger"
                                icon={<Trash2 size={16} />}
                                disabled={isDeleting}
                            >
                                {isDeleting ? "Deleting..." : "Delete"}
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
