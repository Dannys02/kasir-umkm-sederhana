import React from "react";

export default function Transaction({ loading, setLoading, transactions }) {
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
        <div className="max-w-7xl mx-auto mb-8 bg-white p-6 rounded-2xl shadow-sm border border-indigo-50">
            <h2 className="text-lg font-bold text-gray-800 mb-4 tracking-tight">
                Riwayat Transaksi
            </h2>
            {transactions.length === 0 ? (
                <p className="text-sm text-gray-400 italic">
                    Belum ada transaksi tercatat
                </p>
            ) : (
                <ul className="space-y-3">
                    {transactions.map(tx => (
                        <li
                            key={tx.id}
                            className="flex justify-between items-center p-4 bg-orange-50/50 rounded-2xl border border-orange-100/50"
                        >
                            <div>
                                <p className="font-bold text-gray-800 text-sm">
                                    {tx.details
                                        ?.map(
                                            d => `${d.product_name} (x${d.qty})`
                                        )
                                        .join(", ")}
                                </p>
                                <div className="flex gap-3 mt-1">
                                    <span className="text-[10px] bg-white px-2 py-0.5 rounded border border-orange-100 text-orange-400 font-mono">
                                        {tx.reference_no}
                                    </span>
                                    <span className="text-[10px] text-gray-400 italic">
                                        {new Date(tx.created_at).toLocaleString(
                                            "id-ID"
                                        )}
                                    </span>
                                </div>
                            </div>
                            <span className="font-black text-orange-600">
                                Rp {tx.total_price.toLocaleString("id-ID")}
                            </span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
