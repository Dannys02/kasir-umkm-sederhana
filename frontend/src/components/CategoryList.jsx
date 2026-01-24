import React, { useState } from "react";
import { Plus, Trash2, Tag, Edit2, X, Check } from "lucide-react";

export default function CategoryList({
    categories,
    setCategories,
    products,
    setProducts
}) {
    const [catName, setCatName] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [editName, setEditName] = useState("");

    // --- CREATE ---
    const addCategory = e => {
        e.preventDefault();

        // Cek Duplikat
        const isExist = categories.some(
            c => c.name.toLowerCase() === catName.toLowerCase()
        );
        if (isExist) return alert("Kategori sudah ada!");

        const newCat = { id: Date.now(), name: catName };
        setCategories([...categories, newCat]);
        setCatName("");
    };

    // --- UPDATE ---
    const startEdit = cat => {
        setEditingId(cat.id);
        setEditName(cat.name);
    };

    const saveEdit = oldName => {
        if (!editName.trim()) return setEditingId(null);

        // 1. Update nama kategori di state categories
        setCategories(
            categories.map(c =>
                c.id === editingId ? { ...c, name: editName } : c
            )
        );

        // 2. WAJIB: Update semua produk yang pakai kategori lama ke nama baru
        // Kalau nggak, produknya bakal kehilangan kategori (orphan data)
        setProducts(
            products.map(p =>
                p.category === oldName ? { ...p, category: editName } : p
            )
        );

        setEditingId(null);
    };

    // --- DELETE ---
    const deleteCategory = (id, name) => {
        const isUsed = products.some(p => p.category === name);
        if (isUsed)
            return alert(
                `Gak bisa dihapus! Masih ada ${
                    products.filter(p => p.category === name).length
                } produk di kategori ini.`
            );

        if (window.confirm("Hapus kategori ini secara permanen?")) {
            setCategories(categories.filter(c => c.id !== id));
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6 pb-10">
            {/* Form Input Kategori */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-orange-50">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Tag size={20} className="text-orange-600" /> Manajemen
                    Kategori
                </h2>
                <form onSubmit={addCategory} className="flex flex-col gap-4">
                    <input
                        type="text"
                        value={catName}
                        onChange={e => setCatName(e.target.value)}
                        placeholder="Kategori..."
                        className="flex-1 p-3 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                        required
                    />
                    <button
                        type="submit"
                        className="w-fit bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 transition-all"
                    >
                        <Plus size={18} /> Simpan
                    </button>
                </form>
            </div>

            {/* Tabel Daftar Kategori */}
            <div className="bg-white rounded-3xl shadow-sm border border-orange-50 overflow-hidden">
                <table className="w-full text-left overflow-x-auto whitespace-nowrap">
                    <thead className="bg-gray-50 text-gray-400 text-[10px] uppercase font-bold tracking-wider">
                        <tr>
                            <th className="p-4">Nama Kategori</th>
                            <th className="p-4">Total Item</th>
                            <th className="p-4 text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {categories.map(cat => (
                            <tr
                                key={cat.id}
                                className="group hover:bg-orange-50/30 transition-colors"
                            >
                                <td className="p-4">
                                    {editingId === cat.id ? (
                                        <input
                                            autoFocus
                                            className="border-b-2 border-orange-500 outline-none bg-transparent font-semibold text-gray-700 w-full"
                                            value={editName}
                                            onChange={e =>
                                                setEditName(e.target.value)
                                            }
                                            onKeyDown={e =>
                                                e.key === "Enter" &&
                                                saveEdit(cat.name)
                                            }
                                        />
                                    ) : (
                                        <span className="font-semibold text-gray-700">
                                            {cat.name}
                                        </span>
                                    )}
                                </td>
                                <td className="p-4 text-sm text-gray-400">
                                    <span className="bg-gray-100 px-2 py-0.5 rounded-md">
                                        {
                                            products.filter(
                                                p => p.category === cat.name
                                            ).length
                                        }{" "}
                                        Produk
                                    </span>
                                </td>
                                <td className="p-4">
                                    <div className="flex justify-center gap-1">
                                        {editingId === cat.id ? (
                                            <>
                                                <button
                                                    onClick={() =>
                                                        saveEdit(cat.name)
                                                    }
                                                    className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg"
                                                >
                                                    <Check size={18} />
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        setEditingId(null)
                                                    }
                                                    className="p-2 text-gray-400 hover:bg-gray-50 rounded-lg"
                                                >
                                                    <X size={18} />
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button
                                                    onClick={() =>
                                                        startEdit(cat)
                                                    }
                                                    className="p-2 text-orange-400 hover:bg-orange-50 rounded-lg transition-all"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        deleteCategory(
                                                            cat.id,
                                                            cat.name
                                                        )
                                                    }
                                                    className="p-2 text-red-400 hover:bg-red-50 rounded-lg"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </>
                                        )}
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
