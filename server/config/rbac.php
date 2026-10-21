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
        // ─── SYSTEM CORE & ADMIN DASHBOARD ──────────────────────────────────────
        [
            'name'      => 'all',
            'group'     => 'System',
            'scope'     => 'system',
            'is_locked' => true,
        ],
        [
            'name'      => 'system.dashboard.view',
            'group'     => 'System Administration',
            'scope'     => 'system',
            'is_locked' => true,
        ],
        [
            'name'      => 'system.configure',
            'group'     => 'Configuration',
            'scope'     => 'system',
            'is_locked' => false,
        ],

        // ─── SYSTEM USERS & ACCOUNTS ───────────────────────────────────────────
        [
            'name'      => 'system.accounts.view',
            'group'     => 'System User Management',
            'scope'     => 'system',
            'is_locked' => false,
        ],
        [
            'name'      => 'system.accounts.manage',
            'group'     => 'System User Management',
            'scope'     => 'system',
            'is_locked' => false,
        ],

        // ─── SYSTEM ROLES & SECURITY ───────────────────────────────────────────
        [
            'name'      => 'system.roles.view',
            'group'     => 'System Security',
            'scope'     => 'system',
            'is_locked' => false,
        ],
        [
            'name'      => 'system.roles.manage',
            'group'     => 'System Security',
            'scope'     => 'system',
            'is_locked' => false,
        ],

        // ─── SYSTEM NOTIFICATIONS ──────────────────────────────────────────────
        [
            'name'      => 'system.notifications.manage',
            'group'     => 'System Communications',
            'scope'     => 'system',
            'is_locked' => false,
        ],

        // ─── WORKSPACE & TENANT LEVEL (CLIENT SCOPE) ───────────────────────────
        [
            'name'      => 'client.dashboard.view',
            'group'     => 'Workspace',
            'scope'     => 'client',
            'is_locked' => false,
        ],
        [
            'name'      => 'client.accounts.view',
            'group'     => 'User Management',
            'scope'     => 'client',
            'is_locked' => false,
        ],
        [
            'name'      => 'client.accounts.manage',
            'group'     => 'User Management',
            'scope'     => 'client',
            'is_locked' => false,
        ],
        [
            'name'      => 'client.logs.view',
            'group'     => 'User Management',
            'scope'     => 'client',
            'is_locked' => false,
        ],
        [
            'name'      => 'client.roles.view',
            'group'     => 'Security',
            'scope'     => 'client',
            'is_locked' => false,
        ],
        [
            'name'      => 'client.roles.manage',
            'group'     => 'Security',
            'scope'     => 'client',
            'is_locked' => false,
        ],
        [
            'name'      => 'client.billing.view',
            'group'     => 'Billing',
            'scope'     => 'client',
            'is_locked' => false,
        ],
        [
            'name'      => 'client.billing.manage',
            'group'     => 'Billing',
            'scope'     => 'client',
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
        // SUPER_ADMIN
        [
            'name'        => 'ADMINISTRATOR',
            'scope'       => 'client',
            'is_locked'   => false,
            'permissions' => [
                'client.dashboard.view',
                'client.accounts.view',
                'client.accounts.manage',
                'client.roles.view',
                'client.roles.manage',
                'client.logs.view',
                'client.billing.view',
                'client.billing.manage',
            ],
        ],
        [
            'name'        => 'MANAGER',
            'scope'       => 'client',
            'is_locked'   => false,
            'permissions' => [
                'client.dashboard.view',
                'client.accounts.view',
                'client.logs.view',
                'client.billing.view',
            ],
        ],
        [
            'name'        => 'MEMBER',
            'scope'       => 'client',
            'is_locked'   => false,
            'permissions' => [
                'client.dashboard.view',
            ],
        ],
    ],
];