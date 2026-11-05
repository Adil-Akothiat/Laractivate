<?php

namespace App\Http\Controllers\Api\User;

use App\Http\Controllers\Controller;
use App\Http\Resources\System\BaseResource;
use App\Models\{ Client, Role };
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class UserWorkspaceController extends Controller
{
    public function index(Request $request) {
        $userWorkspaces = $request->user()
        ->clients()
        ->select('clients.id', 'name', 'slug')
        ->get();

        $currentClientId = $request->attributes->get('current_client_id');
        return (new BaseResource([
            'workspaces' => $userWorkspaces,
            'current_client_id' => $currentClientId
        ]))->response()->setStatusCode(200);
    }

    public function switchWorkspace(Request $request): JsonResponse
    {
            $validated = $request->validate([
                'client_id' => ['required', 'integer', 'exists:clients,id'],
            ]);

            $user = $request->user();

            $client = $user->clients()
            ->select('clients.id', 'name', 'slug')
            ->where('clients.id', $validated['client_id'])->first();

            if (!$client) {
                return (new BaseResource(['code'=> 'UNAUTHORIZED_TENANT_ACCESS']))
                ->withMessage('You do not have access to this workspace.')
                ->response()
                ->setStatusCode(403);
            }

            session(['current_client_id'=> $client->id]);
            session()->save();
            
            return (new BaseResource(['redirect_path'=> "/$client->slug/dashboard"]))->withMessage('Switched active client successfully.')->response()->setStatusCode(201);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name'=> ['required', 'string', 'max:100']
        ]);

        $user = $request->user();
        DB::transaction(function () use ($validated, $user) {
            $client = Client::create([
                'name'=> $validated['name'],
                'slug'=> Str::slug($validated['name']) . '-' . Str::random(5),
                'owner_id'=> $user->id
            ]);

             $ownerRole = Role::where('name', 'ADMINISTRATOR')
                ->where('scope', 'client')
                ->first();
            
            if (!$ownerRole) {
                throw new \Exception("Default workspace 'ADMINISTRATOR' role not found. Please run seeders.");
            }
            $user->clients()->attach($client->id, [
                'role_id'=> $ownerRole->id
            ]);
        });

        return (new BaseResource([]))->withMessage('Workspace created successfully.')
            ->response()
            ->setStatusCode(201)
        ;
    }

    public function verifySlug(Request $request, string $slug): JsonResponse
    {
        $user = $request->user();
        return (new BaseResource(['verified'=> $user->clients()->where('slug', $slug)->exists()]))->response()->setStatusCode(200);
    }
}
