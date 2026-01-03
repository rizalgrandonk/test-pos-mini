<?php

use App\Http\Controllers\TransactionDetailController;
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
    
    // DETAIL
    Route::get(
        '/{header_id}/detail/table', 
        [TransactionDetailController::class, 'table']
    )->name('transactions.detail.table');
    
    Route::get(
        '/{header_id}/detail/create',
        [TransactionDetailController::class,'create']
    )->name('transactions.detail.create');

    Route::delete(
        '/{header_id}/detail/delete/bulk', 
        [TransactionDetailController::class, 'bulkDestroy']
    )->name('transactions.detail.bulkDestroy');

    Route::delete(
        '/{header_id}/detail/delete/{id}', 
        [TransactionDetailController::class, 'destroy']
    )->name('transactions.detail.destroy');

    Route::get('/{header_id}/detail/{id}',
        [TransactionDetailController::class,
        'edit']
    )->name('transactions.detail.edit');
    
    Route::post('/{header_id}/detail/{id}',
        [TransactionDetailController::class,
        'update']
    )->name('transactions.detail.update');
    
    Route::post('/{header_id}/detail/',
        [TransactionDetailController::class,
        'store']
    )->name('transactions.detail.store');
    
});