<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    // READ: Ambil semua kategori
    public function index()
    {
        $categories = Category::all();
        return response()->json(['success' => true, 'data' => $categories]);
    }

    // CREATE: Tambah kategori baru
    public function store(Request $request)
    {
        $request->validate(['name' => 'required|unique:categories']);
        
        $category = Category::create(['name' => $request->name]);
        return response()->json(['success' => true, 'data' => $category]);
    }

    // UPDATE: Edit nama kategori
    public function update(Request $request, $id)
    {
        $category = Category::findOrFail($id);
        $category->update(['name' => $request->name]);
        return response()->json(['success' => true, 'data' => $category]);
    }

    // DELETE: Hapus kategori
    public function destroy($id)
    {
        Category::destroy($id);
        return response()->json(['success' => true, 'message' => 'Kategori dihapus']);
    }
}
