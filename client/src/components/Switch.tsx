
type VariantProps = 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info' | 'neutral' | 'accent';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    variant?: VariantProps;
    className?: string;
}
export default function Switch({ 
    label,
    variant="success",
    className,
    ...props
 }: InputProps) {
    return (
        <div>
            <label className="label">
                <input 
                    type="checkbox"
                    className={`toggle toggle-${variant} ${className || ""}`}
                    {...props}
                />
                {label}
            </label>
        </div>
    );
}   