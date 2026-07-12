import type { ReactNode } from "react";
import Container from "./Container";

type Props = {
    children: ReactNode;
    childrenClassName?: string;
};

export const ScrollContainer = ({
    children,
    childrenClassName = "",
}: Props) => {
    return (
        <div
            className="w-full overflow-y-auto h-[calc(100vh-4rem)] scrolltype-1"
        >
            <Container className={childrenClassName}>
                {children}
            </Container>
        </div>
    );
};