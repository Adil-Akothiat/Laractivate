import { useState } from 'react';
import { ShieldCheck, X, KeyRound, Smartphone } from 'lucide-react';
import { Button, Input } from '@/components';
import { useToastContext } from '@/app/hooks/common'; // Adjust path based on feature structure
import { useAuthMutations } from '../hooks';
import OtpInput from '../../shared/components/2FA/OtpInput';

interface Props {
    userId: string | null;
    token: string;
    onSuccess: () => void;
    onCancel: () => void;
}

type Mode = 'otp' | 'recovery';

const TwoFactorDialog = ({ userId, onSuccess, onCancel, token }: Props) => {
    const [mode, setMode] = useState<Mode>('otp');
    const [otp, setOtp] = useState('');
    const [recoveryCode, setRecoveryCode] = useState('');
    const { toast } = useToastContext();
    
    // Wire up your features/base/auth mutation hook
    const { twoFactor } = useAuthMutations();
    const { mutate, isPending, reset } = twoFactor.verify;

    const switchMode = (next: Mode) => {
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
                onSuccess: () => {
                    toast.success('Successfully authenticated!');
                    onSuccess();
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

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-base-100 rounded-2xl shadow-xl w-full max-w-sm mx-4 overflow-hidden border border-base-300">

                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-base-300">
                    <div className="flex items-center gap-2">
                        <ShieldCheck size={16} className="text-primary" />
                        <h3 className="font-semibold text-base-content text-sm">
                            Two-Factor Verification
                        </h3>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        circle
                        leftIcon={<X size={16} />}
                        onClick={onCancel}
                        disabled={isPending}
                    />
                </div>

                {/* Mode tabs */}
                <div className="flex border-b border-base-300 bg-base-200/50">
                    <button
                        type="button"
                        disabled={isPending}
                        onClick={() => switchMode('otp')}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-medium transition-colors disabled:opacity-50
                            ${mode === 'otp'
                                ? 'text-primary border-b-2 border-primary bg-base-100'
                                : 'text-base-content/50 hover:text-base-content'
                            }`}
                    >
                        <Smartphone size={13} />
                        Authenticator App
                    </button>
                    <button
                        type="button"
                        disabled={isPending}
                        onClick={() => switchMode('recovery')}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-medium transition-colors disabled:opacity-50
                            ${mode === 'recovery'
                                ? 'text-primary border-b-2 border-primary bg-base-100'
                                : 'text-base-content/50 hover:text-base-content'
                            }`}
                    >
                        <KeyRound size={13} />
                        Recovery Code
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="px-5 py-6 flex flex-col items-center gap-5">
                    {mode === 'otp' ? (
                        <>
                            <p className="text-xs text-base-content/60 text-center leading-relaxed">
                                Enter the 6-digit code from your authenticator app to complete sign in.
                            </p>
                            {/* Make sure OtpInput properly accepts and utilizes the disabled prop internally */}
                            <OtpInput value={otp} onChange={setOtp} disabled={isPending} />
                        </>
                    ) : (
                        <>
                            <p className="text-xs text-base-content/60 text-center leading-relaxed">
                                Enter one of your saved recovery codes. Each code can only be used once.
                            </p>
                            <Input
                                value={recoveryCode}
                                onChange={(e) => setRecoveryCode(e.target.value)}
                                disabled={isPending}
                                placeholder="e.g. ku2HNXTRjD-Dt6Usz29DE"
                                leftIcon={<KeyRound size={14} />}
                                autoComplete="off"
                                spellCheck={false}
                                className="font-mono tracking-wider text-xs"
                            />
                        </>
                    )}
                    
                    <Button
                        type="submit"
                        variant="primary"
                        block
                        loading={isPending}
                        loadingText="Verifying..."
                        disabled={!canSubmit || isPending}
                    >
                        Verify & Sign In
                    </Button>

                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        block
                        onClick={onCancel}
                        disabled={isPending}
                    >
                        Cancel — Back to Login
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default TwoFactorDialog;