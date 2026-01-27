import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Image as ImageIcon, X } from "lucide-react";
import axios from "axios";

export default function ProductList({
    loading,
    products,
    categories,
    fetchData
}) {
    const [form, setForm] = useState({
        id: null,
        name: "",
        category_id: "",
        price: "",
        stock: ""
    });

    const [imageFile, setImageFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null); // Untuk nampilin gambar yang dipilih
    const [isEdit, setIsEdit] = useState(false);

    const STORAGE_URL = "http://127.0.0.1:8000/storage/";

    // 1. Fungsi handle gambar & Preview
    const handleImageChange = e => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setPreviewUrl(URL.createObjectURL(file)); // Buat URL sementara buat tampilan
        }
    };

    const handleSubmit = async e => {
        e.preventDefault();

        const data = new FormData();
        data.append("name", form.name);
        data.append("category_id", form.category_id);
        data.append("price", form.price);
        data.append("stock", form.stock);

        // Hanya kirim gambar kalau ada perubahan
        if (imageFile) {
            data.append("image", imageFile);
        }

        try {
            if (isEdit) {
                // TRIK LARAVEL: Pakai POST tapi tambahin spoofing method PUT
                data.append("_method", "PUT");
                await axios.put(
                    `http://127.0.0.1:8000/api/products/${form.id}`,
                    data,
                    {
                        headers: { "Content-Type": "multipart/form-data" }
                    }
                );
            } else {
                await axios.post("http://127.0.0.1:8000/api/products", data, {
                    headers: { "Content-Type": "multipart/form-data" }
                });
            }

            fetchData();
            resetForm();
            alert("Produk berhasil disimpan!");
        } catch (error) {
            console.error(error);
            alert("Gagal simpan produk! Cek koneksi atau validasi Laravel.");
        }
    };

    const resetForm = () => {
        setForm({ id: null, name: "", category_id: "", price: "", stock: "" });
        setImageFile(null);
        setPreviewUrl(null);
        setIsEdit(false);
    };

    const editProduct = p => {
        setForm({
            id: p.id,
            name: p.name,
            category_id: p.category_id,
            price: p.price,
            stock: p.stock
        });
        // Kalau edit, kasih preview gambar yang lama dulu
        setPreviewUrl(p.image ? STORAGE_URL + p.image : null);
        setIsEdit(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const deleteProduct = async id => {
        if (confirm("Hapus produk ini?")) {
            try {
                await axios.delete(`http://127.0.0.1:8000/api/products/${id}`);
                fetchData();
            } catch (error) {
                alert("Gagal hapus!");
            }
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <div className="custom-loader mb-4"></div>
                <p className="text-gray-400 animate-pulse">
                    Menghubungkan ke server...
                </p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto bg-white p-8 rounded-3xl shadow-sm border border-orange-50">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Plus className="text-orange-600" />{" "}
                {isEdit ? "Edit Produk" : "Tambah Produk Baru"}
            </h2>

            <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-10 bg-gray-50 p-6 rounded-2xl"
            >
                <input
                    type="text"
                    placeholder="Nama Produk"
                    className="p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    required
                />

                <select
                    className="p-3 rounded-xl border border-gray-200 outline-none"
                    value={form.category_id}
                    onChange={e =>
                        setForm({ ...form, category_id: e.target.value })
                    }
                    required
                >
                    <option value="">Pilih Kategori</option>
                    {categories.map(c => (
                        <option key={c.id} value={c.id}>
                            {c.name}
                        </option>
                    ))}
                </select>

                <input
                    type="number"
                    placeholder="Harga"
                    className="p-3 rounded-xl border border-gray-200"
                    value={form.price}
                    onChange={e => setForm({ ...form, price: e.target.value })}
                    required
                />

                <input
                    type="number"
                    placeholder="Stok"
                    className="p-3 rounded-xl border border-gray-200"
                    value={form.stock}
                    onChange={e => setForm({ ...form, stock: e.target.value })}
                    required
                />

                {/* Input Gambar dengan Preview */}
                <label className="relative flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-white transition-all p-2 overflow-hidden h-[300px] md:h-auto">
                    {previewUrl ? (
                        <img
                            src={previewUrl}
                            className="absolute inset-0 w-full h-full object-cover"
                            alt="Preview"
                        />
                    ) : (
                        <>
                            <ImageIcon size={20} className="text-gray-400" />
                            <span className="text-[10px] text-gray-400 mt-1">
                                Foto
                            </span>
                        </>
                    )}
                    <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageChange}
                    />
                </label>

                <div className="flex gap-2">
                    <button
                        type="submit"
                        className="flex-1 p-3 bg-orange-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-orange-700 transition-all"
                    >
                        {isEdit ? <Edit2 size={18} /> : <Plus size={18} />}{" "}
                        {isEdit ? "Update" : "Simpan"}
                    </button>
                    {isEdit && (
                        <button
                            type="button"
                            onClick={resetForm}
                            className="p-3 bg-gray-200 text-gray-600 rounded-xl"
                        >
                            <X size={18} />
                        </button>
                    )}
                </div>
            </form>

            {/* Tabel Produk */}
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-gray-100 text-gray-400 text-sm">
                            <th className="py-4 px-6 font-medium">Gambar</th>
                            <th className="py-4 px-6 font-medium">
                                Nama Produk
                            </th>
                            <th className="py-4 px-6 font-medium">Kategori</th>
                            <th className="py-4 px-6 font-medium">Harga</th>
                            <th className="py-4 px-6 font-medium">Stok</th>
                            <th className="py-4 px-6 font-medium text-center">
                                Aksi
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(p => (
                            <tr
                                key={p.id}
                                className="border-b border-gray-50 hover:bg-gray-50/50 transition-all"
                            >
                                <td className="py-4 px-6 gap-3">
                                    <img
                                        src={
                                            p.image
                                                ? p.image.startsWith("http")
                                                    ? p.image
                                                    : STORAGE_URL + p.image
                                                : "https://via.placeholder.com/50"
                                        }
                                        className="w-10 h-10 rounded-lg object-cover border border-gray-100"
                                        alt={p.name}
                                    />
                                </td>
                                <td className="py-4 px-6 font-semibold text-gray-700 gap-3">
                                    {p.name}
                                </td>
                                <td className="py-4 px-6 text-sm text-gray-500">
                                    {p.category?.name || "No Category"}
                                </td>
                                <td className="py-4 px-6 text-orange-600 font-bold">
                                    Rp {p.price.toLocaleString("id-ID")}
                                </td>
                                <td className="py-4 px-6 text-gray-500">
                                    {p.stock} pcs
                                </td>
                                <td className="py-4 px-6 text-center">
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
