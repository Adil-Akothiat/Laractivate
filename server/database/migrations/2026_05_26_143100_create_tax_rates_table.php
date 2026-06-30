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
        Schema::create('tax_rates', function (Blueprint $table) {
            $table->id();
            $table->string('name');                  // e.g., "VAT Morocco", "US Sales Tax"
            $table->string('description')->nullable();
            $table->decimal('percentage', 5, 2);     // e.g., 20.00 for 20% or 5.25 for 5.25%
            $table->boolean('is_inclusive')->default(false); // Tax included in price or added on top
            
            // Stripe integration link
            $table->string('stripe_tax_rate_id')->nullable()->unique(); 
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tax_rates');
    }
};
