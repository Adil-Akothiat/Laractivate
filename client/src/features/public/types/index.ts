export interface TwoFactorAuthResponseSchema {
    next: string;
    challenge_token: string;
    id: string;
}

export interface LoginSuccessResponseSchema {
    redirect_path: string;
}


export type LoginResponseSchema = { tfa:TwoFactorAuthResponseSchema } | LoginSuccessResponseSchema;

export interface LoginPayload {
    email: string;
    password: string;
};
export interface RegisterPayload {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    password_confirmation: string;
};

export interface ResetPasswordPayload {
    email: string;
    token: string;
    password: string;
    password_confirmation: string;
};