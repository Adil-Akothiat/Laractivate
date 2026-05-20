import { Key, ShieldBan } from "lucide-react";
import { useState } from "react";
import { Alert, Button, Input, Modal } from "@/components";
import type { SetStateProps } from "@/app/types";

export interface Disable2FAProps {
  disableApi: (password: string) => void;
  isPending: boolean;
  open:boolean;
  setOpen: SetStateProps<boolean>
}

export default function Disable2FA({
  disableApi,
  isPending,
  open,
  setOpen
}: Disable2FAProps) {
  const [password, setPassword] = useState("");
  const handleClose = () => {
    setOpen(false);
    setPassword("");
  };
  return (
    <>
      <Button
        variant="error"
        outline
        loading={isPending}
        leftIcon={<ShieldBan size={16} />}
        onClick={() => setOpen(true)}
      >
        Disable 2FA
      </Button>
      <Modal
        isOpen={open}
        onClose={handleClose}
        title="Disable 2FA"
        size="sm"
        onConfirm={() => disableApi(password)}
        confirmText={isPending ? "Disabling..." : "Disable"}
        cancelText="Cancel"
        isConfirming={isPending}
      >
        <div className="flex flex-col gap-4">
          <Alert
            variant="warning"
            message="Disabling 2FA will make this account less secure. The user will only need a password to log in."
          />
          <Input
            label="Confirm your password to proceed"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            leftIcon={<Key size={14} />}
            placeholder="Enter your password"
          />
        </div>
      </Modal>
    </>
  );
}