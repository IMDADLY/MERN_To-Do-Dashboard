import { useNavigate } from "react-router";
import { House } from "lucide-react";
const ErrorBoundary = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
      <p className="text-2xl font-bold text-amber-950 tracking-tight">
        Something Went Wrong!
      </p>
      <p className="mt-2 text-sm text-amber-800">
        An unexpected error occurred. Please try again.
      </p>
      <button
        onClick={() => navigate({ pathname: "/" })}
        className="mt-6 flex items-center gap-2 rounded-lg bg-amber-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:bg-amber-700 hover:shadow-lg"
      >
        <House className="h-4 w-4" />
        <span>Back to Home</span>
      </button>
    </div>
  );
};

export default ErrorBoundary;
