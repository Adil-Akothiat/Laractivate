import { useState, type FormEvent } from "react";
import {
  type AccountFormValues,
  type CreateAcccountProps,
  useAccountMutations,
  type UserCreatePayload,
} from "@/features/base/accounts";
import AccountForm from "./AccountForm";
import { LoadingOverlay, Modal } from "@/components";
import { useToastContext } from "@/app/hooks/common";
import { getErrorsMessages } from "@/app/utils";
import { useRoles } from "@/features/base/rbac";

const CreateAccount = ({ isOpen, onClose }: CreateAcccountProps) => {
  const { toast } = useToastContext();
  const { create } = useAccountMutations();
  const { data, isPending } = useRoles.getRoles({ all: true });
  const [form, setForm] = useState<AccountFormValues>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    passwordConfirmation: "",
    rolesState: [] as string[],
    isActive: true,
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const payload: UserCreatePayload = {
      first_name: form.firstName,
      last_name: form.lastName,
      email: form.email,
      password: form.password,
      password_confirmation: form.passwordConfirmation,
      is_active: form.isActive,
      rolesSet: form.rolesState,
    };

    create.mutate(payload, {
      onSuccess: (res) => {
        create.reset();
        onClose();
        toast.success(res?.data?.message || "");
      },
      onError: (err: any) => {
        toast.error(getErrorsMessages(err).join("|"));
      },
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create new user account">
      {isPending ? (
        <LoadingOverlay />
      ) : (
        <AccountForm
          form={form}
          roles={data.roles || []}
          handleSubmit={handleSubmit}
          setForm={setForm}
          isPending={create.isPending}
          onClose={onClose}
        />
      )}
    </Modal>
  );
};

export default CreateAccount;