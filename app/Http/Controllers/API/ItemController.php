<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Item;

class ItemController extends Controller
{
    // Ambil semua item
    public function index()
    {
        return Item::all();
    }

    // Tambah item baru
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'status' => 'required|string|max:50',
            'price' => 'required|integer|min:0',
        ]);

        $item = Item::create($validated);
        return response()->json($item, 201);
    }

    // Update item
    public function update(Request $request, $id)
    {
        $item = Item::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'status' => 'required|string|max:50',
            'price' => 'required|integer|min:0',
        ]);

        $item->update($validated);
        return response()->json($item);
    }

    // Hapus item
    public function destroy($id)
    {
        $item = Item::findOrFail($id);
        $item->delete();

        return response()->json(['message' => 'Deleted']);
    }
}
