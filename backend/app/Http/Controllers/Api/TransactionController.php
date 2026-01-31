<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class TransactionController extends Controller
{
  // READ: Riwayat transaksi (untuk Transaction.jsx)
  public function index()
  {
    $transactions = Transaction::with("details")
      ->latest()
      ->get();
    return response()->json([
      "success" => true,
      "data" => $transactions,
      "total_revenue" => $transactions->sum("total_price"),
    ]);
  }

  // CREATE: Proses Checkout (handleConfirm di React)
  public function store(Request $request)
{
    return DB::transaction(function () use ($request) {
        $transaction = Transaction::create([
            "reference_no" => "TRX-" . strtoupper(Str::random(8)),
            "total_price" => $request->total_price,
        ]);
        
        foreach ($request->cart as $item) {
            $transaction->details()->create([
                "product_id" => $item["id"],
                "product_name" => $item["name"], // Pastikan dari React kirim nama juga
                "qty" => $item["qty"],
                "price_at_buy" => $item["price"],
            ]);
        }

        return response()->json(["success" => true]);
    });
}

}
