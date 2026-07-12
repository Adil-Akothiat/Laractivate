import { useState } from "react";
import { Badge, Card } from "@/components"; // Assuming this handles padding/layout basics
import { useAccountMutations } from "@/features/base/accounts";
import type { UserSchema } from "@/features/base/shared";
import Disable2FA from "@/features/base/shared/components/2FA/Disable2FA";

interface Props {
  user: UserSchema;
}

export default function AccountTwoFactorCard({ user }: Props) {
  const [open, setOpen] = useState(false);
  const { tfa } = useAccountMutations();
  const isEnabled = user?.two_factor_enabled;

  const disableHandler = (password: string) => {
    tfa.disable.mutate(
      { id: user.id, data: { password } },
      {
        onSuccess: () => {
          setOpen(false);
        },
      },
    );
  };

  return (
    <Card>
      {/* Header with Status Badge */}
      <div className="flex items-center justify-between border-b pb-4 mb-4">
        <div>
          <h3 className="text-lg font-medium text-gray-900">
            Two-Factor Authentication (2FA)
          </h3>
          <p className="text-sm text-gray-500">
            Manage security settings for this user account.
          </p>
        </div>
        <div>
          {isEnabled ? (
            <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
              Active / Enabled
            </span>
          ) : (
            <Badge variant="warning" outline>
              Disabled
            </Badge>
          )}
        </div>
      </div>

      {/* Conditional Content */}
      {isEnabled ? (
        <div className="space-y-4">
          {/* Security Notice about Recovery Codes */}
          <div className="rounded-md bg-blue-50 p-4">
            <div className="flex">
              <div className="ml-3">
                <h4 className="text-sm font-medium text-blue-800">
                  Admin Security Protocol
                </h4>
                <div className="mt-2 text-sm text-blue-700">
                  <p>
                    For privacy and compliance reasons, personal backup keys and
                    recovery codes are encrypted and hidden from administrative
                    views.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Zone description */}
          <div className="pt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="max-w-xl text-sm text-gray-500">
              <p>
                If this user is completely locked out of their device and lacks
                their recovery codes, you can force-disable their authentication
                configuration. This will return their account to simple password
                authorization.
              </p>
            </div>
            <div className="flex-shrink-0">
              <Disable2FA
                disableApi={disableHandler}
                isPending={tfa.disable.isPending}
                open={open}
                setOpen={setOpen}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="text-sm text-gray-500 py-2">
          <p>
            This user has not enabled two-factor authorization yet. Multi-factor
            enrollment must be triggered directly by the user from their account
            settings panel. Admins cannot configure setup steps on behalf of
            users.
          </p>
        </div>
      )}
    </Card>
  );
}