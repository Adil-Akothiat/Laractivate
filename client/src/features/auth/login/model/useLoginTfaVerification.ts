import { useToastContext } from "@/app/hooks";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLoginTfaVerifyMutation } from "../api";
import { TfaModeProps } from "./login.types";

export function useLoginTfaVerification(token: string) {
    const [mode, setMode] = useState<TfaModeProps>('otp');
    const [otp, setOtp] = useState('');
    const [recoveryCode, setRecoveryCode] = useState('');
    const { toast } = useToastContext();
    const navigate = useNavigate();

    // Wire up your features/base/auth mutation hook
    const verifyTfaMutation = useLoginTfaVerifyMutation();
    const { mutate, reset } = verifyTfaMutation;

    const switchMode = (next: TfaModeProps) => {
        reset(); // Clear query state metadata on toggle
        setOtp('');
        setRecoveryCode('');
        setMode(next);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        reset();

        // 1. Determine payload parsing strategy based on active tab view
        const targetCode = mode === 'otp'
            ? otp.replace(/\D/g, '').trim()
            : recoveryCode.trim();

        if (!targetCode) return;

        // 2. Fire mutation targeting your structured authCoreApi header middleware signature
        mutate(
            {
                code: targetCode,
                token: token // This token will map cleanly to the HTTP Bearer Authorization header
            },
            {
                onSuccess: (res) => {
                    toast.success('Successfully authenticated!');
                    navigate(res?.data.data.redirect_path);
                },
                onError: (err: any) => {
                    // Pulls backend error validation payload or defaults to global message
                    const failureMessage = err?.response?.data?.message || 'Invalid verification code. Please try again.';
                    toast.error(failureMessage);
                }
            }
        );
    };

    const canSubmit =
        mode === 'otp'
            ? otp.replace(/\D/g, '').length === 6
            : recoveryCode.trim().length > 0;
    return {
        mode,
        setMode,
        otp,
        setOtp,
        recoveryCode,
        setRecoveryCode,
        verifyTfaMutation,
        switchMode,
        handleSubmit,
        canSubmit
    }
}