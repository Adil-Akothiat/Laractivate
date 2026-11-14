import { Navigate, Route } from "react-router-dom";
import ForbiddenPage from "../../pages/public/403";
import ErrorPage from "../../pages/public/404";
import Home from "../../pages/public/home";
import PricingPage from "../../pages/public/pricing";

export default function PublicRoutes() {
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