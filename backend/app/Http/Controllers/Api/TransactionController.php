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
    // $request->cart berisi array belanjaan dari React
    return DB::transaction(function () use ($request) {
      // 1. Simpan Header
      $transaction = Transaction::create([
        "reference_no" => "TRX-" . strtoupper(Str::random(8)),
        "total_price" => $request->total_price,
      ]);

      // 2. Simpan Detail & Kurangi Stok
      foreach ($request->cart as $item) {
        $product = Product::findOrFail($item["id"]);

        // Cek stok lagi buat jaga-jaga
        if ($product->stock < $item["qty"]) {
          throw new \Exception("Stok {$product->name} tidak cukup!");
        }

        $transaction->details()->create([
          "product_id" => $product->id,
          "product_name" => $product->name,
          "qty" => $item["qty"],
          "price_at_buy" => $product->price,
        ]);

        // Potong stok di database
        $product->decrement("stock", $item["qty"]);
      }

      return response()->json([
        "success" => true,
        "message" => "Transaksi Berhasil!",
      ]);
    });
  }
}
