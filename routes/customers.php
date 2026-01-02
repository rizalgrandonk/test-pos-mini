<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CustomerController;

Route::prefix('customers/locations')->group(function () {
    Route::get('/provinces', [CustomerController::class, 'getProvinces'])
        ->name('customer.location.province');
    Route::get('/regencies', [CustomerController::class, 'getRegencies'])
        ->name('customer.location.regency');
    Route::get('/districts', [CustomerController::class, 'getDistricts'])
        ->name('customer.location.district');
    Route::get('/villages', [CustomerController::class, 'getVillages'])
        ->name('customer.location.village');
    Route::get('/postal-code', [CustomerController::class, 'getPostalCodes'])
        ->name('customer.location.postalCode');
});

Route::middleware('auth')->prefix('customers')->group(function () {
    Route::get('/table', [CustomerController::class, 'table'])
        ->name('customer.table');
    Route::get('/create', [CustomerController::class, 'create'])
        ->name('customer.create');
    Route::delete('/delete/bulk', [CustomerController::class, 'bulkDestroy'])
        ->name('customer.bulkDestroy');
    Route::delete('/delete/{id}', [CustomerController::class, 'destroy'])
        ->name('customer.destroy');
    Route::get('/{id}', [CustomerController::class, 'edit'])
        ->name('customer.edit');
    Route::post('/{id}', [CustomerController::class, 'update'])
        ->name('customer.update');
    Route::get('/', [CustomerController::class, 'index'])
        ->name('customer.index');
    Route::post('/', [CustomerController::class, 'store'])
        ->name('customer.store');
});
