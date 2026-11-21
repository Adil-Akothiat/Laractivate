export const API_ROUTES = {
    auth: {
        base: '/auth',
        login: '/auth/login',
        register: '/auth/register',
        forgotPassword: '/auth/forgot-password',
        resetPassword: '/auth/reset-password',
        validateResetToken: '/auth/reset-password/validate-token',
        refreshToken: '/auth/refresh-token',
        verifyTfa: '/auth/two-factor/verify',
        logout: "/auth/logout"
    },
    user: {
        base: '/user',
        profile: {
            base: '/user/profile',
            updateAvatar: "/user/profile/update-avatar"
        },
        security: {
            base: '/user/security',
            sessions: '/user/security/sessions',
            sessionById: (id: number) => `/user/security/sessions/${id}`,
            clearHistory: '/user/security/sessions/clear-history',
            changePassword: '/user/security/password',
            deactivateUser: '/user/security/deactivate',
            twoFactor: {
                base: "/user/security/two-factor",
                init: "/user/security/two-factor/init",
                enable: "/user/security/two-factor/enable",
                disable: "/user/security/two-factor/disable",
                regenerateRecoveryCodes: "user/security/two-factor/regenerate-codes",

            }
        },
    },
    workspace: {
        base: '/workspace',
        roles: {
            getRoles: '/workspace/roles',
            getRole: (id: string) => `/workspace/roles/${id}`,
            createRole: '/workspace/roles',
            updateRole: (id: string) => `/workspace/roles/${id}`,
            removeRole: (id: string) => `/workspace/roles/${id}`,
        },
        permissions: {
            getPermissions: '/workspace/permissions'
        }
    }
} as const;
