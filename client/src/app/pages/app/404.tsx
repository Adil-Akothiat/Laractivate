import { Link } from "react-router-dom";

interface ErrorPageProps {
  code?: string | number;
  title?: string;
  message?: string;
  redirectTo?: string;
  redirectLabel?: string;
}

export default function ErrorPage({
  code = 404,
  title = "Page Not Found",
  message = "The page you're looking for doesn't exist.",
  redirectTo = "/dashboard",
  redirectLabel = "Back to Dashboard",
}: ErrorPageProps) {
  return (
    <div className="flex h-screen items-center justify-center bg-base-200">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-primary">{code}</h1>
        <p className="mt-4 text-2xl font-semibold">{title}</p>
        <p className="mt-2 text-base-content/60">{message}</p>
        <Link to={redirectTo} className="btn btn-primary mt-4">
          {redirectLabel}
        </Link>
      </div>
    </div>
  );
}