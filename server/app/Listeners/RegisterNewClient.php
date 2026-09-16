<?php

namespace App\Listeners;
use App\Models\Client;
use App\Models\Role;
use Illuminate\Auth\Events\Registered;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class RegisterNewClient
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event
     */
    public function handle(Registered $event): void
    {
        $user = $event->user;
        DB::transaction(function() use ($user) {
            $name = $user->first_name .'-'. $user->last_name;
            $client = Client::create([
                'name'=> $name . "'s Workspace",
                'slug'=> Str::slug($name . '-' . Str::random(5)),
                'owner_id' => $user->id
            ]);
    
            $user->clients()->attach($client->id);
            $memberRole = Role::where('name', 'ADMINISTRATOR')->first();
            if($memberRole):
                $user->roles()->syncWithoutDetaching([$memberRole->id]);
            endif;
            
        });
    }
}
