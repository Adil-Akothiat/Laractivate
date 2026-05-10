export type LoginPayloadType = {
    email: string;
    password: string;
};
export type RegisterPayloadType = {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    password_confirmation: string;
};

export type ResetPasswordPayloadType = {
    email: string;
    token: string;
    password: string;
    password_confirmation: string;
};