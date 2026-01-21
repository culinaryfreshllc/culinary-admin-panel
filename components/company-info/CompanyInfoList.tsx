"use client";

import { useState } from "react";
import { CompanyInfo } from "../../context/StoreContext";
import { CompanyInfoForm } from "./CompanyInfoForm";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { Edit2, Shield, Trash2, MapPin, Phone, Mail, Clock, Plus } from "lucide-react";
import api from "../../lib/axios";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

const LeafletMap = dynamic(() => import("../ui/LeafletMap"), { ssr: false });

interface CompanyInfoListProps {
    initialData?: CompanyInfo[];
}

export default function CompanyInfoList({ initialData = [] }: CompanyInfoListProps) {
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingInfo, setEditingInfo] = useState<CompanyInfo | undefined>(undefined);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);

    // Singleton assumption: We only really care about the first one if it exists
    const companyInfo = initialData.length > 0 ? initialData[0] : null;

    const handleCreate = () => {
        setEditingInfo(undefined);
        setIsModalOpen(true);
    };

    const handleEdit = (info: CompanyInfo) => {
        setEditingInfo(info);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this company info?")) return;

        setIsDeleting(id);
        try {
            await api.delete(`/company-info/${id}`);
            router.refresh();
        } catch (error) {
            console.error("Failed to delete Company Info:", error);
            alert("Failed to delete. Please try again.");
        } finally {
            setIsDeleting(null);
        }
    };

    return (
        <div className="space-y-6">
            {/* Only show Add button if no data exists */}
            {!companyInfo && (
                <div className="flex justify-end">
                    <Button onClick={handleCreate} icon={<Plus size={16} />}>
                        Add Company Info
                    </Button>
                </div>
            )}

            {!companyInfo ? (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 text-center text-gray-500">
                    <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Shield size={32} className="text-indigo-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Company Info Added</h3>
                    <p className="max-w-md mx-auto mb-8 text-gray-400">
                        Get started by adding your company contact details, location, and business hours.
                    </p>
                    <Button onClick={handleCreate} icon={<Plus size={18} />}>
                        Add Company Info
                    </Button>
                </div>
            ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    {/* Header Banner */}
                    <div className="h-32 bg-linear-to-r from-slate-900 to-slate-800 relative">
                        <div className="absolute top-6 right-6 flex gap-2">
                            <Button
                                onClick={() => handleEdit(companyInfo)}
                                variant="secondary"
                                className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-white/30 backdrop-blur-md border"
                                icon={<Edit2 size={16} />}
                            >
                                Edit Details
                            </Button>
                            <Button
                                onClick={() => handleDelete(companyInfo.id)}
                                variant="danger"
                                className="bg-white/10 border-white/20 text-red-100 hover:text-white hover:bg-red-500/20 hover:border-red-500/30 backdrop-blur-md border"
                                icon={<Trash2 size={16} />}
                                disabled={isDeleting === companyInfo.id}
                            >
                                {isDeleting === companyInfo.id ? "..." : "Delete"}
                            </Button>
                        </div>
                    </div>

                    <div className="relative px-8 pb-8">
                        {/* Company Identity */}
                        <div className="mb-8 pt-2 ml-32">
                            <div className="absolute -top-12 left-8 w-24 h-24 rounded-2xl bg-white p-2 shadow-lg">
                                <div className="w-full h-full rounded-xl bg-indigo-600 flex items-center justify-center text-white">
                                    <Shield size={40} />
                                </div>
                            </div>
                            <div className="flex flex-col justify-end min-h-[3rem]">
                                <h1 className="text-2xl font-bold text-gray-900 leading-tight">{companyInfo.companyName}</h1>
                                <p className="text-sm text-gray-500 font-medium mt-1">{companyInfo.location}</p>
                            </div>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
                            {/* Contact Section */}
                            <div className="space-y-4">
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 pb-2">Contact Details</h3>
                                <div className="space-y-3">
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg shrink-0">
                                            <Phone size={18} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{companyInfo.phone}</p>
                                            <p className="text-xs text-gray-500">Main Line</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg shrink-0">
                                            <Mail size={18} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900 break-all">{companyInfo.email}</p>
                                            <p className="text-xs text-gray-500">Official Email</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Location Section */}
                            <div className="space-y-4">
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 pb-2">Location</h3>
                                <div className="space-y-3">
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg shrink-0">
                                            <MapPin size={18} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900 whitespace-pre-line">{companyInfo.address}</p>
                                        </div>
                                    </div>

                                    {(companyInfo.latitude !== undefined && companyInfo.longitude !== undefined) && (
                                        <div className="mt-3 bg-slate-50 border border-gray-100 rounded-xl overflow-hidden h-40">
                                            <LeafletMap
                                                center={[companyInfo.latitude, companyInfo.longitude]}
                                                markerPosition={[companyInfo.latitude, companyInfo.longitude]}
                                                readonly={true}
                                                zoom={13}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Hours Section */}
                            <div className="space-y-4">
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 pb-2">Business Hours</h3>
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-orange-50 text-orange-600 rounded-lg shrink-0">
                                        <Clock size={18} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">{companyInfo.businessHours}</p>
                                        <p className="text-xs text-gray-500">Standard Operating Time</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-gray-50 flex items-center justify-between text-xs text-gray-400">
                            <span>ID: <span className="font-mono">{companyInfo.id}</span></span>
                            <span>Last updated: {companyInfo.updatedAt ? new Date(companyInfo.updatedAt).toLocaleDateString() : 'N/A'}</span>
                        </div>
                    </div>
                </div>
            )}

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingInfo ? "Edit Company Info" : "Add Company Info"}
            >
                <CompanyInfoForm
                    initialData={editingInfo}
                    onClose={() => setIsModalOpen(false)}
                />
            </Modal>
        </div>
    );
}
