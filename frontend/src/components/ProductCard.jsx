import React, { useState } from "react";
import { Check, ShoppingCart, X } from "lucide-react";

export default function ProductCard({ transactions, setTransactions }) {
    const [showModal, setShowModal] = useState(false);
    const [succesModal, setSuccesModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [revenue, setRevenue] = useState(0);

    const [dummyProducts, setDummyProducts] = useState([
        {
            id: 1,
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRWnD5zRlT-ofpy1KNUFNLrcHA7_ZnGU7zRqYbMFusCi2st6yEmz--OR-5g&s=10",
            name: "Ayam Dada",
            price: 8000,
            stock: 5
        },
        {
            id: 2,
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0ABnY1vV4nPAdvmnYJjjkjMGmbk5v3WrjZcWLIH0TokL1w4q2q6VDoQiM&s=10",
            name: "Ayam Paha",
            price: 7000,
            stock: 5
        },
        {
            id: 3,
            image: "https://d1vbn70lmn1nqe.cloudfront.net/prod/wp-content/uploads/2021/06/15093247/Ketahui-Fakta-Es-Teh-Manis.jpg",
            name: "Es Teh Manis",
            price: 3000,
            stock: 5
        },
        {
            id: 4,
            image: "https://nilaigizi.com/assets/images/produk/produk_1535761724.png",
            name: "Nasi Putih",
            price: 4000,
            stock: 3
        }
    ]);

    const openModal = product => {
        setSelectedProduct(product);
        setShowModal(true);
    };

    const handleConfirm = () => {
        setRevenue(prev => prev + selectedProduct.price);

        setDummyProducts(prevProducts =>
            prevProducts.map(p =>
                p.id === selectedProduct.id ? { ...p, stock: p.stock - 1 } : p
            )
        );

        setShowModal(false);
        setSuccesModal(true);

        setTimeout(() => setSuccesModal(false), 2000);
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
                <div className="bg-indigo-50 px-6 py-3 rounded-xl border border-indigo-100">
                    <p className="text-[10px] text-indigo-400 uppercase tracking-[0.2em] font-bold">
                        Total Pemasukan
                    </p>
                    <p className="text-2xl font-black text-indigo-600">
                        Rp {revenue.toLocaleString("id-ID")}
                    </p>
                </div>
            </div>

            {/* Grid Produk */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                {dummyProducts.map(item => (
                    <div
                        key={item.id}
                        className="group bg-white rounded-2xl overflow-hidden
                        shadow-sm border border-indigo-500 hover:shadow-xl
                        hover:-translate-y-1 transition-all duration-300"
                    >
                        <div className="relative aspect-square overflow-hidden bg-gray-50">
                            <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            {item.stock <= 0 && (
                                <div className="absolute inset-0 bg-white/80 backdrop-blur-[2px] flex items-center justify-center">
                                    <span className="bg-red-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase">
                                        Habis
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="p-5">
                            <div className="flex justify-between items-start mb-2">
                                <h2 className="text-sm font-semibold text-gray-700 truncate flex-1">
                                    {item.name}
                                </h2>
                                <span
                                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                                        item.stock < 5
                                            ? "bg-orange-50 text-orange-600"
                                            : "bg-green-50 text-green-600"
                                    } ${
                                        item.stock === 0
                                            ? "bg-red-50 text-red-600"
                                            : ""
                                    }`}
                                >
                                    Sisa: {item.stock}
                                </span>
                            </div>
                            <p className="text-lg font-bold text-indigo-600 mb-4">
                                Rp {item.price.toLocaleString("id-ID")}
                            </p>

                            <button
                                onClick={() => openModal(item)}
                                disabled={item.stock <= 0}
                                className={`w-full py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                                    item.stock > 0
                                        ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100 shadow-lg"
                                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                                }`}
                            >
                                <ShoppingCart size={16} />
                                Beli
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal Konfirmasi */}
            <div
                className={`fixed ${
                    showModal
                        ? "opacity-100 visible"
                        : "opacity-0 invisible pointer-events-none"
                } inset-0 z-50
                    flex items-center
                justify-center p-4 backdrop-blur-md bg-indigo-900/20 animate-in
                fade-in duration-300`}
            >
                <div
                    className={`bg-white ${
                        showModal
                            ? "scale-100 opacity-100"
                            : "scale-75 opacity-0"
                    } rounded-3xl
                        shadow-2xl max-w-sm
                    w-full p-8 text-center transition-all duration-300 ease-[box-bezier(0.23,1,0.32,1)`}
                >
                    <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <ShoppingCart size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">
                        Konfirmasi
                    </h3>
                    <p className="text-gray-500 text-sm mt-2 leading-relaxed">
                        Beli{" "}
                        <span className="text-gray-800 font-semibold">
                            {selectedProduct?.name}
                        </span>
                        ?<br />
                        Uang{" "}
                        <span className="text-indigo-600 font-bold">
                            Rp {selectedProduct?.price.toLocaleString("id-ID")}
                        </span>{" "}
                        akan masuk ke laci.
                    </p>
                    <div className="mt-8 flex gap-3">
                        <button
                            onClick={() => setShowModal(false)}
                            className="flex-1 py-3 text-sm font-bold text-gray-500 hover:bg-gray-50 rounded-2xl transition-all"
                        >
                            Batal
                        </button>
                        <button
                            onClick={handleConfirm}
                            className="flex-1 py-3 text-sm font-bold bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all"
                        >
                            Ya, Proses
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal Success */}
            <div
                className={`fixed left-1/2 -translate-x-1/2 z-[100] transition-all duration-500 ease-[box-bezier(0.23,1,0.32,1)]
    ${
        succesModal
            ? "top-10 opacity-100 scale-100"
            : "-top-20 opacity-0 scale-95 pointer-events-none"
    }`}
            >
                <div className="bg-emerald-500 text-white px-8 py-4 rounded-2xl shadow-[0_20px_50px_rgba(16,185,129,0.3)] flex items-center gap-3 border border-emerald-400">
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
