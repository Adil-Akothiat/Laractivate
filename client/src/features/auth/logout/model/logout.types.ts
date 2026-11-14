import { Dispatch, SetStateAction } from "react";

export interface LogoutModalProps {
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>
}