import { useState } from "react";
import StepIntro from "./StepIntro";
import StepScan from "./StepScan";
import StepVerify from "./StepVerify";
import StepSuccess from "./StepSuccess";
import { FingerprintPattern } from "lucide-react";
import { useMe } from "@/app/middlewares/hooks/useMe";
import { ComponentLoader } from "@/components/Loaders";
import { Modal } from "@/components";
import type { UserSchema } from "@/features/base/shared";
import { useTwoFactor } from "../../hooks";

// "idle" = modal closed; other values drive what renders inside the modal
type ModalStep = "idle" | "scan" | "verify" | "success";

export default function TwoFactorAuth() {
    const { data: info, isPending } = useMe();
    const user: UserSchema = info?.user;

    const [modalStep, setModalStep] = useState<ModalStep>("idle");
    const [qrUrl, setQrUrl] = useState("");
    const [isInvalid, setIsInvalid] = useState(false);

    // Codes captured fresh from the enable API response.
    // Only non-empty right after the user just enabled 2FA (shown in StepSuccess).
    // For already-enabled users, codes come from user.two_factor_recovery_codes via StepIntro.
    const [freshCodes, setFreshCodes] = useState<string[]>([]);

    const isEnabled = !!user?.two_factor_enabled;

    const { mutate: init, isPending: isIniting } = useTwoFactor.init();

    const {
        mutate: enable,
        isPending: isEnabling,
        isError: isEnableError,
        error: enableError,
        reset: resetEnable,
    } = useTwoFactor.enable();

    // Step 1 — generate secret & receive QR URL
    const handleInit = () => {
        init(undefined, {
            onSuccess: (res) => {
                setQrUrl(res.data.qrCodeUrl);
                setModalStep("scan");
            },
        });
    };

    // Step 3 — verify OTP and activate 2FA
    const handleEnable = (otp: string) => {
        const sanitized = otp.replace(/\D/g, "").trim();
        if (sanitized.length !== 6) return;
        resetEnable();
        setIsInvalid(false);
        enable(
            { otp: sanitized },
            {
                onSuccess: (res) => {
                    console.log(res);
                    if (res.data.success) {
                        // Grab codes directly from this response — user cache is still stale here
                        setFreshCodes(res.data.recovery_codes ?? []);
                        setModalStep("success");
                    }
                },
                onError: ()=> {
                    setIsInvalid(false);
                }
            }
        );
    };

    const handleCloseModal = () => {
        setModalStep("idle");
        setFreshCodes([]);
        resetEnable();
        setIsInvalid(false);
    };

    if (isPending) return <ComponentLoader isLoading={isPending} />;

    return (
        <div className="py-6 px-3 space-y-6">
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

            {/*
             * StepIntro is always visible.
             * When enabled it shows: status badge + Disable button + existing recovery codes.
             * When disabled it shows: status badge + Enable button.
             */}
            <StepIntro
                isEnabled={isEnabled}
                isPending={isIniting}
                recoveryCodes={user?.two_factor_recovery_codes ?? []}
                onEnable={handleInit}
            />

            {/* Modal: scan → verify → success (only during the enable flow) */}
            <Modal isOpen={modalStep !== "idle"} onClose={handleCloseModal}>
                {(modalStep === "scan" || modalStep === "verify") && (
                    <ul className="steps steps-horizontal w-full mb-8 text-xs">
                        <li className="step step-primary">Scan QR</li>
                        <li className={`step ${modalStep === "verify" ? "step-primary" : ""}`}>
                            Verify
                        </li>
                    </ul>
                )}

                {modalStep === "scan" && (
                    <StepScan qrUrl={qrUrl} onNext={() => setModalStep("verify")} />
                )}

                {modalStep === "verify" && (
                    <StepVerify
                        onVerify={handleEnable}
                        isPending={isEnabling}
                        isError={isEnableError}
                        isInvalid={isInvalid}
                        error={enableError}
                        onBack={() => {
                            resetEnable();
                            setIsInvalid(false);
                            setModalStep("scan");
                        }}
                    />
                )}

                {modalStep === "success" && (
                    <StepSuccess
                        recoveryCodes={freshCodes}
                        closeHandler={handleCloseModal}
                    />
                )}
            </Modal>
        </div>
    );
}
