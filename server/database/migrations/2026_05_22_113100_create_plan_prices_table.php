<?php

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
        Schema::create('plan_prices', function (Blueprint $table) {
            $table->id();
            $table->string('name');                  // e.g., "Monthly Hobby", "Yearly Enterprise"
            $table->string('currency', 3)->default('USD'); // e.g., "USD", "MAD", "EUR"
            $table->integer('amount');               // Stored in CENTS (e.g., $9.99 = 999)
            $table->string('interval')->default('month'); // e.g., "month", "year"
            $table->boolean('is_active')->default(true); // Soft-retire old prices without deleting rows
            
            // Stripe product/price mapping
            $table->string('stripe_product_id');
            $table->string('stripe_price_id')->unique();
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('plan_prices');
    }
};
