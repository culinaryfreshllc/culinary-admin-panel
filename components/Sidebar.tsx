"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, ShoppingBag, MessageSquare,
  Shield,
  ChevronLeft, ChevronRight, Hexagon, Grid3x3, FileText, Mail
} from "lucide-react";

interface SidebarProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
}

export default function Sidebar({ isCollapsed, toggleSidebar }: SidebarProps) {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-white border-r border-gray-100 flex flex-col justify-between py-6 transition-all duration-300 z-20 shadow-sm ${isCollapsed ? "w-20 px-2" : "w-64 px-4"
        }`}
    >
      <div>
        {/* Logo Section */}
        <div className={`flex items-center gap-3 mb-10 h-10 ${isCollapsed ? "justify-center" : "px-2"}`}>
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 shrink-0">
            <Hexagon className="text-white fill-white" size={20} />
          </div>
          <span
            className={`text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 transition-opacity duration-200 whitespace-nowrap ${isCollapsed ? "opacity-0 w-0 hidden" : "opacity-100"
              }`}
          >
            Culinary Fresh
          </span>
        </div>

        {/* Main Nav */}
        <nav className="flex flex-col gap-2">
          <NavItem href="/" icon={<LayoutDashboard size={20} />} label="Dashboard" active={isActive("/")} collapsed={isCollapsed} />
        </nav>

        {/* Tools Section */}
        <div className="mt-8">
          {!isCollapsed && (
            <h3 className="px-4 text-[10px] font-bold text-gray-400 mb-4 uppercase tracking-wider animate-in fade-in duration-300">
              Tools
            </h3>
          )}
          <div className="h-px bg-gray-100 mb-4 mx-2" hidden={!isCollapsed} />

          <nav className="flex flex-col gap-2">
            <NavItem href="/products" icon={<ShoppingBag size={20} />} label="Products" active={isActive("/products")} collapsed={isCollapsed} />
            <NavItem href="/categories" icon={<Grid3x3 size={20} />} label="Categories" active={isActive("/categories")} collapsed={isCollapsed} />

            <NavItem href="/about-us" icon={<FileText size={20} />} label="About Us" active={isActive("/about-us")} collapsed={isCollapsed} />
            <NavItem href="/contact-us" icon={<Mail size={20} />} label="Contact Us" active={isActive("/contact-us")} collapsed={isCollapsed} />
          </nav>
        </div>
      </div>

      {/* User Profile Section */}
      <div className="mt-auto">
        <div className={`border-t border-gray-100 pt-4 ${isCollapsed ? "px-0" : "px-2"}`}>
          <div className={`flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-all duration-200 group ${isCollapsed ? "justify-center" : ""}`}>
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg">
                <span className="text-sm">A</span>
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
            </div>

            {/* User Info & Logout */}
            {!isCollapsed && (
              <div className="flex-1 min-w-0 animate-in fade-in slide-in-from-left-2 duration-200">
                <p className="text-sm font-semibold text-gray-900 truncate">Admin</p>
                <p className="text-xs text-gray-500 truncate">admin@culinary.com</p>
              </div>
            )}

            {/* Logout Button */}
            <button
              onClick={() => {
                localStorage.removeItem('token');
                window.location.href = '/login';
              }}
              className={`shrink-0 p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all duration-200 ${isCollapsed ? "hidden group-hover:block" : ""}`}
              title="Logout"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-10 w-6 h-6 bg-white border border-gray-100 rounded-full flex items-center justify-center text-gray-400 hover:text-primary shadow-sm hover:shadow-md transition-all z-50"
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>
    </aside>
  );
}

function NavItem({ href, icon, label, active, collapsed }: { href: string; icon: React.ReactNode; label: string; active: boolean; collapsed: boolean }) {
  return (
    <Link
      href={href}
      className={`group flex items-center gap-3 py-3 rounded-xl transition-all duration-200 relative overflow-hidden ${collapsed ? "justify-center px-0 w-10 mx-auto" : "px-4"
        } ${active
          ? "bg-primary text-white shadow-lg shadow-indigo-500/30"
          : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
        }`}
      title={collapsed ? label : undefined}
    >
      <div className={`relative z-10 transition-transform duration-200 ${!active && "group-hover:scale-110"}`}>
        {icon}
      </div>

      {!collapsed && (
        <span className="font-medium text-sm whitespace-nowrap animate-in fade-in slide-in-from-left-2 duration-200">
          {label}
        </span>
      )}

      {/* Active Indicator Strip */}
      {active && !collapsed && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white/20 rounded-r-full" />
      )}
    </Link>
  );
}
