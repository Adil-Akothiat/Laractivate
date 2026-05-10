import { Link } from "react-router-dom";

export default function NotFoundPage() {
    return (
        <div className="flex h-screen items-center justify-center bg-base-200">
            <div className="text-center">
                <h1 className="text-9xl font-bold text-primary">404</h1>
                <p className="mt-4 text-2xl font-semibold">Page Not Found</p>
                <p className="mt-2 text-base-content/60">
                    The page you're looking for doesn't exist.
                </p>
                <Link to="/dashboard" className="btn btn-primary mt-4">
                    Back to Dashboard
                </Link>
            </div>
        </div>
    );
}