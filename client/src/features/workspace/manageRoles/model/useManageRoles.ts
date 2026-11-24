import { RoleSchema } from "@/entities";
import { useCallback, useState } from "react";

export function useManageRoles() {
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [attachedPermissions, setAttachedPermissions] = useState<string[]>([]);
    const [name, setName] = useState<string>("");
    const [role, setRole] = useState<RoleSchema | null>(null);
    const [confirmModalOpen, setConfirmModalOpen] = useState<boolean>(false);

    const onAttachHandler = useCallback((id: string) => {
        setAttachedPermissions(prev => {
            if (prev.includes(id)) return prev.filter(item => item !== id)
            return [...prev, id]
        });
    }, [])
    const onAttachAllHandler = useCallback((permissionIds: string[]) => {
        setAttachedPermissions(prev => {
            if (prev.length === permissionIds.length) return [];
            return permissionIds;
        })
    }, [])

    const resetForm = () => {
        setModalOpen(false);
        setAttachedPermissions([]);
        setName("");
        setRole(null);
    }

    return {
        modalOpen,
        setModalOpen,
        attachedPermissions,
        setAttachedPermissions,
        onAttachHandler,
        onAttachAllHandler,
        name,
        setName,
        resetForm,
        role,
        setRole,
        confirmModalOpen,
        setConfirmModalOpen
    }

}