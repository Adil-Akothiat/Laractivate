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
        Schema::create('payment_methods', function (Blueprint $table) {
            $table->id();
            $table->foreignUuid('user_id')->constrained('users')->onDelete('cascade');
            $table->string('provider');              // e.g., "stripe", "paypal"
            $table->string('type');                  // e.g., "card", "sepa_debit"
            $table->string('last_four', 4)->nullable(); // e.g., "4242" for UI display
            $table->string('brand')->nullable();     // e.g., "visa", "mastercard"
            $table->boolean('is_default')->default(false);
            
            // Stripe token mapping
            $table->string('stripe_payment_method_id')->unique(); 
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payment_methods');
    }
};
