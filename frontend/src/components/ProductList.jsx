import React, { useState } from "react";
import { Plus, Edit2, Trash2, Image as ImageIcon } from "lucide-react";

export default function ProductList({
    products,
    setProducts,
    categories,
    setCategories
}) {
    const [form, setForm] = useState({
        id: null,
        name: "",
        category: "",
        price: "",
        stock: "",
        image: ""
    });
    const [isEdit, setIsEdit] = useState(false);

    // Handle Input
    const handleChange = e => {
        const { name, value } = e.target;

        if (name === "price" || name === "stock") {
            // Hapus semua karakter yang BUKAN angka (titik, koma, huruf, dll)
            const cleanValue = value.replace(/\D/g, "");
            setForm({ ...form, [name]: cleanValue });
        } else {
            setForm({ ...form, [name]: value });
        }
    };

    // Simpan atau Update
    const handleSubmit = e => {
        e.preventDefault();

        // Paksa harga dan stok jadi angka murni sebelum disimpan
        const formattedForm = {
            ...form,
            price: Number(form.price), // <--- INI KUNCINYA
            stock: Number(form.stock) // <--- INI JUGA
        };

        if (isEdit) {
            setProducts(
                products.map(p => (p.id === form.id ? formattedForm : p))
            );
            setIsEdit(false);
        } else {
            const newProduct = { ...formattedForm, id: Date.now() };
            setProducts([...products, newProduct]);
        }
        setForm({ id: null, name: "", price: "", stock: "", image: "" });
    };

    // Hapus
    const deleteProduct = id => {
        if (window.confirm("Yakin mau hapus produk ini?")) {
            setProducts(products.filter(p => p.id !== id));
        }
    };

    // Set ke Mode Edit
    const editProduct = p => {
        setForm(p);
        setIsEdit(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-20">
            {/* Form Card */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-orange-50">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    {isEdit ? <Edit2 size={20} /> : <Plus size={20} />}
                    {isEdit ? "Edit Produk" : "Tambah Produk Baru"}
                </h2>
                <form
                    onSubmit={handleSubmit}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                    <input
                        type="text"
                        name="name"
                        placeholder="Nama Produk..."
                        value={form.name}
                        onChange={handleChange}
                        className="p-3 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                        required
                    />
                    <select
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                        className="p-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                        required
                    >
                        <option value="">-- Pilih Kategori --</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.name}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                    <input
                        type="number"
                        name="price"
                        placeholder="Harga (Rp)"
                        value={
                            form.price
                                ? Number(form.price).toLocaleString("id-ID")
                                : ""
                        }
                        onChange={handleChange}
                        className="p-3 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                        required
                    />

                    <input
                        type="number"
                        name="stock"
                        placeholder="Stok Awal..."
                        value={form.stock}
                        onChange={handleChange}
                        className="p-3 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                        required
                    />
                    <input
                        type="text"
                        name="image"
                        placeholder="Link URL Gambar..."
                        value={form.image}
                        onChange={handleChange}
                        className="p-3 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                        required
                    />
                    <button
                        type="submit"
                        className={`md:col-span-2 py-3 rounded-xl font-bold text-white transition-all ${
                            isEdit
                                ? "bg-orange-500 hover:bg-orange-600"
                                : "bg-orange-600 hover:bg-orange-700"
                        }`}
                    >
                        {isEdit ? "Simpan Perubahan" : "Tambah Produk"}
                    </button>
                    {isEdit && (
                        <button
                            onClick={() => {
                                setIsEdit(false);
                                setForm({
                                    id: null,
                                    name: "",
                                    price: "",
                                    stock: "",
                                    image: ""
                                });
                            }}
                            className="md:col-span-2 text-sm text-gray-400"
                        >
                            Batal Edit
                        </button>
                    )}
                </form>
            </div>

            {/* List Table */}
            <div className="bg-white rounded-3xl shadow-sm border border-orange-50 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 text-gray-400 text-xs uppercase font-bold">
                        <tr>
                            <th className="p-4">Produk</th>
                            <th className="p-4">Harga</th>
                            <th className="p-4">Stok</th>
                            <th className="p-4 text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {products.map(p => (
                            <tr
                                key={p.id}
                                className="hover:bg-orange-50/30 transition-colors"
                            >
                                <td className="p-4 flex items-center gap-3">
                                    <img
                                        src={p.image}
                                        alt={p.name}
                                        className="w-10 h-10 rounded-lg object-cover bg-gray-100"
                                    />
                                    <span className="font-semibold text-gray-700">
                                        {p.name}
                                    </span>
                                </td>
                                <td className="p-4 text-orange-600 font-bold">
                                    Rp {Number(p.price).toLocaleString("id-ID")}
                                </td>
                                <td className="p-4 text-gray-500">
                                    {p.stock} pcs
                                </td>
                                <td className="p-4">
                                    <div className="flex justify-center gap-2">
                                        <button
                                            onClick={() => editProduct(p)}
                                            className="p-2 text-orange-500 hover:bg-orange-50 rounded-lg"
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                        <button
                                            onClick={() => deleteProduct(p.id)}
                                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
