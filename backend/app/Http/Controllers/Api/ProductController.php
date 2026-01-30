<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Laravel\Facades\Image; // Import Library

class ProductController extends Controller
{
  public function index()
  {
    $products = Product::with("category")->get();
    return response()->json(["success" => true, "data" => $products]);
  }

  public function store(Request $request)
  {
    $data = $request->validate([
      "category_id" => "required",
      "name" => "required",
      "price" => "required|numeric",
      "stock" => "required|numeric",
      "image" => "nullable|image|max:2000",
    ]);

    if ($request->hasFile("image")) {
      try {
        $file = $request->file("image");
        $filename = time() . "_" . $file->getClientOriginalName();

        // Inisialisasi Image Manager (Intervention V3)
        $manager = new \Intervention\Image\ImageManager(
          new \Intervention\Image\Drivers\Gd\Driver()
        );
        $img = $manager->read($file);

        // Resize ke lebar 800px (tinggi proporsional)
        $img->scale(width: 800);

        // Simpan hasil kompresi ke folder products
        $path = "products/" . $filename;
        Storage::disk("public")->put(
          $path,
          (string) $img->encodeByExtension(
            $file->getClientOriginalExtension(),
            quality: 70
          )
        );

        $data["image"] = $path;
      } catch (\Exception $e) {
        // Kalau gagal resize (misal RAM Termux penuh), simpan asli aja biar gak error 500
        $data["image"] = $request->file("image")->store("products", "public");
      }
    }

    $product = Product::create($data);
    return response()->json([
      "success" => true,
      "data" => $product->load("category"),
    ]);
  }

  public function update(Request $request, $id)
  {
    $product = Product::findOrFail($id);

    // 1. Validasi itu WAJIB supaya gak "anjing" pas gagal
    $validated = $request->validate([
      "category_id" => "required",
      "name" => "required",
      "price" => "required|numeric",
      "stock" => "required|numeric",
      "image" => "nullable|image|max:2000", // Konsisten 2MB
    ]);

    // 2. Ambil data teks saja dulu
    $data = $request->only(["category_id", "name", "price", "stock"]);

    // 3. Logika Gambar
    if ($request->hasFile("image")) {
      try {
        // Hapus yang lama biar gak nyampah di Termux
        if ($product->image) {
          Storage::disk("public")->delete($product->image);
        }

        $file = $request->file("image");
        $filename = time() . "_" . $file->getClientOriginalName();

        // Pake Image Manager biar enteng
        $manager = new \Intervention\Image\ImageManager(
          new \Intervention\Image\Drivers\Gd\Driver()
        );
        $img = $manager->read($file);
        $img->scale(width: 800);

        $path = "products/" . $filename;
        Storage::disk("public")->put(
          $path,
          (string) $img->encodeByExtension(
            $file->getClientOriginalExtension(),
            quality: 70
          )
        );

        $data["image"] = $path;
      } catch (\Exception $e) {
        // Backup kalau Intervention gagal
        $data["image"] = $request->file("image")->store("products", "public");
      }
    }

    // 4. Update hanya data yang berubah
    $product->update($data);

    return response()->json([
      "success" => true,
      "data" => $product->load("category"),
    ]);
  }

  public function destroy($id)
  {
    $product = Product::findOrFail($id);
    $product->delete();

    if ($product->image) {
      Storage::disk("public")->delete($product->image);
    }
    return response()->json(["success" => true]);
  }
}
