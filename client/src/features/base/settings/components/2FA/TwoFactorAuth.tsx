import { FingerprintPattern } from "lucide-react";
import { useProfile } from "../../hooks";
import { ComponentLoader } from "@/components/Loaders/Loaders";
import TwoFactorStepper from "./TwoFactorStepper";
import { DataLoader } from "@/components/Loaders/DataLoader";

export default function TwoFactorAuth() {
  const query = useProfile();
  return (
    <DataLoader query={query}>
      {(data) => {
        return (
          <div className="py-6 px-3 space-y-6">
            {/* Icon Frame */}
            <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
              <FingerprintPattern size={18} className="text-primary" />
            </div>

            {/* Header Layout Section */}
            <div className="mb-6">
              <h1 className="font-bold text-base-content">
                Two-Factor Authentication
              </h1>
              <p className="text-sm text-base-content/50 mt-0.5">
                Secure your account with an authenticator app.
              </p>
            </div>

            {/* Core Stepper Mechanics */}
            <TwoFactorStepper user={data} />
          </div>
        );
      }}
    </DataLoader>
  );
}