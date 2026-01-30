import React, { useState } from "react";
import { Plus, Trash2, Tags, Edit2, X, Check } from "lucide-react";
import axios from "axios";

export default function CategoryList({
    loading,
    setLoading,
    categories,
    fetchData
}) {
    const [catName, setCatName] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [editName, setEditName] = useState("");

    const addCategory = async e => {
        e.preventDefault();
        try {
            await axios.post("http://127.0.0.1:8000/api/categories", {
                name: catName
            });
            setCatName("");
            fetchData();
        } catch (error) {
            alert("Gagal tambah kategori!");
        }
    };

    const saveEdit = async () => {
        try {
            await axios.put(
                `http://127.0.0.1:8000/api/categories/${editingId}`,
                { name: editName }
            );
            setEditingId(null);
            fetchData();
        } catch (error) {
            alert("Gagal update!");
        }
    };

    const deleteCategory = async id => {
        if (
            confirm(
                "Hapus kategori ini? Semua produk di dalamnya juga akan terpengaruh."
            )
        ) {
            await axios.delete(`http://127.0.0.1:8000/api/categories/${id}`);
            fetchData();
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
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-3xl shadow-sm border border-orange-50">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                Daftar Kategori
            </h2>
            <form onSubmit={addCategory} className="flex flex-col gap-2 mb-8">
                <input
                    type="text"
                    className="flex-1 p-3 rounded-xl border border-gray-200 outline-none"
                    placeholder="Nama Kategori Baru..."
                    value={catName}
                    onChange={e => setCatName(e.target.value)}
                    required
                />
                <button
                    type="submit"
                    className="bg-orange-600 w-fit text-white px-6 py-2 rounded-xl font-bold hover:bg-orange-700 transition-all flex items-center gap-2"
                >
                    <Plus size={18} /> Tambah
                </button>
            </form>
            <div className="space-y-3">
                {categories.length === 0 ? (
                    <div className="flex flex-col items-center justify-center min-h-[40vh] text-center">
                        <div className="bg-gray-50 p-6 rounded-full mb-4">
                            <Tags size={48} className="text-gray-300" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-700">
                            Data Kategori Tidak Ada
                        </h3>
                        <p className="text-gray-400 text-sm">
                            Belum ada kategori yang ditambahkan di sini.
                        </p>
                    </div>
                ) : (
                    categories.map(cat => (
                        <div
                            key={cat.id}
                            className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl group hover:bg-orange-50 transition-all"
                        >
                            {editingId === cat.id ? (
                                <input
                                    type="text"
                                    className="flex-1 p-1 bg-white border rounded outline-none"
                                    value={editName}
                                    onChange={e => setEditName(e.target.value)}
                                    autoFocus
                                />
                            ) : (
                                <span className="font-semibold text-gray-700">
                                    {cat.name}
                                </span>
                            )}
                            <div className="flex gap-2 opacity-100 transition-all">
                                {editingId === cat.id ? (
                                    <>
                                        <button
                                            onClick={saveEdit}
                                            className="p-2 text-green-600 hover:bg-green-100 rounded-lg"
                                        >
                                            <Check size={18} />
                                        </button>
                                        <button
                                            onClick={() => setEditingId(null)}
                                            className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg"
                                        >
                                            <X size={18} />
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => {
                                                setEditingId(cat.id);
                                                setEditName(cat.name);
                                            }}
                                            className="p-2 text-orange-500 hover:bg-orange-100 rounded-lg"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button
                                            onClick={() =>
                                                deleteCategory(cat.id)
                                            }
                                            className="p-2 text-red-500 hover:bg-red-100 rounded-lg"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
