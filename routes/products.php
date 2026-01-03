<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController;

Route::middleware('auth')->prefix('products')->group(function () {
    Route::get('/table', [ProductController::class, 'table'])
        ->name('products.table');
    Route::get('/create', [ProductController::class, 'create'])
        ->name('products.create');
    Route::delete('/delete/bulk', [ProductController::class, 'bulkDestroy'])
        ->name('products.bulkDestroy');
    Route::delete('/delete/{id}', [ProductController::class, 'destroy'])
        ->name('products.destroy');
    Route::get('/{id}', [ProductController::class, 'edit'])
        ->name('products.edit');
    Route::post('/{id}', [ProductController::class, 'update'])
        ->name('products.update');
    Route::get('/', [ProductController::class, 'index'])
        ->name('products.index');
    Route::post('/', [ProductController::class, 'store'])
        ->name('products.store');
});
