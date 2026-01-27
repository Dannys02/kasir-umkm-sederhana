import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProductCard from "./components/ProductCard";
import ProductList from "./components/ProductList";
import CategoryList from "./components/CategoryList";
import Transaction from "./components/Transaction";

const API_URL = "http://127.0.0.1:8000/api";

function App() {
    const [transactions, setTransactions] = useState([]);
    const [cart, setCart] = useState([]);
    const [revenue, setRevenue] = useState(0);
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fungsi Ambil Data dari Laravel
    const fetchData = async () => {
        setLoading(true);
        try {
            const resProd = await axios.get(`${API_URL}/products`);
            setProducts(resProd.data.data || []);

            const resCat = await axios.get(`${API_URL}/categories`);
            setCategories(resCat.data.data || []);

            const resTrx = await axios.get(`${API_URL}/transactions`);
            setTransactions(resTrx.data.data || []);
            setRevenue(resTrx.data.total_revenue || 0);
        } catch (error) {
            console.error("Gagal ambil data!", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const addToCart = product => {
        setCart(prev => {
            const currentProduct = products.find(p => p.id === product.id);
            const isExist = prev.find(item => item.id === product.id);

            if (isExist) {
                if (isExist.qty >= currentProduct.stock) {
                    alert("Stok tidak mencukupi!");
                    return prev;
                }
                return prev.map(item =>
                    item.id === product.id
                        ? { ...item, qty: item.qty + 1 }
                        : item
                );
            }
            if (currentProduct.stock <= 0) return prev;
            return [...prev, { ...product, qty: 1 }];
        });
    };

    const removeFromCart = product => {
        setCart(prev => {
            const isExist = prev.find(item => item.id === product.id);
            if (!isExist) return prev;
            if (isExist.qty === 1)
                return prev.filter(item => item.id !== product.id);
            return prev.map(item =>
                item.id === product.id ? { ...item, qty: item.qty - 1 } : item
            );
        });
    };

    return (
        <>
            <Navbar />
            <div className="bg-gray-50 p-6 font-sans">
                <Routes>
                    <Route
                        path="/"
                        element={
                            <ProductCard
                                loading={loading}
                                setLoading={setLoading}
                                products={products}
                                categories={categories}
                                transactions={transactions}
                                setTransactions={setTransactions}
                                cart={cart}
                                setCart={setCart}
                                addToCart={addToCart}
                                removeFromCart={removeFromCart}
                                revenue={revenue}
                                setRevenue={setRevenue}
                                fetchData={fetchData} // <--- Kirim ini buat refresh data
                            />
                        }
                    />
                    <Route
                        path="/daftar-produk"
                        element={
                            <ProductList
                                loading={loading}
                                setLoading={setLoading}
                                products={products}
                                setProducts={setProducts}
                                categories={categories}
                                fetchData={fetchData}
                            />
                        }
                    />
                    <Route
                        path="/daftar-kategori"
                        element={
                            <CategoryList
                                loading={loading}
                                setLoading={setLoading}
                                categories={categories}
                                products={products}
                                fetchData={fetchData}
                            />
                        }
                    />
                    <Route
                        path="/riwayat-transaksi"
                        element={
                            <Transaction
                                loading={loading}
                                setLoading={setLoading}
                                transactions={transactions}
                            />
                        }
                    />
                </Routes>
            </div>
        </>
    );
}

export default App;
