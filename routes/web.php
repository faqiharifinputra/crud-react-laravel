<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ExportController;

Route::get('/export-excel', [ExportController::class, 'exportExcel']);
Route::get('/export-pdf', [ExportController::class, 'exportPDF']);




Route::get('/', function () {
    return view('react');
});
