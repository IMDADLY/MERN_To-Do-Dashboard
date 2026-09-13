import { Link } from "react-router";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
      <h1 className="text-6xl font-bold text-amber-600 tracking-tight">404</h1>
      <p className="mt-4 text-xl font-semibold text-amber-950">
        Page Not Found
      </p>
      <p className="mt-2 text-sm text-amber-800">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/"
        className="mt-6 rounded-lg bg-amber-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:bg-amber-700 hover:shadow-lg"
      >
        Go Home
      </Link>
    </div>
  );
};

export default NotFound;
