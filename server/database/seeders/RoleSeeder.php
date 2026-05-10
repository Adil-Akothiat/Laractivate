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
            ['name' => 'Super Admin', 'is_locked' => true],
            ['name' => 'Administrator', 'is_locked' => false],
            ['name' => 'Manager', 'is_locked' => false],
            ['name' => 'Member', 'is_locked' => false],
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