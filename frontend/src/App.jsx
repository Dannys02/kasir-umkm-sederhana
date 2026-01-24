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
    const [revenue, setRevenue] = useState(0);
    const [products, setProducts] = useState([
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
            price: 8000,
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
            price: 2000,
            stock: 5
        }
    ]);

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

            // Kalau barangnya cuma ada 1 di keranjang, hapus total dari array
            if (isExist.qty === 1) {
                return prev.filter(item => item.id !== product.id);
            }

            // Kalau lebih dari 1, kurangi qty-nya saja
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
                                products={products}
                                setProducts={setProducts}
                                transactions={transactions}
                                setTransactions={setTransactions}
                                cart={cart}
                                setCart={setCart}
                                addToCart={addToCart}
                                removeFromCart={removeFromCart}
                                revenue={revenue}
                                setRevenue={setRevenue}
                            />
                        }
                    />
                    <Route
                        path="/daftar-produk"
                        element={
                            <ProductList
                                products={products}
                                setProducts={setProducts}
                            />
                        }
                    />
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
