<?php

namespace App\Http\Controllers\Api\User;

use App\Http\Controllers\Controller;
use App\Http\Resources\System\BaseResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SwitchClientController extends Controller
{
    public function __invoke(Request $request): JsonResponse
    {
            $request->validate([
                'client_id' => ['required', 'integer', 'exists:clients,id'],
            ]);

            $user = $request->user();

            $client = $usePr->clients()->where('clients.id', $request->client_id)->first();

            if (!$client) {
                return (new BaseResource([]))->response()->withMessage('You do not have access to this workspace.')->setStatusCode(403);
            }
            
            return (new BaseResource([
                'active_client' => [
                    'id'   => $client->id,
                    'name' => $client->name,
                    'slug' => $client->slug,
                ],
            ]))->response()->withMessage('Switched active client successfully.')->setStatusCode(201);
    }
}
