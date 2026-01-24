export default function Transaction({ transactions, setTransactions }) {
    return (
        <>
            <div
                className="max-w-7xl mx-auto mb-8
            items-center bg-white p-6 rounded-2xl shadow-sm border
            border-indigo-50"
            >
                <h2 className="text-lg font-bold text-gray-800 mb-4">
                    Riwayat Transaksi
                </h2>
                {transactions.length === 0 ? (
                    <p className="text-sm text-gray-400">Belum ada transaksi</p>
                ) : (
                    <ul className="space-y-2">
                        {transactions.map(tx => (
                            <li
                                key={tx.id}
                                className="flex justify-between items-center p-3 bg-indigo-50/50 rounded-xl"
                            >
                                <div>
                                    <p className="font-bold text-gray-800">
                                        {tx.product}
                                    </p>
                                    <p className="text-[10px] text-gray-400">
                                        Jam: {tx.time}
                                    </p>
                                </div>
                                <span className="font-bold text-indigo-600">
                                    Rp {tx.price.toLocaleString("id-ID")}
                                </span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </>
    );
}
