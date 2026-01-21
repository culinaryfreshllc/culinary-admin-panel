"use client";

import React, { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";
import api from "../../lib/axios";

interface ImageUploadProps {
    value?: string;
    onChange: (url: string) => void;
    required?: boolean;
    label?: string;
}

export function ImageUpload({ value, onChange, required = false, label = "Product Image" }: ImageUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string>("");
    const [preview, setPreview] = useState<string>(value || "");

    useEffect(() => {
        setPreview(value || "");
    }, [value]);

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        if (acceptedFiles.length === 0) return;

        const file = acceptedFiles[0];



        setError("");
        setUploading(true);

        try {
            const formData = new FormData();
            formData.append("file", file);

            const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
            const baseURL = process.env.NEXT_PUBLIC_API_URL || '';

            const response = await fetch(`${baseURL}/upload`, {
                method: 'POST',
                headers: {
                    ...(token && { 'Authorization': `Bearer ${token}` }),
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`Upload failed with status ${response.status}`);
            }

            const data = await response.json();
            const imageUrl = data.url;

            setPreview(imageUrl);
            onChange(imageUrl);
        } catch (err: any) {
            console.error("Upload failed:", err);
            setError(err.message || "Failed to upload image. Please try again.");
        } finally {
            setUploading(false);
        }
    }, [onChange]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"],
        },
        maxFiles: 1,
        disabled: uploading,
    });

    const handleRemove = (e: React.MouseEvent) => {
        e.stopPropagation();
        setPreview("");
        onChange("");
        setError("");
    };

    return (
        <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">
                {label} {required && <span className="text-red-500">*</span>}
            </label>

            {preview ? (
                <div className="relative w-full h-48 rounded-lg border-2 border-gray-200 overflow-hidden group">
                    <img
                        src={preview}
                        alt="Product preview"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                            type="button"
                            onClick={handleRemove}
                            className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-colors flex items-center gap-2"
                        >
                            <X size={18} />
                            Remove Image
                        </button>
                    </div>
                </div>
            ) : (
                <div
                    {...getRootProps()}
                    className={`w-full h-48 border-2 border-dashed rounded-lg transition-all cursor-pointer ${isDragActive
                        ? "border-indigo-500 bg-indigo-50"
                        : uploading
                            ? "border-gray-300 bg-gray-50 cursor-not-allowed"
                            : "border-gray-300 hover:border-indigo-400 hover:bg-gray-50"
                        }`}
                >
                    <input {...getInputProps()} />
                    <div className="h-full flex flex-col items-center justify-center gap-3 px-4">
                        {uploading ? (
                            <>
                                <Loader2 className="text-indigo-500 animate-spin" size={40} />
                                <p className="text-sm font-medium text-gray-600">Uploading...</p>
                            </>
                        ) : (
                            <>
                                <div className="w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center">
                                    <Upload className="text-indigo-500" size={28} />
                                </div>
                                <div className="text-center">
                                    <p className="text-sm font-medium text-gray-700">
                                        {isDragActive ? (
                                            "Drop the image here"
                                        ) : (
                                            <>
                                                <span className="text-indigo-600 font-semibold">Click to upload</span> or drag and drop
                                            </>
                                        )}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        PNG, JPG, GIF, WEBP
                                    </p>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}

            {error && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <span className="font-medium">Error:</span> {error}
                </p>
            )}
        </div>
    );
}
