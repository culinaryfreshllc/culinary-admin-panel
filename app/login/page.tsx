"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api, { setAuthToken } from "../../lib/axios";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
    const [notification, setNotification] = useState("");
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setNotification("");

        try {
            const response = await api.post('/auth/login', formData);

            // Extract tokens from the new API response structure
            // Response: { message: "...", data: { accessToken, refreshToken, expiresIn } }
            const accessToken = response.data?.data?.accessToken;
            const refreshToken = response.data?.data?.refreshToken;

            if (!accessToken) {
                throw new Error("No access token received from server");
            }

            // Store tokens in localStorage
            setAuthToken(accessToken);
            if (refreshToken && typeof window !== 'undefined') {
                localStorage.setItem('refreshToken', refreshToken);
            }

            // Set Authorization header for immediate use
            api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

            setNotification("Login successful! Redirecting...");
            router.push('/');
        } catch (error: any) {
            console.error("Login failed:", error);
            setNotification(error.response?.data?.message || error.message || "Login failed. Please check your credentials.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 border border-gray-100">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
                    <p className="text-gray-500">Sign in to access your admin dashboard</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email Address
                        </label>
                        <input
                            type="email"
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-gray-50 focus:bg-white"
                            placeholder="admin@example.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            required
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-gray-50 focus:bg-white"
                            placeholder="••••••••"
                        />
                    </div>

                    {notification && (
                        <div className={`p-3 rounded-lg text-sm ${notification.includes("successful") ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}>
                            {notification}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="animate-spin" size={20} />
                                Signing in...
                            </>
                        ) : (
                            "Sign In"
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
