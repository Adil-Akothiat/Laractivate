<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use App\Models\Permission;

class PermissionSeeder extends Seeder
{
    public function run(): void
    {
        $permissions = [
            // ─── SYSTEM CORE ────────────────────────────────────────────────────────
            // 'all' is for Super Admins.
            ['name' => 'all',              'group' => 'System', 'is_locked' => true],
            // Controls access to the main dashboard UI for any user.
            ['name' => 'dashboard.view',   'group' => 'System', 'is_locked' => false],

            // ─── USER MANAGEMENT (ADMIN ONLY) ───────────────────────────────────────
            // For managing OTHER people's accounts and tracking their actions.
            ['name' => 'accounts.view',    'group' => 'User Management', 'is_locked' => false],
            ['name' => 'accounts.manage',  'group' => 'User Management', 'is_locked' => false],
            ['name' => 'logs.view',        'group' => 'User Management', 'is_locked' => false],

            // ─── SECURITY & ACCESS CONTROL (ADMIN ONLY) ─────────────────────────────
            ['name' => 'roles.view',       'group' => 'Security', 'is_locked' => false],
            ['name' => 'roles.manage',     'group' => 'Security', 'is_locked' => false],
            
            // ─── SYSTEM CONFIGURATION (SUPER ADMIN / TECH) ──────────────────────────
            // This replaces 'settings.view/edit' to avoid confusion with personal profile settings.
            ['name' => 'system.configure', 'group' => 'Configuration', 'is_locked' => false],
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(
                ['name' => $permission['name']], // Unique check
                [
                    'id' => (string) Str::uuid(),
                    'group' => $permission['group'],
                    'is_locked' => $permission['is_locked'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        }
    }
}