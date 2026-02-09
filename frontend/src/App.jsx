import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import { Navigate, useLocation, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
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
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const location = useLocation();

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

    const removeFromCart = productId => {
        setCart(prevCart => {
            // Cari barangnya
            const existingItem = prevCart.find(item => item.id === productId);

            if (existingItem.qty > 1) {
                // Kalau qty lebih dari 1, kurangi 1
                return prevCart.map(item =>
                    item.id === productId
                        ? { ...item, qty: item.qty - 1 }
                        : item
                );
            } else {
                // Kalau qty tinggal 1, tendang dari keranjang
                return prevCart.filter(item => item.id !== productId);
            }
        });
    };

    const ProtectedRoute = ({ children }) => {
        const token = localStorage.getItem("token");
        if (!token) return <Navigate to="/" replace />;
        return children;
    };

    const PublicRoute = ({ children }) => {
        const token = localStorage.getItem("token");
        if (token) return <Navigate to="/dashboard" replace />;
        return children;
    };

    return (
        <>
            {location.pathname != "/" && <Navbar />}
            <div className="bg-gray-50 p-6 font-sans">
                <Routes>
                    <Route
                        path="/"
                        element={
                            <PublicRoute>
                                <Login />
                            </PublicRoute>
                        }
                    />
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
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
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/daftar-produk"
                        element={
                            <ProtectedRoute>
                                <ProductList
                                    loading={loading}
                                    setLoading={setLoading}
                                    products={products}
                                    setProducts={setProducts}
                                    categories={categories}
                                    fetchData={fetchData}
                                    currentPage={currentPage}
                                    setCurrentPage={setCurrentPage}
                                    itemsPerPage={itemsPerPage}
                                />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/daftar-kategori"
                        element={
                            <ProtectedRoute>
                                <CategoryList
                                    loading={loading}
                                    setLoading={setLoading}
                                    categories={categories}
                                    products={products}
                                    fetchData={fetchData}
                                    currentPage={currentPage}
                                    setCurrentPage={setCurrentPage}
                                    itemsPerPage={itemsPerPage}
                                />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/riwayat-transaksi"
                        element={
                            <ProtectedRoute>
                                <Transaction
                                    loading={loading}
                                    setLoading={setLoading}
                                    transactions={transactions}
                                    currentPage={currentPage}
                                    setCurrentPage={setCurrentPage}
                                    itemsPerPage={itemsPerPage}
                                />
                            </ProtectedRoute>
                        }
                    />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </div>
        </>
    );
}

export default App;
