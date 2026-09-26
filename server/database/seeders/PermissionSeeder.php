<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use App\Models\Permission;

class PermissionSeeder extends Seeder
{
    public function run(): void
    {
        $permissions = config('rbac.permissions', []);

        foreach ($permissions as $permission) {
            Permission::updateOrCreate(
                ['name' => $permission['name']],
                [
                    'id'        => (string) Str::uuid(),
                    'group'     => $permission['group'],
                    'scope'     => $permission['scope'],
                    'is_locked' => $permission['is_locked'],
                ]
            );
        }
    }
}