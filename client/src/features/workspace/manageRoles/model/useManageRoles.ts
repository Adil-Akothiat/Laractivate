import { useCallback, useState } from "react";

export function useManageRoles() {
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [attachedPermissions, setAttachedPermissions] = useState<string[]>([]);
    const [name, setName] = useState<string>("");

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
        resetForm
    }

}