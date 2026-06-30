import { Route, Navigate } from "react-router-dom";

import ForbiddenPage from "../../pages/app/403";
import NotFoundPage from "../../pages/app/404";

export default function appRoutes() {
    return (
        <>
            {/* Error pages */}
            <Route path="/403" element={<ForbiddenPage />} />
            <Route path="/404" element={<NotFoundPage />} />

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/404" replace />} />

            {/*
             * Add your own routes here.
             *
             * Example:
             * <Route element={<AuthGuard />}>
             *     <Route element={<Sidebar />}>
             *         <Route path="/my-feature" element={<MyFeaturePage />} />
             *     </Route>
             * </Route>
             */}
        </>
    );
}