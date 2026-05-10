type Props = {
    className?: string;
    children?: React.ReactNode;
}
export default function Container({ className, children }: Props) {
    return (
        <div className={"flex flex-col gap-4 p-6 pb-20 " + className}>
            {children}
        </div>
    );
}