"use client";

import { useState } from "react";
import { useStore, AboutUs } from "../../context/StoreContext";
import { AboutUsForm } from "./AboutUsForm";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { Edit2, Trash2, Search, Plus, FileText } from "lucide-react";

export default function AboutUsList() {
    const { aboutUs, deleteAboutUs } = useStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAboutUs, setEditingAboutUs] = useState<AboutUs | undefined>(undefined);
    const [searchTerm, setSearchTerm] = useState("");

    const filteredAboutUs = aboutUs.filter(a =>
        a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.content.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleEdit = (aboutUs: AboutUs) => {
        setEditingAboutUs(aboutUs);
        setIsModalOpen(true);
    };

    const handleAdd = () => {
        setEditingAboutUs(undefined);
        setIsModalOpen(true);
    };

    const handleDelete = (id: string) => {
        if (confirm("Are you sure you want to delete this content?")) {
            deleteAboutUs(id);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Filters and Actions Bar */}
            <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3 flex-1">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search content..."
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button onClick={handleAdd} icon={<Plus size={16} />}>Add Content</Button>
                </div>
            </div>

            {/* Content Cards */}
            <div className="p-5 space-y-4">
                {filteredAboutUs.map((item) => (
                    <div key={item.id} className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white shrink-0">
                                        <FileText size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 text-lg">{item.title}</h3>
                                        <p className="text-xs text-gray-500">
                                            {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'N/A'}
                                        </p>
                                    </div>
                                </div>
                                <p className="text-gray-600 text-sm leading-relaxed">{item.content}</p>
                                {item.image_url && (
                                    <div className="mt-3">
                                        <img
                                            src={item.image_url}
                                            alt={item.title}
                                            className="rounded-lg max-w-xs h-32 object-cover"
                                        />
                                    </div>
                                )}
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => handleEdit(item)}
                                    className="p-2 text-primary bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors flex items-center gap-1 text-xs font-semibold"
                                >
                                    <Edit2 size={14} /> Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(item.id)}
                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {filteredAboutUs.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        <FileText size={48} className="mx-auto mb-3 text-gray-300" />
                        <p>No content found. Click "Add Content" to create your first entry.</p>
                    </div>
                )}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingAboutUs ? "Edit About Us Content" : "Add About Us Content"}
            >
                <AboutUsForm
                    initialData={editingAboutUs}
                    onClose={() => setIsModalOpen(false)}
                />
            </Modal>
        </div>
    );
}
