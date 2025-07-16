<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\ItemController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

Route::middleware('api')->get('/test', function (Request $request) {
    return response()->json(['message' => 'API aktif!']);
});

// ✅ API CRUD untuk Item
Route::apiResource('items', ItemController::class);

// (Opsional) Authenticated user
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
