"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import ContactUsList from "../../components/contact-us/ContactUsList";
import api from "../../lib/axios";
import { ContactUs } from "../../context/StoreContext";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "../../components/ui/Button";
import { ShieldAlert } from "lucide-react";

export default function ContactUsPage() {
    const searchParams = useSearchParams();
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const [contactUs, setContactUsState] = useState<ContactUs[]>([]);
    const [pagination, setPagination] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [permissionDenied, setPermissionDenied] = useState(false);

    useEffect(() => {
        const fetchContactUs = async () => {
            setLoading(true);
            try {
                const response = await api.get(`/contact-us?page=${page}&limit=${limit}`);
                setContactUsState(response.data.data);
                setPagination(response.data.pagination);
            } catch (error: any) {
                if (error.response && error.response.status === 403) {
                    setPermissionDenied(true);
                } else {
                    console.error("Failed to fetch contact us data:", error);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchContactUs();
    }, [page, limit]);

    if (loading) {
        return <div className="p-6 text-center text-gray-500">Loading contacts...</div>;
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
                        You do not have permission to view this page. This might happen if your session has expired or your account lacks the necessary role.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        variant="secondary"
                        onClick={() => window.location.reload()}
                    >
                        Retry
                    </Button>
                    <Button
                        variant="danger"
                        onClick={() => {
                            localStorage.removeItem('token');
                            window.location.href = '/login';
                        }}
                    >
                        Log in with different account
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-800">Contact Us</h1>
            </div>
            <ContactUsList initialContactUs={contactUs} pagination={pagination} />
        </div>
    );
}
