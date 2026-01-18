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
