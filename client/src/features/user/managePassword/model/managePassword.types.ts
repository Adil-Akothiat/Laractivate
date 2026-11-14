export type ChangePasswordPayload = {
    current_password: string;
    password: string;
    password_confirmation: string;
};