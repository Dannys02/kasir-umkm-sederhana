<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Category;
use App\Models\Product;

class DatabaseSeeder extends Seeder
{
  use WithoutModelEvents;

  /**
   * Seed the application's database.
   */
  public function run(): void
  {
    // User::factory(10)->create();



    // 1. Buat Kategori
    $makanan = Category::create(["name" => "Makanan"]);
    $minuman = Category::create(["name" => "Minuman"]);

    // 2. Buat Produk (Ayam Dada & Teh)
    Product::create([
      "category_id" => $makanan->id,
      "name" => "Ayam Geprek Dada",
      "price" => 10000,
      "stock" => 10,
      "image" => "products/NasiGeprek.jpg", // Nanti bisa upload via dashboard
    ]);
    
    Product::create([
      "category_id" => $minuman->id,
      "name" => "Teh Manis",
      "price" => 5000,
      "stock" => 20,
      "image" => "products/TehManis.jpeg",
    ]);
  }
}
