"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import api from "../../../lib/axios";
import { ChevronLeft, Mail, Calendar, Clock, User, Trash2, ShieldAlert } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { Badge } from "../../../components/ui/Badge";
import { ContactUs } from "../../../context/StoreContext";
import { useParams, useRouter } from "next/navigation";

export default function ContactDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const [contact, setContact] = useState<ContactUs | null>(null);
    const [loading, setLoading] = useState(true);
    const [permissionDenied, setPermissionDenied] = useState(false);
    const [updatingStatus, setUpdatingStatus] = useState(false);

    useEffect(() => {
        const fetchContactDetails = async () => {
            if (!id) return;
            try {
                const response = await api.get(`/contact-us/${id}`);
                // API returns { message, data }
                setContact(response.data.data || response.data);
            } catch (error: any) {
                if (error.response && error.response.status === 403) {
                    setPermissionDenied(true);
                } else {
                    console.error("Failed to fetch contact details:", error);
                }
            } finally {
                setLoading(false);
            }
        };
        fetchContactDetails();
    }, [id]);

    const handleStatusChange = async (newStatus: ContactUs["status"]) => {
        if (!contact) return;
        setUpdatingStatus(true);
        try {
            await api.patch(`/contact-us/${id}/status`, { status: newStatus });
            setContact({ ...contact, status: newStatus });
        } catch (error) {
            console.error("Failed to update status:", error);
            alert("Failed to update status. Please try again.");
        } finally {
            setUpdatingStatus(false);
        }
    };

    const handleDelete = async () => {
        if (confirm("Are you sure you want to delete this message?")) {
            try {
                await api.delete(`/contact-us/${id}`);
                router.push('/contact-us');
            } catch (error) {
                console.error("Failed to delete contact:", error);
                alert("Failed to delete contact.");
            }
        }
    };

    if (loading) {
        return <div className="p-12 text-center text-gray-500">Loading message details...</div>;
    }

    if (permissionDenied) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center bg-red-50 rounded-xl border border-red-100 space-y-4">
                <div className="p-3 bg-red-100 rounded-full">
                    <ShieldAlert className="text-red-600" size={32} />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-red-800 mb-2">Access Denied</h2>
                    <p className="text-red-600 max-w-md mx-auto">
                        You do not have permission to view this message.
                    </p>
                </div>
                <Button
                    variant="secondary"
                    onClick={() => {
                        localStorage.removeItem('token');
                        localStorage.removeItem('refreshToken');
                        window.location.href = '/login';
                    }}
                >
                    Log in with different account
                </Button>
            </div>
        );
    }

    if (!contact) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center bg-gray-50 rounded-xl border border-gray-100">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">Message Not Found</h1>
                <p className="text-gray-500 mb-6">The message you are looking for does not exist or has been deleted.</p>
                <Link href="/contact-us">
                    <Button variant="secondary" icon={<ChevronLeft size={16} />}>Back to Contact List</Button>
                </Link>
            </div>
        );
    }

    const { name, email, subject, message, createdAt, status } = contact;

    const getStatusVariant = (s: string) => {
        switch (s) {
            case "RESOLVED": return "success";
            case "CLOSED": return "default";
            case "IN_PROGRESS": return "warning";
            case "SPAM": return "error";
            default: return "warning"; // PENDING
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/contact-us" className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500">
                        <ChevronLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Message Details</h1>
                        <p className="text-sm text-gray-500">View and manage customer inquiry</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="danger" onClick={handleDelete} icon={<Trash2 size={16} />}>Delete</Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content: Message */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-start">
                            <div>
                                <h2 className="text-xl font-bold text-gray-800 mb-1">{subject || "No Subject"}</h2>
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <Clock size={14} />
                                    <span>{new Date(createdAt).toLocaleString()}</span>
                                </div>
                            </div>
                            <Badge variant={getStatusVariant(status)}>{status}</Badge>
                        </div>
                        <div className="p-8">
                            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-lg">{message}</p>
                        </div>
                    </div>

                    {/* Status Management */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Update Status</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {(["PENDING", "IN_PROGRESS", "RESOLVED", "CLOSED", "SPAM"] as const).map((statusOption) => (
                                <button
                                    key={statusOption}
                                    onClick={() => handleStatusChange(statusOption)}
                                    disabled={updatingStatus || status === statusOption}
                                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${status === statusOption
                                            ? "bg-primary text-white"
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                                >
                                    {statusOption}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar: Sender Info */}
                <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Sender Information</h3>

                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-md">
                                {name ? name.charAt(0).toUpperCase() : <User size={32} />}
                            </div>
                            <div>
                                <p className="text-lg font-bold text-gray-900">{name}</p>
                                <p className="text-sm text-gray-500">Customer</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                <Mail size={18} className="text-gray-400 mt-0.5" />
                                <div>
                                    <p className="text-xs text-gray-400 font-medium">Email Address</p>
                                    <a href={`mailto:${email}`} className="text-sm font-medium text-primary hover:underline break-all">{email}</a>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                <Calendar size={18} className="text-gray-400 mt-0.5" />
                                <div>
                                    <p className="text-xs text-gray-400 font-medium">Received On</p>
                                    <p className="text-sm font-medium text-gray-700">
                                        {new Date(createdAt).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
