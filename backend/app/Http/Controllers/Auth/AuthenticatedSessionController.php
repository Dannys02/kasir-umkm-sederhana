<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class AuthenticatedSessionController extends Controller
{
    public function store(LoginRequest $request): JsonResponse
    {
        // 1. Validasi kredensial
        $request->authenticate();

        // 2. Ambil user
        $user = $request->user();

        // 3. Buat Token (Pastikan di Model User ada 'use HasApiTokens')
        $token = $user->createToken('main')->plainTextToken;

        // 4. Kirim Token ke React
        return response()->json([
            'user' => $user,
            'token' => $token,
        ]);
    }

    public function destroy(Request $request): JsonResponse
    {
        // Hapus token saat logout
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logged out']);
    }
}
