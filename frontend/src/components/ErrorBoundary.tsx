import { useNavigate } from "react-router";
import { House } from "lucide-react";
const ErrorBoundary = () => {
  const navigate = useNavigate();
  return (
    <>
      <p>Something Went Wrong!</p>
      <button onClick={() => navigate({ pathname: "/" })}>
        <House />
        <span>Back to Home</span>
      </button>
    </>
  );
};

export default ErrorBoundary;
