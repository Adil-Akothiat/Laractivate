<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Role;
use Illuminate\Support\Str;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        $roles = [
            ['name' => 'SUPER_ADMIN', 'is_locked' => true],
            ['name' => 'ADMINISTRATOR', 'is_locked' => false],
            ['name' => 'MANAGER', 'is_locked' => false],
            ['name' => 'MEMBER', 'is_locked' => false],
        ];

        foreach ($roles as $role) {
            Role::updateOrInsert(
                ['name' => $role['name']], 
                [
                    'id' => (string) Str::uuid(),
                    'is_locked' => $role['is_locked'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        }
    }
}