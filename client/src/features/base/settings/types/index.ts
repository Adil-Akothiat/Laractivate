export interface UpdateProfilePayload {
  first_name: string;
  last_name: string;
}

export interface ChangePasswordPayload {
  current_password: string;
  password: string;
  password_confirmation: string;
}

export interface AccountActionPayload {
  password: string;
}
// ─── Event Config ─────────────────────────────────────────────────────────────

export interface EventConfigProps {
    icon: React.ReactNode;
    label: string;
    iconBg: string;
    iconColor: string;
    badge: string;
};