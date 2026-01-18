"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { usePathname, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isChecking, setIsChecking] = useState(true);
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token && pathname !== '/login') {
            router.push('/login');
        } else if (token && pathname === '/login') {
            router.push('/');
        } else {
            setIsChecking(false);
        }
    }, [pathname, router]);

    if (isChecking) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="animate-spin text-indigo-600" size={40} />
            </div>
        );
    }

    if (pathname === '/login') {
        return <>{children}</>;
    }

    return (
        <div className="flex min-h-screen bg-[#F3F4F6]">
            <Sidebar isCollapsed={isCollapsed} toggleSidebar={() => setIsCollapsed(!isCollapsed)} />

            <div
                className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out ${isCollapsed ? "ml-20" : "ml-64"
                    }`}
            >
                <Header collapsed={isCollapsed} />
                <main className="flex-1 p-6 md:p-8 overflow-y-auto w-full max-w-[1600px] mx-auto animate-in fade-in duration-500">
                    {children}
                </main>
            </div>
        </div>
    );
}
