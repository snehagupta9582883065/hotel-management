"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    LayoutDashboard,
    Hotel,
    ChevronDown,
    CalendarDays,
    Users,
    CreditCard,
    Utensils,
    UserCog,
    BarChart3,
    Shield,
    X
} from "lucide-react";

const MENU_ITEMS = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/" },

    {
        name: "Hotel Management",
        icon: Hotel,
        submenu: [
            { name: "Hotel Profile", path: "/hotel-profile" },
            { name: "Floor Management", path: "/floor-management" },
            { name: "Room Management", path: "/room-management" },
            { name: "Seasonal Pricing", path: "/seasonal-pricing" },
            { name: "Add-On Services", path: "/add-on-services" },
            { name: "Housekeeping", path: "/housekeeping" },
        ],
    },
    {
        name: "Booking",
        icon: CalendarDays,
        submenu: [
            { name: "Booking Calendar", path: "/booking-calendar" },
            { name: "Booking List", path: "/booking-list" },
            { name: "Group Booking", path: "/group-booking" },
        ],
    },
    {
        name: "Guest Management",
        icon: Users,
        submenu: [
            { name: "Guest List", path: "/guest-list" },
            { name: "Foreign Guest", path: "/foreign-guest" },
            { name: "VIP Guest", path: "/vip-guest" },
            { name: "Corporate Guest", path: "/corporate-guest" },
            { name: "Blacklisted Guest", path: "/blacklisted-guest" },
        ],
    },
    {
        name: "Front Office & Billing",
        icon: CreditCard,
        submenu: [
            { name: "Folio Management", path: "/folio-management" },
            { name: "Payment Processing", path: "/payment-processing" },
            { name: "Invoices & Receipts", path: "/invoices-receipts" },
        ],
    },
    {
        name: "Restaurant",
        icon: Utensils,
        submenu: [
            { name: "Dashboard", path: "/restaurant-dashboard" },
            { name: "Table Management", path: "/table-management" },
            { name: "Menu Management", path: "/menu-management" },
            { name: "Order Management", path: "/orders-management" },
            { name: "KOT Management", path: "/kot-management" },
        ],
    },
    {
        name: "Staff & Roles",
        icon: UserCog,
        submenu: [
            { name: "Staff List", path: "/staff-list" },
            { name: "Roles & Permissions", path: "/roles-permissions" },
        ],
    },
    {
        name: "Reports & Analytics",
        icon: BarChart3,
        path: "/reports",
    },
    {
        name: "Admin & Settings",
        icon: Shield,
        path: "/settings",
    },
];

export default function Sidebar({ isOpen, onClose }) {
    const pathname = usePathname();
    const [openMenu, setOpenMenu] = useState("Hotel Management");

    // Close sidebar on mobile when navigating
    useEffect(() => {
        if (isOpen && onClose) {
            onClose();
        }
    }, [pathname]);

    return (
        <>
            {/* Backdrop for mobile */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
                    />
                )}
            </AnimatePresence>

            <aside
                className={`sidebar glass flex flex-col h-screen w-[300px] shrink-0 fixed lg:sticky top-0 left-0 z-50 transition-transform duration-300 lg:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                {/* Logo & Close Button (Mobile) */}
                <div className="logo-container px-4 gap-3 !mb-4 flex justify-between items-center transition-all duration-300">
                    <div className="flex items-center gap-3">
                        <Hotel className="logo-icon text-accent-primary shrink-0" size={32} />
                        <h1 className="logo-text title-gradient whitespace-nowrap overflow-hidden">
                            NeuralStay
                        </h1>
                    </div>
                    {onClose && (
                        <button
                            onClick={onClose}
                            className="lg:hidden p-2 text-text-secondary hover:text-purple-600 transition-colors"
                        >
                            <X size={20} />
                        </button>
                    )}
                </div>

                {/* Navigation */}
                <nav className="nav-menu flex flex-col flex-1 overflow-y-auto overflow-x-hidden pb-2 custom-scrollbar">
                    {MENU_ITEMS.map((item) => {
                        const isSubmenu = !!item.submenu;
                        const isMenuOpen = openMenu === item.name;
                        const isParentActive = isSubmenu && item.submenu.some(sub => sub.path === pathname);
                        const isActive = pathname === item.path;

                        if (isSubmenu) {
                            return (
                                <div key={item.name} className="nav-group mb-1">
                                    <button
                                        onClick={() => setOpenMenu(isMenuOpen ? null : item.name)}
                                        className={`nav-item ${isParentActive ? "active" : ""}`}
                                    >
                                        <item.icon size={22} className="shrink-0" />
                                        <span className="flex-1 text-left whitespace-nowrap overflow-hidden">{item.name}</span>
                                        <ChevronDown
                                            size={16}
                                            className={`chevron shrink-0 ${isMenuOpen ? "rotate" : ""}`}
                                        />
                                    </button>

                                    <AnimatePresence>
                                        {isMenuOpen && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                                className="overflow-hidden"
                                            >
                                                <div className="submenu">
                                                    {item.submenu.map((sub) => {
                                                        const isSubActive = pathname === sub.path;
                                                        return (
                                                            <Link
                                                                key={sub.path}
                                                                href={sub.path}
                                                                className={`submenu-item ${isSubActive ? "active" : ""}`}
                                                            >
                                                                <span className="truncate">{sub.name}</span>
                                                            </Link>
                                                        );
                                                    })}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            );
                        }

                        return (
                            <Link
                                key={item.path}
                                href={item.path}
                                className={`nav-item mb-1 ${isActive ? "active" : ""}`}
                            >
                                <item.icon size={22} className="shrink-0" />
                                <span className="whitespace-nowrap overflow-hidden">{item.name}</span>
                                {isActive && <div className="active-indicator" />}
                            </Link>
                        );
                    })}
                </nav>

                {/* User Profile */}
                <div className="user-profile mt-auto py-3 border-t border-slate-200 dark:border-slate-800 flex gap-3 items-center transition-all">
                    <div className="avatar shrink-0 w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-sm font-bold">A</div>
                    <div className="user-info overflow-hidden">
                        <p className="user-name text-sm font-bold truncate">Admin User</p>
                        <p className="user-role text-xs text-slate-500 truncate">Manager</p>
                    </div>
                </div>
            </aside>
        </>
    );
}
