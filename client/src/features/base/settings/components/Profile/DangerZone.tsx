import { useNavigate } from 'react-router-dom';
import { useSettingsMutations } from '../../hooks';
import { useState } from 'react';
import { getErrorsMessagesStr } from '@/app/utils';
import { Trash2 } from 'lucide-react';
import { Alert, Button, Input, Modal } from '@/components';

type Props = {
    roles?: string[];
};

export default function DangerZone({ roles }: Props) {
    const isSuperAdmin = roles?.includes('SUPER_ADMIN');
    const navigate     = useNavigate();
    const { deactivateAccount, deleteAccount } = useSettingsMutations();

    const [modal,    setModal]    = useState<'deactivate' | 'delete' | null>(null);
    const [password, setPassword] = useState('');
    const [apiError, setApiError] = useState<string | null>(null);

    const closeModal = () => {
        setModal(null);
        setPassword('');
        setApiError(null);
    };

    const handleConfirm = () => {
        setApiError(null);
        const payload = { password };
        if (modal === 'deactivate') {
            deactivateAccount.mutate(payload, {
                onSuccess: () => navigate('/login'),
                onError:   (err: any) => setApiError(getErrorsMessagesStr(err)),
            });
        } else {
            deleteAccount.mutate(payload, {
                onSuccess: () => navigate('/login'),
                onError:   (err: any) => setApiError(getErrorsMessagesStr(err)),
            });
        }
    };

    const isPending = deactivateAccount.isPending || deleteAccount.isPending;

    return (
        <>
            <Modal isOpen={modal === 'deactivate'} title="Deactivate Account" onClose={closeModal} onConfirm={handleConfirm} confirmText="Deactivate" cancelText="Cancel" isConfirming={isPending}>
                <p className="text-sm text-base-content/70 mb-3">
                    Your account will be deactivated. You can contact support to reactivate it.
                </p>
                {apiError && <Alert variant="error" message={apiError} />}
                <Input type="password" label="Confirm your password" className="w-full" value={password} onChange={(e) => setPassword(e.target.value)} disabled={isPending} required />
            </Modal>

            <Modal isOpen={modal === 'delete'} title="Delete Account Permanently" onClose={closeModal} onConfirm={handleConfirm} confirmText="Delete Forever" cancelText="Cancel" isConfirming={isPending}>
                <p className="text-sm text-base-content/70 mb-3">
                    This action is <strong>irreversible</strong>. All your data will be permanently erased.
                </p>
                {apiError && <Alert variant="error" message={apiError} />}
                <Input type="password" label="Confirm your password" className="w-full" value={password} onChange={(e) => setPassword(e.target.value)} disabled={isPending} required />
            </Modal>

            <div className="flex flex-wrap justify-between border-t border-gray-300 py-4 gap-3">
                <div className="md:w-6/12">
                    <h3 className="font-bold">Delete Account</h3>
                    <p className={`${isSuperAdmin ? 'text-warning' : 'text-gray-700'} text-sm`}>
                        {isSuperAdmin
                            ? 'Since you are a Super Admin, you cannot delete your account. Please contact another Super Admin for assistance.'
                            : 'When you delete your account you lose access to Front account services, and we permanently delete your personal data.'}
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                    <Button variant="error" outline onClick={() => isSuperAdmin ? null : setModal('delete')} disabled={!!isSuperAdmin}>
                        <Trash2 size={14} /> Delete Account
                    </Button>
                </div>
            </div>
        </>
    );
}
