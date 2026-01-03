<?php

use App\Models\TransactionDiscount;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('transaction_discounts', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('transaction_detail_id');
            $table->integer('sequence')->default(1);
            $table->enum('type', [
                TransactionDiscount::TYPE_PERCENTAGE,
                TransactionDiscount::TYPE_AMOUNT
            ])->default(TransactionDiscount::TYPE_PERCENTAGE);
            $table->decimal('value', 15, 2);
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('transaction_detail_id')
                ->references('id')->on('transaction_details')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transaction_discounts');
    }
};
