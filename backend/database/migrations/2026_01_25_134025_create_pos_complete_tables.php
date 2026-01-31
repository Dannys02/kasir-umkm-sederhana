<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
  public function up(): void
  {
    // 1. Tabel Kategori
    Schema::create("categories", function (Blueprint $table) {
      $table->id();
      $table->string("name");
      $table->timestamps();
    });

    // 2. Tabel Produk (Sesuai dengan state products di App.jsx lo)
    Schema::create("products", function (Blueprint $table) {
      $table->id();
      $table
        ->foreignId("category_id")
        ->constrained()
        ->onDelete("cascade");
      $table->string("name");
      $table->string("image"); // Untuk URL/Path gambar
      $table->integer("price");
      $table->timestamps();
    });

    // 3. Tabel Transaksi (Header/Riwayat)
    Schema::create("transactions", function (Blueprint $table) {
      $table->id();
      $table->string("reference_no")->unique(); // Kayak TRX-12345
      $table->integer("total_price");
      $table->timestamps();
    });

    // 4. Tabel Detail Transaksi (Anaknya Transaksi)
    Schema::create("transaction_details", function (Blueprint $table) {
      $table->id();
      $table
        ->foreignId("transaction_id")
        ->constrained()
        ->onDelete("cascade");
      $table->foreignId("product_id")->constrained();
      $table->string("product_name"); // Simpan nama buat backup kalau produk dihapus
      $table->integer("qty");
      $table->integer("price_at_buy"); // Harga pas dibeli (biar gak berubah kalau harga produk naik)
      $table->timestamps();
    });
  }

  public function down(): void
  {
    Schema::dropIfExists("transaction_details");
    Schema::dropIfExists("transactions");
    Schema::dropIfExists("products");
    Schema::dropIfExists("categories");
  }
};
