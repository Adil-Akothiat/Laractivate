export type LoginPayload = {
    email: string;
    password: string;
};
export type RegisterPayload = {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    password_confirmation: string;
};

export type ResetPasswordPayload = {
    email: string;
    token: string;
    password: string;
    password_confirmation: string;
};