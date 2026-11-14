import { getErrorsMessagesStr } from '@/app/utils';
import { Alert, Input, Modal } from '@/components';
import { useState } from 'react';
import { useDeactivateUser } from '../api';

export default function DeactivateUser() {
    const [modal, setModal] = useState<boolean>(false);
    const [password, setPassword] = useState<string>('');
    const { mutate, isPending, isError, error } = useDeactivateUser();

    const closeModal = () => {
        setModal(false);
        setPassword('');
    };

    const handleConfirm = () => {
        const payload = { password };
        mutate(payload);
    };

    return (
        <>
            <Modal isOpen={modal} title="Deactivate Account" onClose={closeModal} onConfirm={handleConfirm} confirmText="Deactivate" cancelText="Cancel" isConfirming={isPending}>
                <p className="text-sm text-base-content/70 mb-3">
                    Your account will be deactivated. You can contact support to reactivate it.
                </p>
                {isError && <Alert variant="error" message={getErrorsMessagesStr(error)} />}
                <Input type="password" label="Confirm your password" className="w-full" value={password} onChange={(e) => setPassword(e.target.value)} disabled={isPending} required />
            </Modal>
        </>
    );
}
