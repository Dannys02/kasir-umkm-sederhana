import React, { useState } from "react";
import { Check, ShoppingCart, X } from "lucide-react";
import axios from "axios";

export default function ProductCard({
    loading,
    products,
    categories,
    cart,
    setCart,
    addToCart,
    removeFromCart,
    revenue,
    fetchData
}) {
    const [showModal, setShowModal] = useState(false);
    const [succesModal, setSuccesModal] = useState(false);
    const STORAGE_URL = "http://127.0.0.1:8000/storage/";

    const totalHargaKeranjang = cart.reduce(
        (acc, item) => acc + item.price * item.qty,
        0
    );

    const handleConfirm = async () => {
        try {
            await axios.post("http://127.0.0.1:8000/api/transactions", {
                total_price: totalHargaKeranjang,
                cart: cart
            });
            setShowModal(false);
            setSuccesModal(true);
            setCart([]);
            await fetchData();
            setTimeout(() => setSuccesModal(false), 2000);
        } catch (error) {
            alert("Gagal proses transaksi!");
        }
    };

    return (
        <>
            <div className="max-w-7xl mx-auto mb-8 flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-indigo-50">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
                        Ayam Geprek
                    </h1>
                    <p className="text-sm text-gray-400">
                        Kelola penjualan dengan mudah
                    </p>
                </div>
                <div
                    className={`bg-orange-50 rounded-xl border border-indigo-100 ${
                        loading
                            ? "flex justify-center items-center px-14 py-8"
                            : "px-6 py-3"
                    }`}
                >
                    {loading ? (
                        <div className="custom-loader"></div>
                    ) : (
                        <>
                            <p className="text-[10px] text-orange-400 uppercase tracking-[0.2em] font-bold">
                                Total Pemasukan
                            </p>
                            <p className="text-2xl font-black text-orange-600">
                                Rp {revenue.toLocaleString("id-ID")}
                            </p>
                        </>
                    )}
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center min-h-[60vh]">
                    <div className="custom-loader mb-4"></div>
                    <p className="text-gray-400 animate-pulse">
                        Menghubungkan ke server...
                    </p>
                </div>
            ) : products.length === 0 ? (
                <div className="flex flex-col items-center justify-center min-h-[40vh] text-center">
                    <div className="bg-gray-50 p-6 rounded-full mb-4">
                        <ShoppingCart size={48} className="text-gray-300" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-700">
                        Data Produk Tidak Ada
                    </h3>
                    <p className="text-gray-400 text-sm">
                        Belum ada produk yang ditambahkan di sini.
                    </p>
                </div>
            ) : (
                categories.map(cat => {
                    const filteredProducts = products.filter(
                        p => p.category_id === cat.id
                    );
                    if (filteredProducts.length === 0) return null;
                    return (
                        <div key={cat.id} className="max-w-7xl mx-auto mb-10">
                            <div className="flex items-center gap-4 mb-6">
                                <h2 className="text-xl font-black text-gray-800 uppercase tracking-widest">
                                    {cat.name}
                                </h2>
                                <div className="h-[2px] flex-1 bg-gradient-to-r from-orange-200 to-transparent"></div>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-[40px]">
                                {filteredProducts.map(item => {
                                    return (
                                        <div
                                            key={item.id}
                                            className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-orange-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                                        >
                                            <div className="relative aspect-square overflow-hidden bg-gray-50">
                                                <img
                                                    src={
                                                        item.image
                                                            ? STORAGE_URL +
                                                              item.image
                                                            : "https://via.placeholder.com/300"
                                                    }
                                                    alt={item.name}
                                                    loading="lazy"
                                                    decoding="async"
                                                    className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110`}
                                                />
                                            </div>
                                            <div className="px-4 pt-2">
                                                <div className="flex justify-between items-start">
                                                    <h2 className="text-sm font-semibold text-gray-700  flex-1">
                                                        {item.name}
                                                    </h2>
                                                </div>
                                                <p className="text-lg font-bold text-orange-600 mb-4">
                                                    Rp{" "}
                                                    {item.price.toLocaleString(
                                                        "id-ID"
                                                    )}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2 pb-2 px-2">
                                                {cart.find(
                                                    c => c.id === item.id
                                                ) ? (
                                                    <div className="w-full flex items-center justify-between bg-orange-50 p-1 rounded-xl border border-orange-100">
                                                        <button
                                                            onClick={() =>
                                                                removeFromCart(
                                                                    item.id
                                                                )
                                                            }
                                                            className="w-10 h-10 flex items-center justify-center bg-white text-orange-600 rounded-lg shadow-sm hover:bg-red-100 hover:text-red-600 transition-all"
                                                        >
                                                            <X
                                                                size={16}
                                                                strokeWidth={3}
                                                            />
                                                        </button>

                                                        <span className="font-black text-orange-600">
                                                            {
                                                                cart.find(
                                                                    c =>
                                                                        c.id ===
                                                                        item.id
                                                                ).qty
                                                            }
                                                        </span>

                                                        <button
                                                            onClick={() =>
                                                                addToCart(item)
                                                            }
                                                            className="w-10 h-10 flex items-center justify-center bg-orange-600 text-white rounded-lg shadow-md hover:bg-orange-700 transition-all"
                                                        >
                                                            <span className="text-lg">
                                                                +
                                                            </span>
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() =>
                                                            addToCart(item)
                                                        }
                                                        className="w-full flex items-center justify-center gap-2 text-white bg-orange-600 py-3 rounded-xl text-sm font-bold hover:bg-orange-700 transition-all shadow-md active:scale-95"
                                                    >
                                                        <ShoppingCart
                                                            size={16}
                                                        />
                                                        <span>Tambah</span>
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })
            )}

            {cart.length > 0 && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md bg-orange-600 text-white p-4 rounded-2xl shadow-2xl flex justify-between items-center z-[70] animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <div>
                        <p className="text-xs opacity-80">
                            {cart.reduce((a, b) => a + b.qty, 0)} Produk dipilih
                        </p>
                        <p className="font-bold text-lg">
                            Total: Rp{" "}
                            {totalHargaKeranjang.toLocaleString("id-ID")}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setShowModal(true)}
                            className="bg-white text-orange-600 px-6 py-2 rounded-xl font-bold text-sm hover:bg-orange-50"
                        >
                            Bayar Sekarang
                        </button>
                        <button
                            onClick={() => setCart([])}
                            className="bg-red-500/20 hover:bg-red-500 text-white p-2 rounded-xl transition-all border border-red-400/30"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>
            )}

            <div
                className={`fixed ${
                    showModal
                        ? "opacity-100 visible"
                        : "opacity-0 invisible pointer-events-none"
                } inset-0 z-[80] flex items-center justify-center p-4 backdrop-blur-md bg-orange-900/20 animate-in fade-in duration-300`}
            >
                <div
                    className={`bg-white ${
                        showModal
                            ? "scale-100 opacity-100"
                            : "scale-75 opacity-0"
                    } rounded-3xl shadow-2xl max-w-sm w-full p-8 transition-all duration-300`}
                >
                    <div className="w-16 h-16 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <ShoppingCart size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 text-center">
                        Detail Pesanan
                    </h3>
                    <div className="mt-4 max-h-40 overflow-y-auto space-y-2 py-2">
                        {cart.map(item => (
                            <div
                                key={item.id}
                                className="flex justify-between text-sm text-gray-600 border-b border-gray-50 pb-2"
                            >
                                <span>
                                    {item.name}{" "}
                                    <span className="text-orange-600 font-bold">
                                        x{item.qty}
                                    </span>
                                </span>
                                <span className="font-semibold text-gray-800">
                                    Rp{" "}
                                    {(item.price * item.qty).toLocaleString(
                                        "id-ID"
                                    )}
                                </span>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 p-4 bg-orange-50 rounded-2xl flex justify-between items-center">
                        <span className="text-xs text-orange-400 font-bold uppercase tracking-wider">
                            Total Bayar
                        </span>
                        <span className="text-lg font-black text-orange-600">
                            Rp {totalHargaKeranjang.toLocaleString("id-ID")}
                        </span>
                    </div>
                    <div className="mt-8 flex gap-3">
                        <button
                            onClick={() => setShowModal(false)}
                            className="flex-1 py-3 text-sm font-bold text-gray-400 hover:bg-gray-50 rounded-2xl"
                        >
                            Batal
                        </button>
                        <button
                            onClick={handleConfirm}
                            className="flex-1 py-3 text-sm font-bold bg-orange-600 text-white rounded-2xl shadow-lg hover:bg-orange-700"
                        >
                            Ya, Proses
                        </button>
                    </div>
                </div>
            </div>

            <div
                className={`fixed left-1/2 -translate-x-1/2 z-[100] transition-all duration-500 ${
                    succesModal
                        ? "top-10 opacity-100 scale-100"
                        : "-top-20 opacity-0 scale-95 pointer-events-none"
                }`}
            >
                <div className="bg-emerald-500 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-emerald-400">
                    <div className="bg-white/20 p-1 rounded-full animate-bounce">
                        <Check size={20} strokeWidth={3} />
                    </div>
                    <span className="font-bold tracking-wide">
                        Pemasukan Berhasil Dicatat!
                    </span>
                </div>
            </div>
        </>
    );
}
