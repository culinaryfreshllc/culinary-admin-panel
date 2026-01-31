"use client";

import { useState, useEffect } from "react";
import { AboutUs } from "../../context/StoreContext";
import { AboutUsForm } from "./AboutUsForm";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { Edit2, FileText, Trash2, Plus } from "lucide-react";
import api from "../../lib/axios";
import { useRouter } from "next/navigation";

interface AboutUsListProps {
    initialData?: AboutUs[];
}

export default function AboutUsList({ initialData = [] }: AboutUsListProps) {
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [aboutUsItems, setAboutUsItems] = useState<AboutUs[]>(initialData);
    const [editingItem, setEditingItem] = useState<AboutUs | undefined>(undefined);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    useEffect(() => {
        setAboutUsItems(initialData);
    }, [initialData]);

    const handleCreate = () => {
        setEditingItem(undefined);
        setIsModalOpen(true);
    };

    const handleEdit = (item: AboutUs) => {
        setEditingItem(item);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this About Us item?")) return;

        setDeletingId(id);
        try {
            await api.delete(`/about-us/${id}`);
            router.refresh();
        } catch (error) {
            console.error("Failed to delete About Us:", error);
            alert("Failed to delete item. Please try again.");
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Header with Add Button */}
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900">About Us Items</h2>
                    <p className="text-sm text-gray-500 mt-0.5">
                        Manage your about us content ({aboutUsItems.length} {aboutUsItems.length === 1 ? 'item' : 'items'})
                    </p>
                </div>
                <Button onClick={handleCreate} icon={<Plus size={16} />}>
                    Add About Us
                </Button>
            </div>

            {/* Items List */}
            <div className="p-6">
                {aboutUsItems.length === 0 ? (
                    <div className="text-center text-gray-500 py-12 flex flex-col items-center">
                        <FileText size={48} className="mx-auto mb-3 text-gray-300" />
                        <p className="mb-4">No About Us content found.</p>
                        <Button onClick={handleCreate}>
                            Add Your First About Us Item
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {aboutUsItems.map((item) => (
                            <div
                                key={item.id}
                                className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white shrink-0">
                                                <FileText size={24} />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-900 text-xl">{item.title}</h3>
                                                {item.titleDescription && (
                                                    <p className="text-sm text-gray-600 mt-0.5">{item.titleDescription}</p>
                                                )}
                                                <p className="text-xs text-gray-500 mt-1">
                                                    Last updated: {item.updatedAt
                                                        ? new Date(item.updatedAt).toLocaleDateString()
                                                        : (item.createdAt
                                                            ? new Date(item.createdAt).toLocaleDateString()
                                                            : 'N/A')}
                                                </p>
                                            </div>
                                        </div>
                                        {item.subtitle && (
                                            <h4 className="text-lg font-medium text-gray-800 mb-2">{item.subtitle}</h4>
                                        )}
                                        <div className="prose prose-sm max-w-none">
                                            <p className="text-gray-600 leading-relaxed line-clamp-3">{item.content}</p>
                                        </div>
                                        {item.imageUrl && (
                                            <div className="mt-4">
                                                <img
                                                    src={item.imageUrl}
                                                    alt={item.title}
                                                    className="rounded-lg max-w-xs h-32 object-cover"
                                                />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Button
                                            onClick={() => handleEdit(item)}
                                            variant="secondary"
                                            icon={<Edit2 size={16} />}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            onClick={() => handleDelete(item.id)}
                                            variant="danger"
                                            icon={<Trash2 size={16} />}
                                            disabled={deletingId === item.id}
                                        >
                                            {deletingId === item.id ? "Deleting..." : "Delete"}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingItem ? "Edit About Us Item" : "Add About Us Item"}
            >
                <AboutUsForm
                    initialData={editingItem}
                    onClose={() => setIsModalOpen(false)}
                />
            </Modal>
        </div>
    );
}
