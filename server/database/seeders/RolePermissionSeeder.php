<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Role;
use App\Models\Permission;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        $rolesConfig = config('rbac.roles', []);

        foreach ($rolesConfig as $roleConfig) {
            $role = Role::where('name', $roleConfig['name'])->first();

            if (!$role) {
                continue;
            }

            // جلب الـ IDs الخاصة بالصلاحيات المحددة لهذا الدور
            $permissionIds = Permission::whereIn('name', $roleConfig['permissions'])
                ->pluck('id')
                ->toArray();

            // ربط الصلاحيات بالدور بدقة مع تجنب التكرار
            $role->permissions()->sync($permissionIds);
        }
    }
}