// --- Payloads ---
export type UpdateProfilePayload = {
  first_name: string;
  last_name:  string;
};

export type ChangePasswordPayload = {
  current_password:      string;
  password:              string;
  password_confirmation: string;
};

export type AccountActionPayload = {
  password: string;
};
