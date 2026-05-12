import { useState, type FormEvent } from 'react';
import { type CreateUserPayload, useAccounts } from '@/features/base/accounts';
import AccountForm from './AccountForm';
import type { RoleProps } from '@/features/base/rbac';
import { Modal } from '@/components';

interface Props {
  isOpen: boolean;
  roles: RoleProps[];
  onClose: () => void;
}

const CreateAccount = ({ isOpen, roles, onClose }: Props) => {
  const { mutate, isPending, isError, error, reset } = useAccounts.create();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    passwordConfirmation: '',
    rolesState: [] as string[],
    isActive: true,
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const payload: CreateUserPayload = {
      first_name:            form.firstName,
      last_name:             form.lastName,
      email:                 form.email,
      password:              form.password,
      password_confirmation: form.passwordConfirmation,
      is_active:             form.isActive,
      roles:                form.rolesState,
    };

    mutate(payload, {
      onSuccess: () => {
        reset();
        onClose();
      },
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create new user account"
    >
      <AccountForm
        form={form}
        roles={roles}
        handleSubmit={handleSubmit}
        setForm={setForm}
        isPending={isPending}
        isError={isError}
        error={error}
        onClose={onClose}
      />
    </Modal>
  );
};

export default CreateAccount;