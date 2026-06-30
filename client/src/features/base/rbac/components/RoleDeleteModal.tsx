import { useRef, useEffect } from "react";
import { useRoleMutations } from "../hooks";
import { getErrorsMessagesStr } from "@/app/utils";
import { Button } from "@/components";
import type { RoleSchema } from "../../shared";

interface Props {
    role:      RoleSchema;
    onSuccess: () => void;
    onCancel:  () => void;
}

export function RoleDeleteModal({ role, onSuccess, onCancel }: Props) {
    const { remove }    = useRoleMutations();
    const cancelRef     = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        cancelRef.current?.focus();
    }, []);

    const handleDelete = () => {
        remove.mutate(role.id, {
            onSuccess: () => onSuccess(),
        });
    };

    return (
        <div className="space-y-4">
            <p className="text-base-content/80">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-base-content">"{role.name}"</span>?
                This action cannot be undone.
            </p>

            {(role.users_count ?? 0) > 0 && (
                <div className="alert alert-warning text-sm py-2">
                    <span>
                        This role is assigned to {role.users_count} user
                        {role.users_count !== 1 ? "s" : ""}. Remove those assignments first.
                    </span>
                </div>
            )}

            {remove.error && (
                <div className="alert alert-error text-sm py-2">
                    <span>{getErrorsMessagesStr(remove.error)}</span>
                </div>
            )}

            <div className="flex justify-end gap-3">
                <button
                    ref={cancelRef}
                    className="btn btn-ghost"
                    onClick={onCancel}
                    disabled={remove.isPending}
                >
                    Cancel
                </button>
                <Button
                    variant="error"
                    onClick={handleDelete}
                    loading={remove.isPending}
                >
                    Delete
                </Button>
            </div>
        </div>
    );
}
