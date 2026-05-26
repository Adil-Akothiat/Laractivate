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
        Schema::create('invoices', function (Blueprint $table) {
            $table->id();
            $table->foreignUuid('user_id')->constrained('users')->onDelete('cascade');

            // Financial details stored in cents to prevent decimal math rounding bugs
            $table->integer('subtotal');             // Price before tax
            $table->integer('tax_amount')->default(0); 
            $table->integer('total');                // Final price paid
            $table->string('currency', 3)->default('USD');
            $table->string('status');                // e.g., "paid", "open", "void"
            
            // Relationships (Safely restricted or nullified to prevent cascade loss)
            $table->foreignId('payment_method_id')->nullable()->constrained('payment_methods')->onDelete('set null');
            $table->foreignId('tax_rate_id')->nullable()->constrained('tax_rates')->onDelete('restrict');
            
            // Stripe receipt mapping and download URLs
            $table->string('stripe_invoice_id')->nullable()->unique();
            $table->text('hosted_invoice_url')->nullable(); // Direct link to Stripe's hosted receipt page
            $table->text('invoice_pdf')->nullable();        // Direct download link to PDF
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('invoices');
    }
};
