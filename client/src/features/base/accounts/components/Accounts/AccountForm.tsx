import type { SetStateSchema } from "@/app/types";
import { Button, Input } from "@/components";
import { FormControl } from "@/components/FormControls";
import Switch from "@/components/Switch";
import type { RoleSchema } from "@/features/base/shared";
import type { AccountFormValues } from "../../types";

type Props = {
  handleSubmit: (e: React.SubmitEvent<HTMLFormElement>) => void;
  isPending: boolean;
  form: AccountFormValues;
  roles: RoleSchema[];
  setForm: SetStateSchema<AccountFormValues>;
  onClose: () => void;
};

export default function AccountForm({
  form,
  isPending,
  roles,
  setForm,
  handleSubmit,
  onClose,
}: Props) {
  const { rolesState, isActive } = form;
  type ValueProps = string | boolean | number | string[];
  const setFormValue = (key: keyof AccountFormValues, value: ValueProps) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };
  return (
    <form onSubmit={handleSubmit} className="px-5 py-4 space-y-4">
      {[
        "firstName",
        "lastName",
        "email",
        "password",
        "passwordConfirmation",
      ].map((field) => (
        <FormControl key={field}>
          <Input
            label={
              field === "firstName"
                ? "First name"
                : field === "lastName"
                  ? "Last name"
                  : field === "email"
                    ? "Email"
                    : field === "password"
                      ? "Password"
                      : "Confirm Password"
            }
            type={
              field === "password" || field === "passwordConfirmation"
                ? "password"
                : "text"
            }
            placeholder={
              field === "firstName"
                ? "John"
                : field === "lastName"
                  ? "Doe"
                  : field === "email"
                    ? "john@example.com"
                    : field === "password" || field === "passwordConfirmation"
                      ? "••••••••"
                      : ""
            }
            value={form[field as keyof ValueProps]}
            onChange={(e) =>
              setFormValue(field as keyof AccountFormValues, e.target.value)
            }
            disabled={isPending}
            required
          />
        </FormControl>
      ))}
      <FormControl>
        <label className="text-sm font-medium text-base-content/70 mb-1.5 block">
          Roles
        </label>
        <div className="flex flex-col gap-1.5 max-h-40 overflow-y-auto pr-1 rounded-lg border border-base-300 px-3 py-2">
          {roles.map((role) => (
            <label
              key={role.id}
              className="flex items-center gap-2.5 cursor-pointer py-1 hover:text-base-content transition-colors"
            >
              <input
                type="checkbox"
                className="checkbox checkbox-sm checkbox-primary"
                checked={rolesState.includes(role.id)}
                onChange={(e) => {
                  const next = e.target.checked
                    ? [...rolesState, role.id]
                    : rolesState.filter((id) => id !== role.id);
                  setFormValue("rolesState", next);
                }}
                disabled={isPending}
              />
              <span className="text-sm">{role.name}</span>
            </label>
          ))}
        </div>
      </FormControl>
      <FormControl>
        <Switch
          label="Active account"
          checked={isActive}
          onChange={(e) => setFormValue("isActive", e.target.checked)}
          disabled={isPending}
        />
      </FormControl>
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="ghost" size="sm" onClick={onClose}>
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          size="sm"
          disabled={isPending}
          loading={isPending}
        >
          Create User
        </Button>
      </div>
    </form>
  );
}