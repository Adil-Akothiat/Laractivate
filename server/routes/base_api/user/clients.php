<?php
use App\Http\Controllers\Api\User\SwitchClientController;
use App\Http\Resources\System\BaseResource;
use Illuminate\Support\Facades\Route;

Route::prefix('clients')->group(function() {
    Route::post('/switch-client', SwitchClientController::class);
    Route::get('/all', function() {
        return (new BaseResource([
            'clients' => request()->user()->clients()->select('clients.id', 'name', 'slug')->get(),
            'current_client_id' => request()->attributes->get('current_client_id'),
        ]))->response()->setStatusCode(200);
    });
});