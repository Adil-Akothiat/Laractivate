import { LoadingOverlay, Modal } from "@/components";
import { useRoles } from "@/features/rbac";
import {
  useAccountMutations,
  type AccountFormValues,
  type CreateAcccountProps,
  type UserCreatePayload,
} from "@/features/system/accounts";
import { useState, type FormEvent } from "react";
import AccountForm from "./AccountForm";

const CreateAccount = ({ isOpen, onClose }: CreateAcccountProps) => {
  const { create } = useAccountMutations();
  const { data, isPending } = useRoles({ all: true });
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
      onSuccess: () => {
        create.reset();
        onClose();
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
          roles={data?.data || []}
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