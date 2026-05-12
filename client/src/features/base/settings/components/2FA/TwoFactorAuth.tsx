import { useState, useEffect } from "react";
import StepIntro from "./StepIntro";
import StepScan from "./StepScan";
import StepVerify from "./StepVerify";
import StepSuccess from "./StepSuccess";
import { FingerprintPattern } from "lucide-react";
import { useMe } from "@/app/middlewares/hooks/useMe";
import { useTwoFactor } from "@/features/base/auth/hooks/useTwoFactor";
import { ComponentLoader } from "@/components/Loaders";
import { Modal } from "@/components";

type Step = "intro" | "scan" | "verify" | "success";

export default function TwoFactorAuth() {
    const { data: info, isPending } = useMe();

    const [step, setStep] = useState<Step>("intro");
    const [qrUrl, setQrUrl] = useState("");
    const [isInvalid, setIsInvalid] = useState(false);
    const [open, setOpen] = useState<boolean>(false);

    // If 2FA is already enabled, jump straight to success screen
    useEffect(() => {
        if (info?.user?.two_factor_enabled) {
            setStep("success");
        }
    }, [info?.user?.two_factor_enabled]);

    const { mutate: init, isPending: isIniting } = useTwoFactor.init();

    const {
        mutate: enable,
        isPending: isEnabling,
        isError: isEnableError,
        error: enableError,
        reset: resetEnable,
    } = useTwoFactor.enable();

    // Step 1 → generate secret & get QR
    const handleInit = () => {
        init(undefined, {
            onSuccess: (res) => {
                setQrUrl(res.data.qrCodeUrl);
                setStep("scan");
                setOpen(true);
            },
        });
    };

    // Step 3 → verify OTP and enable 2FA
    const handleEnable = (otp: string) => {
        const sanitized = otp.replace(/\D/g, "").trim();
        if (sanitized.length !== 6) return;
        resetEnable();
        setIsInvalid(false);
        enable(
            { otp: sanitized },
            {
                onSuccess: (res) => {
                    if (res.data.enabled) {
                        setStep("success");
                    } else {
                        setIsInvalid(true);
                    }
                },
            },
        );
    };
    if (isPending) return <ComponentLoader isLoading={isPending} />;

    return (
        <div className="py-6 px-3  space-y-6">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                <FingerprintPattern size={18} className="text-primary" />
            </div>
            <div className="mb-6">
                <h1 className="font-bold text-base-content">
                    Two-Factor Authentication
                </h1>
                <p className="text-sm text-base-content/50 mt-0.5">
                    Secure your account with an authenticator app.
                </p>
            </div>
            <StepIntro
                onEnable={handleInit}
                onDisable={() => setStep("intro")}
                isPending={isIniting}
                step={step}
            />
            <Modal isOpen={open} onClose={() => setOpen(false)}>
                {/* Step indicator */}
                {(step === "scan" || step === "verify") && (
                    <ul className="steps steps-horizontal w-full mb-8 text-xs">
                        <li className="step step-primary">Scan QR</li>
                        <li
                            className={`step ${step === "verify" ? "step-primary" : ""}`}
                        >
                            Verify
                        </li>
                    </ul>
                )}
                {step === "scan" && (
                    <StepScan qrUrl={qrUrl} onNext={() => setStep("verify")} />
                )}
                {step === "verify" && (
                    <StepVerify
                        onVerify={handleEnable}
                        isPending={isEnabling}
                        isError={isEnableError}
                        isInvalid={isInvalid}
                        error={enableError}
                        onBack={() => {
                            resetEnable();
                            setIsInvalid(false);
                            setStep("scan");
                        }}
                    />
                )}
                {step === "success" && (
                    <StepSuccess
                        closeHandler={() => setOpen(false)}
                    />
                )}
            </Modal>
        </div>
    );
}