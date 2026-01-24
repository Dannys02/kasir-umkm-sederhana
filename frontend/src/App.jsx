import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProductCard from "./components/ProductCard";
import ProductList from "./components/ProductList";
import Transaction from "./components/Transaction";

function App() {
    const [transactions, setTransactions] = useState([]);
    const [cart, setCart] = useState([]);

    const addToCart = product => {
        setCart(prev => {
            const isExist = prev.find(item => item.id === product.id);

            if (isExist) {
                // CEK: Apakah jumlah di keranjang sudah mentok sama stok?
                if (isExist.qty >= product.stock) {
                    alert("Stok tidak mencukupi!"); // Kasih peringatan
                    return prev; // Jangan tambah apa-apa, balikin data lama
                }

                return prev.map(item =>
                    item.id === product.id
                        ? { ...item, qty: item.qty + 1 }
                        : item
                );
            }

            // Kalau barang baru masuk keranjang, pastikan stoknya minimal ada 1
            if (product.stock <= 0) return prev;

            return [...prev, { ...product, qty: 1 }];
        });
    };

    return (
        <>
            <Navbar />

            <div className="min-h-screen bg-gray-50 p-6 font-sans">
                <Routes>
                    <Route
                        path="/"
                        element={
                            <ProductCard
                                transactions={transactions}
                                setTransactions={setTransactions}
                                cart={cart}
                                setCart={setCart}
                                addToCart={addToCart}
                            />
                        }
                    />
                    <Route path="/daftar-produk" element={<ProductList />} />
                    <Route
                        path="/riwayat-transaksi"
                        element={
                            <Transaction
                                transactions={transactions}
                                setTransactions={setTransactions}
                            />
                        }
                    />
                </Routes>
            </div>
        </>
    );
}

export default App;
