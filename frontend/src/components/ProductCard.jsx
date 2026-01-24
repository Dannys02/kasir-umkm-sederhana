import React, { useState } from "react";
import { Check, ShoppingCart, X } from "lucide-react";

export default function ProductCard({
    products,
    setProducts,
    categories,
    transactions,
    setTransactions,
    cart,
    setCart,
    addToCart,
    removeFromCart,
    revenue,
    setRevenue
}) {
    const [showModal, setShowModal] = useState(false);
    const [succesModal, setSuccesModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const openModal = product => {
        setSelectedProduct(product);
        setShowModal(true);
    };

    const handleConfirm = () => {
        // 1. Tambah Revenue dari total keranjang
        setRevenue(prev => prev + totalHargaKeranjang);

        // 2. Buat transaksi untuk riwayat (looping isi cart)
        const newTransactions = cart.map(item => ({
            id: Date.now() + Math.random(),
            product: `${item.name} (x${item.qty})`,
            price: item.price * item.qty,
            time: new Date().toLocaleTimeString("id-ID")
        }));

        setTransactions(prev => [...newTransactions, ...prev]);

        // 3. Kurangi stok produk
        setProducts(prevProducts =>
            prevProducts.map(p => {
                const itemInCart = cart.find(c => c.id === p.id);
                return itemInCart
                    ? { ...p, stock: p.stock - itemInCart.qty }
                    : p;
            })
        );

        // 4. Reset Keranjang & Tutup Modal
        setCart([]);
        setShowModal(false);
        setSuccesModal(true);
        setTimeout(() => setSuccesModal(false), 2000);
    };

    // Hitung Total Harga Keranjang
    const totalHargaKeranjang = cart.reduce(
        (acc, item) => acc + item.price * item.qty,
        0
    );

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
                <div className="bg-orange-50 px-6 py-3 rounded-xl border border-indigo-100">
                    <p className="text-[10px] text-orange-400 uppercase tracking-[0.2em] font-bold">
                        Total Pemasukan
                    </p>
                    <p className="text-2xl font-black text-orange-600">
                        Rp {revenue.toLocaleString("id-ID")}
                    </p>
                </div>
            </div>

            {/* Iterasi per Kategori */}
            {categories.map(cat => {
                // Filter produk yang masuk ke kategori ini saja
                const filteredProducts = products.filter(
                    p => p.category === cat.name
                );

                // Kalau kategori ini gak ada produknya, gak usah ditampilin judulnya
                if (filteredProducts.length === 0) return null;

                return (
                    <div key={cat.id} className="max-w-7xl mx-auto mb-10">
                        {/* Judul Kategori */}
                        <div className="flex items-center gap-4 mb-6">
                            <h2 className="text-xl font-black text-gray-800 uppercase tracking-widest">
                                {cat.name}
                            </h2>
                            <div className="h-[2px] flex-1 bg-gradient-to-r from-orange-200 to-transparent"></div>
                        </div>

                        {/* Grid Produk dalam Kategori ini */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 py-[40px]">
                            {filteredProducts.map(item => {
                                const itemInCart = cart.find(
                                    c => c.id === item.id
                                );
                                const currentQtyInCart = itemInCart
                                    ? itemInCart.qty
                                    : 0;
                                const isOutOfStock =
                                    item.stock - currentQtyInCart <= 0;

                                return (
                                    <div
                                        key={item.id}
                                        className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-orange-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                                    >
                                        {/* ... ISI CARD PRODUK SAMA SEPERTI SEBELUMNYA ... */}
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

                                        <div className="p-4">
                                            <div className="flex justify-between items-start mb-2">
                                                <h2 className="text-sm font-semibold text-gray-700 truncate flex-1">
                                                    {item.name}
                                                </h2>
                                                <span
                                                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                                                        item.stock -
                                                            currentQtyInCart <
                                                        5
                                                            ? "bg-orange-50 text-orange-600"
                                                            : "bg-green-50 text-green-600"
                                                    }`}
                                                >
                                                    Sisa:{" "}
                                                    {item.stock -
                                                        currentQtyInCart}
                                                </span>
                                            </div>
                                            <p className="text-lg font-bold text-orange-600 mb-4">
                                                Rp{" "}
                                                {item.price.toLocaleString(
                                                    "id-ID"
                                                )}
                                            </p>

                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() =>
                                                        addToCart(item)
                                                    }
                                                    disabled={isOutOfStock}
                                                    className={`w-full py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                                                        !isOutOfStock
                                                            ? "bg-orange-600 text-white hover:bg-orange-700 shadow-lg shadow-orange-100"
                                                            : "bg-gray-100 text-gray-400 cursor-not-allowed"
                                                    }`}
                                                >
                                                    <ShoppingCart size={16} />
                                                    {isOutOfStock
                                                        ? "Habis"
                                                        : "Keranjang"}
                                                </button>

                                                {currentQtyInCart > 0 && (
                                                    <button
                                                        onClick={() =>
                                                            removeFromCart(item)
                                                        }
                                                        className="flex items-center justify-center w-10 h-10 bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 rounded-xl transition-all font-bold"
                                                    >
                                                        —
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            })}

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
                            onClick={() => setShowModal(true)} // Munculkan modal bayar untuk SEMUA isi keranjang
                            className="bg-white text-orange-600 px-6 py-2 rounded-xl font-bold text-sm hover:bg-orange-50"
                        >
                            Bayar Sekarang
                        </button>
                        <button
                            onClick={() => setCart([])}
                            className="bg-red-500/20 hover:bg-red-500 text-white p-2 rounded-xl transition-all border border-red-400/30"
                            title="Batalkan semua"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>
            )}

            {/* Modal Konfirmasi */}
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

                    {/* List Belanjaan */}
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

                    {/* Total yang harus dibayar */}
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
                            className="flex-1 py-3 text-sm font-bold text-gray-400 hover:bg-gray-50 rounded-2xl transition-all"
                        >
                            Batal
                        </button>
                        <button
                            onClick={handleConfirm}
                            className="flex-1 py-3 text-sm font-bold bg-orange-600 text-white rounded-2xl shadow-lg shadow-indigo-200 hover:bg-orange-700 transition-all"
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
