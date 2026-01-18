import React from "react";

interface BadgeProps {
    children: React.ReactNode;
    variant?: "success" | "warning" | "error" | "default";
}

export function Badge({ children, variant = "default" }: BadgeProps) {
    const variants = {
        success: "bg-green-50 text-green-700",
        warning: "bg-yellow-50 text-yellow-700",
        error: "bg-red-50 text-red-700",
        default: "bg-gray-100 text-gray-700",
    };

    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${variants[variant]}`}>
            <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${variant === 'success' ? 'bg-green-500' :
                    variant === 'warning' ? 'bg-yellow-500' :
                        variant === 'error' ? 'bg-red-500' :
                            'bg-gray-500'
                }`}></span>
            {children}
        </span>
    );
}
