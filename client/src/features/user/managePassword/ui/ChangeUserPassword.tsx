import { useToastContext } from '@/app/hooks';
import { getErrorsMessagesStr } from '@/app/utils';
import { Button, Input } from '@/components';
import { EyeOff } from 'lucide-react';
import { useState } from 'react';
import { useChangePassword } from '../api/changePassword.api';

export default function ChangeUserPassword() {
    const { toast } = useToastContext();
    const { mutate, reset, isPending } = useChangePassword();
    const [currentPassword, setCurrentPassword] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [passwordConfirmation, setPasswordConfirmation] = useState<string>('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mutate(
            { current_password: currentPassword, password, password_confirmation: passwordConfirmation },
            {
                onSuccess: () => {
                    toast.success('Password changed successfully! Please login again!');
                    reset();
                },
                onError: (err: any) => toast.error(getErrorsMessagesStr(err)),
            },
        );
    };
    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <Input
                type="password"
                label="Current Password"
                placeholder="Current Password"
                value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)}
                disabled={isPending}
                rightIcon={<EyeOff size={15} />}
                required
            />
            <div className="grid md:grid-cols-2 gap-y-2 gap-x-6">
                <Input
                    type="password"
                    label="New Password"
                    placeholder="New Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isPending}
                    rightIcon={<EyeOff size={15} />}
                    required
                />
                <Input
                    type="password"
                    label="Confirm Password"
                    placeholder="Confirm Password"
                    value={passwordConfirmation}
                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                    disabled={isPending}
                    rightIcon={<EyeOff size={15} />}
                    required
                />
            </div>
            <Button
                type="submit"
                variant="primary"
                loading={isPending}
                loadingText="Changing..."
            >
                Change
            </Button>
        </form>
    );
}
