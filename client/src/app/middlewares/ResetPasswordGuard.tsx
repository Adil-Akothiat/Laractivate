import { useSearchParams, useNavigate, Outlet } from "react-router-dom";
import { useEffect } from "react";
import { GlobalPageLoader } from "@/components/Loaders/Loaders";
import { useToastContext } from "../hooks/common";
import { useValidateResetToken } from "../hooks";

export function ResetPasswordGuard() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { toast } = useToastContext();

    // 1. Grab params from URL
    const email:string|null = searchParams.get("email");
    const token:string|null = searchParams.get("token");

    // 2. Use the TanStack Query hook
    const { isPending, isError, isSuccess } = useValidateResetToken(email, token);

    useEffect(() => {
        // If parameters are missing entirely, send to login
        if (!email || !token) {
            navigate("/login");
            return;
        }

        // If the API returns an error (403/Expired), kick them out
        if (isError) {
            toast.error("This reset link is invalid or has expired.");
            navigate("/forgot-password", { replace: true });
        }
    }, [isError, email, token, navigate]);

    // 3. Handle UI States
    if (isPending) return <GlobalPageLoader isLoading={isPending} message="Verifying secure link..." />
    // 4. Only render the content if the token is verified
    return isSuccess ? <Outlet /> : null;
}