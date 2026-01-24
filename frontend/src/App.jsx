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
    const [count, setCount] = useState(0);

    return (
        <div>
            <Navbar />
            <Routes>
                <Route path="/" element={<ProductCard />} />
                <Route path="/daftar-produk" element={<ProductList />} />
                <Route path="/riwayat-transaksi" element={<Transaction />} />
            </Routes>
        </div>
    );
}

export default App;
