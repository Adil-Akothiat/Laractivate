import { useMutation } from "@tanstack/react-query";
import { forgotPassword, login, logout, register, resetPassword } from "../api";
import type {
    LoginPayloadType,
    RegisterPayloadType,
    ResetPasswordPayloadType,
} from "../types";

export const useAuth = {
    login: ()=> useMutation({
        mutationFn: ({ email, password }: LoginPayloadType) =>
            login(email, password),
    }),
    register: ()=> useMutation({
        mutationFn: ({
            first_name,
            last_name,
            email,
            password,
            password_confirmation,
        }: RegisterPayloadType) =>
            register({ first_name, last_name, email, password, password_confirmation }),
    }),
    forgotPassword: ()=> useMutation({
        mutationFn: (email: string) => forgotPassword(email),
    }),
    resetPassword: ()=> useMutation({
        mutationFn: ({
            email,
            token,
            password,
            password_confirmation,
        }: ResetPasswordPayloadType) =>
            resetPassword({ email, token, password, password_confirmation }),
    }),
    logout: ()=> useMutation({
        mutationFn: () => logout(),
    }),
};