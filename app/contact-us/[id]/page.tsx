"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import api from "../../../lib/axios";
import { ChevronLeft, Mail, Phone, Calendar, Clock, User, Trash2, Archive, Reply, ShieldAlert } from "lucide-react";
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

    useEffect(() => {
        const fetchContactDetails = async () => {
            if (!id) return;
            try {
                const response = await api.get(`/contact-us/${id}`);
                setContact(response.data);
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

    const { name, email, phone, subject, message, createdAt, created_at, status } = contact;
    const date = createdAt || created_at;

    const getStatusVariant = (s?: string) => {
        switch (s) {
            case "responded": return "success";
            case "archived": return "default";
            default: return "warning";
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
                    <Button variant="secondary" icon={<Archive size={16} />}>Archive</Button>
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
                                    <span>{date ? new Date(date).toLocaleString() : "Unknown Date"}</span>
                                </div>
                            </div>
                            <Badge variant={getStatusVariant(status)}>{status || "pending"}</Badge>
                        </div>
                        <div className="p-8">
                            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-lg">{message}</p>
                        </div>
                    </div>

                    {/* Response Section Placeholder */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <Reply size={20} className="text-primary" />
                            Reply to Customer
                        </h3>
                        <textarea
                            className="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all min-h-[150px]"
                            placeholder="Type your response here..."
                        ></textarea>
                        <div className="flex justify-end mt-4">
                            <Button icon={<Reply size={16} />}>Send Response</Button>
                        </div>
                    </div>
                </div>

                {/* Sidebar: Sender Info */}
                <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Sender Information</h3>

                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-16 h-16 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-md">
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

                            {phone && (
                                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                    <Phone size={18} className="text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-xs text-gray-400 font-medium">Phone Number</p>
                                        <a href={`tel:${phone}`} className="text-sm font-medium text-gray-700 hover:text-primary">{phone}</a>
                                    </div>
                                </div>
                            )}

                            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                <Calendar size={18} className="text-gray-400 mt-0.5" />
                                <div>
                                    <p className="text-xs text-gray-400 font-medium">Received On</p>
                                    <p className="text-sm font-medium text-gray-700">
                                        {date ? new Date(date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : "N/A"}
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
