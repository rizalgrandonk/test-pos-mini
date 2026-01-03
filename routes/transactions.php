<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TransactionHeaderController;

Route::middleware('auth')->prefix('transactions')->group(function () {
    Route::get('/table', [TransactionHeaderController::class, 'table'])
        ->name('transactions.table');
    Route::get('/create', [TransactionHeaderController::class, 'create'])
        ->name('transactions.create');
    Route::delete('/delete/bulk', [TransactionHeaderController::class, 'bulkDestroy'])
        ->name('transactions.bulkDestroy');
    Route::delete('/delete/{id}', [TransactionHeaderController::class, 'destroy'])
        ->name('transactions.destroy');
    Route::get('/{id}', [TransactionHeaderController::class, 'edit'])
        ->name('transactions.edit');
    Route::post('/{id}', [TransactionHeaderController::class, 'update'])
        ->name('transactions.update');
    Route::get('/', [TransactionHeaderController::class, 'index'])
        ->name('transactions.index');
    Route::post('/', [TransactionHeaderController::class, 'store'])
        ->name('transactions.store');


    
});