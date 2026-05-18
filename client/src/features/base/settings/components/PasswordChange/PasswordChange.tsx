import { useState } from 'react';
import { EyeOff } from 'lucide-react';
import { useSettingsMutations } from '../../hooks';
import { getErrorsMessagesStr } from '@/app/utils';
import { Button, Input } from '@/components';
import SettingsContainer from '../Shared/SettingsContainer';
import { useToastContext } from '@/app/hooks/common';

export default function ChangePassword() {
    const { changePassword }                          = useSettingsMutations();
    const { toast }                                   = useToastContext();
    const [currentPassword,      setCurrentPassword]  = useState('');
    const [password,             setPassword]          = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        changePassword.mutate(
            { current_password: currentPassword, password, password_confirmation: passwordConfirmation },
            {
                onSuccess: () => {
                    toast.success('Password changed successfully! Please login again!');
                    changePassword.reset();
                },
                onError: (err: any) => toast.error(getErrorsMessagesStr(err)),
            },
        );
    };

    return (
        <SettingsContainer settingsType="password">
            <form onSubmit={handleSubmit} className="space-y-5">
                <Input type="password" label="Current Password" placeholder="Current Password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} disabled={changePassword.isPending} rightIcon={<EyeOff size={15} />} required />
                <div className="grid md:grid-cols-2 gap-y-2 gap-x-6">
                    <Input type="password" label="New Password" placeholder="New Password" value={password} onChange={(e) => setPassword(e.target.value)} disabled={changePassword.isPending} rightIcon={<EyeOff size={15} />} required />
                    <Input type="password" label="Confirm Password" placeholder="Confirm Password" value={passwordConfirmation} onChange={(e) => setPasswordConfirmation(e.target.value)} disabled={changePassword.isPending} rightIcon={<EyeOff size={15} />} required />
                </div>
                <Button type="submit" variant="primary" loading={changePassword.isPending} loadingText="Changing...">
                    Change
                </Button>
            </form>
        </SettingsContainer>
    );
}
