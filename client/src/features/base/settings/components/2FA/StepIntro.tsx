import { Badge } from "@/components";
import Disable2FA, { type Disable2FAProps } from "../../../shared/components/2FA/Disable2FA";
import type { TFRCProps } from "../../../shared/components/2FA/TwoFactorRecoveryCodes";
import Enable2FA, { type Enable2FAProps } from "../../../shared/components/2FA/Enable2FA";
import TwoFactorRecoveryCodes from "../../../shared/components/2FA/TwoFactorRecoveryCodes";

interface Props {
  disable2fa: Disable2FAProps;
  enable2fa: Enable2FAProps;
  tfaRecoveryCodes: TFRCProps;
  isEnabled: boolean;
}

const StepIntro = ({ disable2fa, enable2fa, isEnabled, tfaRecoveryCodes }: Props) => {
  return (
    <div className="space-y-4">
      <Badge variant={isEnabled ? "success" : "error"} outline={true} size="lg">
        {isEnabled ? "Enabled" : "Disabled"}
      </Badge>
      
      <div>
        {isEnabled ? (
          <Disable2FA 
            disableApi={disable2fa.disableApi}
            isPending={disable2fa.isPending}
            open={disable2fa.open}
            setOpen={disable2fa.setOpen}
          />
        ) : (
          <Enable2FA 
            tfaInitApi={enable2fa.tfaInitApi}
            isPending={enable2fa.isPending}
          />
        )}
      </div>

      {isEnabled && tfaRecoveryCodes.recoveryCodes.length > 0 && (
        <TwoFactorRecoveryCodes 
          recoveryCodes={tfaRecoveryCodes.recoveryCodes}
          isPending={tfaRecoveryCodes.isPending}
          regenerate={tfaRecoveryCodes.regenerate}
        />
      )}
    </div>
  );
};

export default StepIntro;