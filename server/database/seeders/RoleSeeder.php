<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use App\Models\Role;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        $roles = config('rbac.roles', []);

        foreach ($roles as $role) {
            Role::updateOrCreate(
                ['name' => $role['name']],
                [
                    'id'        => (string) Str::uuid(),
                    'scope'     => $role['scope'],
                    'is_locked' => $role['is_locked'],
                ]
            );
        }
    }
}