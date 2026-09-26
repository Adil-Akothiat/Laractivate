<?php

return [

    /*
    |--------------------------------------------------------------------------
    | System & Tenant Permissions
    |--------------------------------------------------------------------------
    | Scope 'system': Platform-wide permissions for Super Admins.
    | Scope 'client': Tenant-wide permissions manageable by Workspace Owners/Admins.
    |
    */
    'permissions' => [
        // ─── SYSTEM CORE ────────────────────────────────────────────────────────
        [
            'name'      => 'all',
            'group'     => 'System',
            'scope'     => 'system',
            'is_locked' => true,
        ],
        [
            'name'      => 'dashboard.view',
            'group'     => 'System',
            'scope'     => 'client',
            'is_locked' => false,
        ],

        // ─── WORKSPACE & ACCOUNT MANAGEMENT ─────────────────────────────────────
        [
            'name'      => 'accounts.view',
            'group'     => 'User Management',
            'scope'     => 'client',
            'is_locked' => false,
        ],
        [
            'name'      => 'accounts.manage',
            'group'     => 'User Management',
            'scope'     => 'client',
            'is_locked' => false,
        ],
        [
            'name'      => 'logs.view',
            'group'     => 'User Management',
            'scope'     => 'client',
            'is_locked' => false,
        ],

        // ─── SECURITY & ACCESS CONTROL ─────────────────────────────────────────
        [
            'name'      => 'roles.view',
            'group'     => 'Security',
            'scope'     => 'client',
            'is_locked' => false,
        ],
        [
            'name'      => 'roles.manage',
            'group'     => 'Security',
            'scope'     => 'client',
            'is_locked' => false,
        ],

        // ─── SYSTEM CONFIGURATION (SUPER ADMIN PLATFORM CONTROL) ────────────────
        [
            'name'      => 'system.configure',
            'group'     => 'Configuration',
            'scope'     => 'system',
            'is_locked' => false,
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Default Roles & Initial Permission Mapping
    |--------------------------------------------------------------------------
    | Scope 'system': System roles (Platform level).
    | Scope 'client': Workspace default templates.
    |
    */
    'roles' => [
        [
            'name'        => 'SUPER_ADMIN',
            'scope'       => 'system',
            'is_locked'   => true,
            'permissions' => ['all'],
        ],
        [
            'name'        => 'ADMINISTRATOR',
            'scope'       => 'client',
            'is_locked'   => false,
            'permissions' => [
                'dashboard.view',
                'accounts.view',
                'accounts.manage',
                'roles.view',
                'roles.manage',
                'logs.view',
            ],
        ],
        [
            'name'        => 'MANAGER',
            'scope'       => 'client',
            'is_locked'   => false,
            'permissions' => [
                'dashboard.view',
                'accounts.view',
                'logs.view',
            ],
        ],
        [
            'name'        => 'MEMBER',
            'scope'       => 'client',
            'is_locked'   => false,
            'permissions' => [
                'dashboard.view',
            ],
        ],
    ],
];