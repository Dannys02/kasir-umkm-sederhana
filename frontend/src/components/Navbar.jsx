import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, ShoppingBag, History, Tags, Menu, X } from "lucide-react";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    const menuItems = [
        { name: "Dashboard", to: "/", icon: <LayoutDashboard size={18} /> },
        {
            name: "Daftar Produk",
            to: "/daftar-produk",
            icon: <ShoppingBag size={18} />
        },
        {
            name: "Daftar Kategori",
            to: "/daftar-kategori",
            icon: <Tags size={18} />
        },
        {
            name: "Riwayat Transaksi",
            to: "/riwayat-transaksi",
            icon: <History size={18} />
        }
    ];

    return (
        <nav className="bg-white border-b border-gray-100 sticky top-0 z-[50] shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Logo Section */}
                    <div className="flex items-center">
                        <div className="flex-shrink-0 flex items-center gap-2">
                            <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center shadow-indigo-200 shadow-lg">
                                <ShoppingBag className="text-white" size={20} />
                            </div>
                            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-orange-800">
                                Ayam Geprek
                            </span>
                        </div>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-4">
                        {menuItems.map(item => (
                            <Link
                                key={item.name}
                                to={item.to}
                                className={`flex items-center gap-2 px-4 py-2
                                rounded-xl text-sm font-medium text-gray-500
                                hover:text-orange-600 hover:bg-orange-50
                                ${
                                    location.pathname === item.to
                                        ? "text-orange-600 bg-orange-50"
                                        : "text-black bg-transparent"
                                }
                                transition-all duration-500 ease-in-out`}
                            >
                                {item.icon}
                                {item.name}
                            </Link>
                        ))}
                        <div className="ml-4 pl-4 border-l border-gray-100">
                            <div className="w-8 h-8 rounded-full bg-orange-100 border border-indigo-200 flex items-center justify-center text-orange-600 text-xs font-bold">
                                AD
                            </div>
                        </div>
                    </div>

                    {/* Mobile Button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-2 rounded-lg text-gray-400 hover:text-orange-600 hover:bg-orange-50 transition-all"
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu - Dropdown */}
            <div
                className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out bg-white border-b border-gray-100 
        ${isOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"}`}
            >
                <div className="px-4 pt-2 pb-6 space-y-1">
                    {menuItems.map(item => (
                        <Link
                            onClick={() => setIsOpen(false)}
                            key={item.name}
                            to={item.to}
                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium text-gray-600 hover:text-orange-600 hover:bg-orange-50 transition-all"
                        >
                            <span className="text-orange-500">{item.icon}</span>
                            {item.name}
                        </Link>
                    ))}
                </div>
            </div>
        </nav>
    );
}
