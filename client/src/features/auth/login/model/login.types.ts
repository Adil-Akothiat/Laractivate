export interface LoginTfaResponseSchema {
    next: string;
    challenge_token: string;
    id: string;
}

export interface LoginSuccessResponseSchema {
    redirect_path: string;
}

export type LoginResponseSchema = { tfa: LoginTfaResponseSchema } | LoginSuccessResponseSchema;

export interface LoginPayload {
    email: string;
    password: string;
};

export interface TfaLoginVerificationPayload {
    code: string;
    token: string;
}
export type TfaModeProps = 'otp' | 'recovery';