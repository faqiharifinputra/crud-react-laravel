<?php

namespace App\Http\Controllers;

use App\Models\Item;
use App\Exports\ItemsExport;
use Maatwebsite\Excel\Facades\Excel;
use PDF;

class ExportController extends Controller
{
    public function exportExcel()
    {
        return Excel::download(new ItemsExport, 'items.xlsx');
    }

    public function exportPDF()
    {
        $items = Item::all();
        $pdf = PDF::loadView('exports.items-pdf', compact('items'));
        return $pdf->download('items.pdf');
    }
}

