export default function ForbiddenPage() {
    return (
        <div className="flex h-screen items-center justify-center bg-base-200">
            <div className="text-center">
                <h1 className="text-9xl font-bold text-primary">403</h1>
                <p className="mt-4 text-2xl font-semibold">Access Denied</p>
                <p className="mt-2 text-base-content/60">
                    You don't have permission to view this page.
                </p>
                <button
                    onClick={() => (window.location.href = "/dashboard")}
                    className="btn btn-primary mt-6"
                >
                    Back to Dashboard
                </button>
            </div>
        </div>
    );
}