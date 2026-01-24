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

    const [count, setCount] = useState(0);

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
