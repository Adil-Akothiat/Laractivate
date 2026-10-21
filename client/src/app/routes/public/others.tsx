import ForbiddenPage from "@/app/pages/app/403";
import ErrorPage from "@/app/pages/app/404";
import PricingPage from "@/app/pages/base/billing/PricingPage";
import Home from "@/app/pages/base/home";
import { Navigate, Route } from "react-router-dom";

export default function OtherPublicRoutes() {
    return (
        <>
            <Route index element={<Home />} />
            {/* Error pages */}
            <Route path="/403" element={<ForbiddenPage />} />
            <Route path="/404" element={<ErrorPage code="404" />} />

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/404" replace />} />
            <Route path="/pricing" element={<PricingPage />} />
        </>
    );
}