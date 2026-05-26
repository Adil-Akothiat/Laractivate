<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Role;
use App\Models\Permission;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        $roles = Role::pluck('id', 'name');
        $permissions = Permission::pluck('id', 'name');

        // Clear existing to avoid duplicates when re-seeding
        DB::table('permission_role')->truncate();

        $rolePermissions = [];

        // 1. Give EVERYTHING to Super Admin
        $rolePermissions[] = [
            'role_id' => $roles['SUPER_ADMIN'],
            'permission_id' => $permissions['all'],
        ];

        // 2. Give specific access to Administrator
        $adminPerms = [
            'dashboard.view',
            'users.view',
            'users.create',
            'users.edit',
            'roles.view',
            'settings.view'
        ];

        foreach ($adminPerms as $permName) {
            if (isset($permissions[$permName])) {
                $rolePermissions[] = [
                    'role_id' => $roles['ADMINISTRATOR'],
                    'permission_id' => $permissions[$permName],
                ];
            }
        }

        DB::table('permission_role')->insert($rolePermissions);
    }
}