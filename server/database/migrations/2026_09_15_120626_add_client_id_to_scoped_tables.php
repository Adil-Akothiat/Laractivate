<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Invoices
        Schema::table('invoices', function (Blueprint $table) {
            $table->foreignId('client_id')->after('id')->constrained()->onDelete('cascade');
        });

        // 2. Subscriptions
        Schema::table('subscriptions', function (Blueprint $table) {
            $table->foreignId('client_id')->after('id')->constrained()->onDelete('cascade');
        });

        // 3. Activity Logs (Nullable في حال كان هناك لوج عام للنظام)
        Schema::table('activity_logs', function (Blueprint $table) {
            $table->foreignId('client_id')->nullable()->after('id')->constrained()->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::table('invoices', function (Blueprint $table) {
            $table->dropForeign(['client_id']);
            $table->dropColumn('client_id');
        });

        Schema::table('subscriptions', function (Blueprint $table) {
            $table->dropForeign(['client_id']);
            $table->dropColumn('client_id');
        });

        Schema::table('activity_logs', function (Blueprint $table) {
            $table->dropForeign(['client_id']);
            $table->dropColumn('client_id');
        });
    }
};