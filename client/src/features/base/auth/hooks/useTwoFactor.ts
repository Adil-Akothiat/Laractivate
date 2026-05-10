import { useMutation } from "@tanstack/react-query";
import {
    initTwoFactor,
    enableTwoFactor,
    verifyTwoFactor,
    disableTwoFactor,
} from "../api";

export const useTwoFactor = {
    init: ()=> useMutation({
        mutationFn: () => initTwoFactor(),
    }),
    enable: ()=> useMutation({
        mutationFn: (data: { otp: string }) => enableTwoFactor(data),
    }),
    disable: ()=> useMutation({
        mutationFn: (data: { password: string }) => disableTwoFactor(data),
    }),
    verify: ()=> useMutation({
        mutationFn: (data: { otp: string; user_id: string | null }) =>
        verifyTwoFactor(data),
    }),
};