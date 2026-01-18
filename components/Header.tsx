"use client";

import { Search, Bell, Monitor, User, Menu } from "lucide-react";
import Image from "next/image";

interface HeaderProps {
    collapsed?: boolean;
}

export default function Header({ collapsed }: HeaderProps) {
    return (
        <header className="h-20 flex items-center justify-between px-8 bg-white/80 backdrop-blur-md sticky top-0 z-10 w-full transition-all duration-300">
            <div className="flex items-center gap-4 flex-1">
                <button className="md:hidden text-gray-500">
                    <Menu size={24} />
                </button>

                <div className="hidden md:flex items-center bg-gray-100/50 rounded-2xl px-4 py-2.5 w-96 border border-transparent focus-within:border-primary/50 focus-within:bg-white transition-all shadow-sm">
                    <Search className="text-gray-400 mr-2" size={18} />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="bg-transparent border-none outline-none text-sm w-full text-gray-700 placeholder-gray-400"
                    />
                    <div className="flex items-center gap-1">
                        <span className="text-[10px] text-gray-400 font-bold border border-gray-200 rounded px-1.5 py-0.5 bg-white">⌘</span>
                        <span className="text-[10px] text-gray-400 font-bold border border-gray-200 rounded px-1.5 py-0.5 bg-white">K</span>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-6">
                <div className="flex items-center gap-4">
                    <button className="text-gray-400 hover:text-primary transition-colors p-2 hover:bg-indigo-50 rounded-full">
                        <Monitor size={20} />
                    </button>
                    <button className="text-gray-400 hover:text-primary transition-colors relative p-2 hover:bg-indigo-50 rounded-full group">
                        <Bell size={20} className="group-hover:animate-swing" />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                    </button>
                </div>

                <div className="flex items-center gap-3 pl-6 border-l border-gray-100">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-100 to-indigo-50 flex items-center justify-center text-primary overflow-hidden shadow-sm border border-indigo-100">
                        <User size={20} />
                    </div>
                    <div className="hidden md:block">
                        <p className="text-sm font-bold text-gray-800">Estiaq Noor</p>
                        <p className="text-xs text-gray-500 text-right font-medium">Admin</p>
                    </div>
                </div>
            </div>
        </header>
    );
}
