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
                                className="flex justify-between text-sm"
                            >
                                <span>{tx.product}</span>
                                <span className="font-medium">
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
