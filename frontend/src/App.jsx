import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProductCard from "./components/ProductCard";

function App() {
    const [count, setCount] = useState(0);

    return (
        <div>
            <Navbar />
            <Routes>
                <Route path="/" element={<ProductCard />} />
                <Route path="/daftar-produk" element={<ProductCard />} />
                <Route path="/riwayat-transaksi" element={<ProductCard />} />
            </Routes>
        </div>
    );
}

export default App;
