"use client";

import React, { useState, useEffect } from "react";
import { useStore, ContactUs } from "../../context/StoreContext";
import { ContactUsForm } from "./ContactUsForm";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { Edit2, Trash2, Filter, Search, Plus, Mail, Phone, User, MessageSquare } from "lucide-react";
import { Pagination } from "../ui/Pagination";
import { useRouter, useSearchParams } from "next/navigation";

interface PaginationProps {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}

export default function ContactUsList({ initialContactUs, pagination }: { initialContactUs?: ContactUs[], pagination?: PaginationProps }) {
    const { contactUs, deleteContactUs, setContactUs } = useStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingContactUs, setEditingContactUs] = useState<ContactUs | undefined>(undefined);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        if (initialContactUs) {
            setContactUs(initialContactUs);
        }
    }, [initialContactUs, setContactUs]);

    const filteredContactUs = contactUs.filter(c => {
        const matchesSearch = c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.message?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (c.subject && c.subject.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesStatus = statusFilter === "all" || c.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const handleEdit = (contactUs: ContactUs) => {
        setEditingContactUs(contactUs);
        setIsModalOpen(true);
    };

    const handleAdd = () => {
        setEditingContactUs(undefined);
        setIsModalOpen(true);
    };

    const handleDelete = (id: string) => {
        if (confirm("Are you sure you want to delete this contact?")) {
            deleteContactUs(id);
        }
    };

    const getStatusBadgeVariant = (status: string) => {
        switch (status) {
            case "RESOLVED": return "success";
            case "CLOSED": return "default";
            case "IN_PROGRESS": return "warning";
            case "SPAM": return "error";
            default: return "warning"; // PENDING
        }
    };

    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", newPage.toString());
        router.push(`?${params.toString()}`);
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
                            placeholder="Search contacts..."
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <select
                        className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="all">All Status</option>
                        <option value="PENDING">Pending</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="RESOLVED">Resolved</option>
                        <option value="CLOSED">Closed</option>
                        <option value="SPAM">Spam</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 font-medium">
                        <tr>
                            <th className="px-6 py-4">Contact Info</th>
                            <th className="px-6 py-4">Message</th>
                            <th className="px-6 py-4">Date</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredContactUs.map((contact) => (
                            <tr
                                key={contact.id}
                                className="hover:bg-gray-50/50 transition-colors group cursor-pointer"
                                onClick={() => router.push(`/contact-us/${contact.id}`)}
                            >
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-white font-bold shrink-0">
                                            <User size={20} />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900">{contact.name}</p>
                                            <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                                                <Mail size={12} /> {contact.email}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-gray-600 max-w-md">
                                    <div className="flex flex-col gap-1">
                                        {contact.subject && <span className="font-medium text-gray-900">{contact.subject}</span>}
                                        <p className="truncate">{contact.message}</p>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-gray-600">
                                    {new Date(contact.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4">
                                    <Badge variant={getStatusBadgeVariant(contact.status)}>
                                        {contact.status}
                                    </Badge>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleEdit(contact); }}
                                            className="p-2 text-primary bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors flex items-center gap-1 text-xs font-semibold"
                                        >
                                            <Edit2 size={14} /> Edit
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleDelete(contact.id); }}
                                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {pagination && (
                <div className="border-t border-gray-100 px-6">
                    <Pagination
                        currentPage={pagination.page}
                        totalPages={pagination.totalPages}
                        onPageChange={handlePageChange}
                        hasNextPage={pagination.hasNextPage}
                        hasPrevPage={pagination.hasPrevPage}
                    />
                </div>
            )}

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingContactUs ? "Edit Contact" : "Add New Contact"}
            >
                <ContactUsForm
                    initialData={editingContactUs}
                    onClose={() => setIsModalOpen(false)}
                />
            </Modal>
        </div>
    );
}
