import { Button } from "@/components";
import { ShieldCheck } from "lucide-react";

export type Enable2FAProps = {
  tfaInitApi: () => void;
  isPending: boolean;
};
export default function Enable2FA({ tfaInitApi, isPending }: Enable2FAProps) {
  return (
    <Button
      variant="primary"
      outline
      loading={isPending}
      loadingText="Initializing..."
      leftIcon={<ShieldCheck size={16} />}
      onClick={tfaInitApi}
    >
      Enable 2FA
    </Button>
  );
}