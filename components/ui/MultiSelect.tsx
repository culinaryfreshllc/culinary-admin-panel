"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

interface Option {
    label: string;
    value: string;
}

interface MultiSelectProps {
    options: Option[];
    selected: string[];
    onChange: (selected: string[]) => void;
    placeholder?: string;
    className?: string;
}

export function MultiSelect({ options, selected, onChange, placeholder = "Select items...", className = "" }: MultiSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleOption = (value: string) => {
        if (selected.includes(value)) {
            onChange(selected.filter((item) => item !== value));
        } else {
            onChange([...selected, value]);
        }
    };

    return (
        <div className={`relative ${className}`} ref={containerRef}>
            <button
                type="button"
                className="w-full flex items-center justify-between px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex flex-wrap gap-1 max-w-[90%] overflow-hidden">
                    {selected.length > 0 ? (
                        selected.map((val) => {
                            const option = options.find((o) => o.value === val);
                            return (
                                <span key={val} className="px-1.5 py-0.5 bg-gray-100 text-gray-800 rounded text-xs font-medium truncate">
                                    {option ? option.label : val}
                                </span>
                            );
                        })
                    ) : (
                        <span className="text-gray-500">{placeholder}</span>
                    )}
                </div>
                <ChevronDown size={16} className={`text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </button>

            {isOpen && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    <div className="p-1 space-y-0.5">
                        {options.map((option) => {
                            const isSelected = selected.includes(option.value);
                            return (
                                <div
                                    key={option.value}
                                    className={`flex items-center gap-2 px-2 py-1.5 text-sm rounded cursor-pointer transition-colors ${isSelected ? "bg-gray-50 text-gray-900" : "text-gray-700 hover:bg-gray-50"
                                        }`}
                                    onClick={() => toggleOption(option.value)}
                                >
                                    <div
                                        className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${isSelected
                                            ? "bg-primary border-primary text-white"
                                            : "border-gray-300 bg-white"
                                            }`}
                                    >
                                        {isSelected && <Check size={12} />}
                                    </div>
                                    <span>{option.label}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
