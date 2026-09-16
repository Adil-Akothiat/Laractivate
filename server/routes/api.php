<?php
use Illuminate\Support\Facades\Route;
use App\Models\Invoice;
use App\Http\Middleware\SetCurrentClientContext;

require base_path('routes/base_api/auth/index.php');
require base_path('routes/base_api/billing/index.php');

Route::get('/bench-test', function() {
    return response()->json(['status' => 'success', 'framework' => 'Laravel 11']);
});

Route::middleware(['auth:api', 'check.revocation', ''])->group(function() {
    require base_path('routes/base_api/user/index.php');
    require base_path('routes/base_api/system/index.php');
    require base_path('routes/base_api/access/index.php');

    // جلب الفواتير المعزولة تلقائياً
    Route::get('/test-invoices', function () {
        return response()->json([
            'active_client_id' => request()->attributes->get('current_client_id'),
            'invoices' => Invoice::all(),
        ]);
    });
});