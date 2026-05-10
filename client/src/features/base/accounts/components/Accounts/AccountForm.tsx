import type { SetStateProps } from "../../../../../app/types";
import { getErrorsMessages } from "../../../../../app/utils";
import { Alert, Button, Input } from "../../../../../components";
import { FormControl } from "../../../../../components/FormControls";
import Switch from "../../../../../components/Switch";
import type { RoleProps } from "../../../rbac";

type FormProps = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    passwordConfirmation: string;
    rolesState: string[];
    isActive: boolean;
};

type Props = {
    handleSubmit: (e: React.SubmitEvent<HTMLFormElement>) => void;
    isPending: boolean;
    isError: boolean;
    error: any;
    form: FormProps;
    roles: RoleProps[];
    setForm: SetStateProps<FormProps>;
    onClose: () => void;
};

export default function AccountForm({
    form,
    isPending,
    isError,
    error,
    roles,
    setForm,
    handleSubmit,
    onClose,
}: Props) {
    const { rolesState, isActive } = form;
    type ValueProps = string | boolean | number | string[];
    const setFormValue = (key: keyof FormProps, value: ValueProps) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };
    return (
        <form onSubmit={handleSubmit} className="px-5 py-4 space-y-4">
            {isError &&
                getErrorsMessages(error).map((msg: string, i: number) => (
                    <Alert key={i} variant="error" message={msg} />
                ))}
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
                            field === "password" ||
                            field === "passwordConfirmation"
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
                                    : field === "password" ||
                                        field === "passwordConfirmation"
                                      ? "••••••••"
                                      : ""
                        }
                        value={form[field as keyof ValueProps]}
                        onChange={(e) =>
                            setFormValue(
                                field as keyof FormProps,
                                e.target.value,
                            )
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
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                >
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