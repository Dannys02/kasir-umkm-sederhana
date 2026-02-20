import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, ShoppingBag, History, Tags, Menu, X, LogOut, User } from "lucide-react";
import axios from "axios";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    
    // Ambil nama dari localStorage (Cara mudah yang kita bahas tadi)
    const userName = localStorage.getItem("userName") || "KASIR";

    const handleLogout = async () => {
        const token = localStorage.getItem("token");
        try {
            // Memberitahu Laravel untuk hapus token di database
            await axios.post("http://127.0.0.1:8000/api/logout", {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
        } catch (error) {
            console.error("Logout API error, but cleaning local storage anyway.");
        } finally {
            // Bersihkan storage dan tendang ke halaman login
            localStorage.removeItem("token");
            localStorage.removeItem("userName");
            navigate("/"); 
        }
    };

    const menuItems = [
        { name: "Dashboard", to: "/dashboard", icon: <LayoutDashboard size={18} /> },
        { name: "Daftar Produk", to: "/daftar-produk", icon: <ShoppingBag size={18} /> },
        { name: "Daftar Kategori", to: "/daftar-kategori", icon: <Tags size={18} /> },
        { name: "Riwayat Transaksi", to: "/riwayat-transaksi", icon: <History size={18} /> }
    ];

    return (
        <nav className="bg-white border-b border-gray-100 sticky top-0 z-[50] shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Logo Section */}
                    <div className="flex items-center">
                        <div className="flex-shrink-0 flex items-center gap-2">
                            <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center shadow-lg">
                                <ShoppingBag className="text-white" size={20} />
                            </div>
                            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-orange-800">
                                Ayam Geprek
                            </span>
                        </div>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-2">
                        {menuItems.map(item => (
                            <Link
                                key={item.name}
                                to={item.to}
                                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-300
                                ${location.pathname === item.to 
                                    ? "text-orange-600 bg-orange-50 shadow-sm" 
                                    : "text-gray-600 hover:bg-gray-50 hover:text-orange-600"}`}
                            >
                                {item.icon}
                                {item.name}
                            </Link>
                        ))}

                        {/* User Info & Logout Button */}
                        <div className="ml-4 pl-4 border-l border-gray-200 flex items-center gap-4">
                            
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                title="Keluar Aplikasi"
                            >
                                <LogOut size={18} />
                                <span>Logout</span>
                            </button>
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
            <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out bg-white border-b border-gray-100 
                ${isOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"}`}>
                <div className="px-4 pt-2 pb-6 space-y-1">
                    {menuItems.map(item => (
                        <Link
                            onClick={() => setIsOpen(false)}
                            key={item.name}
                            to={item.to}
                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium text-gray-600 hover:text-orange-600 hover:bg-orange-50"
                        >
                            <span className="text-orange-500">{item.icon}</span>
                            {item.name}
                        </Link>
                    ))}
                    
                    {/* Logout Mobile */}
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium text-red-600 hover:bg-red-50 transition-all"
                    >
                        <LogOut size={20} />
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
}
