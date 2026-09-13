import { useState } from "react";
import { useNavigate } from "react-router";
import { Radio } from "react-loader-spinner";
import axiosAuth from "../../api/axiosAuth";
type Details = {
  user: string;
  email: string;
  password: string;
};
const Register = () => {
  const navigate = useNavigate();
  const noErrors = {
    user: "",
    email: "",
    password: "",
  };
  const [details, setDetails] = useState<Details>({
    ...noErrors,
  });
  const [errors, setErrors] = useState(noErrors);
  const [isLoading, setIsLoading] = useState(false);
  const registerUser = async (details: Details) => {
    try {
      setIsLoading(true);
      const { user, password, email } = details;
      await axiosAuth.post("/register", {
        user,
        password,
        email,
      });
      navigate("/todos");
    } finally {
      setIsLoading(false);
    }
  };
  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    const errs = validate();
    if (!errs) {
      registerUser(details);
    }
  };
  const validate = () => {
    const { user, email, password } = details;
    const newErrors = {
      user: user.trim().length < 6 ? "Name should be atleast 6 characters" : "",
      email: !email || !/\S+@\S+\.\S+/.test(email) ? "Email is invalid" : "",
      password:
        password.trim().length < 8
          ? "Password should be atleast 8 characters"
          : "",
    };
    setErrors(newErrors);
    const hasErrors = Object.values(newErrors).some((err) => err.length > 0);
    return hasErrors;
  };
  return (
    <>
      <Radio
        visible={isLoading}
        height="50"
        width="50"
        colors={["green", "green", "green"]}
        ariaLabel="radio-loading"
        wrapperClass="mx-auto my-16"
      />
      {!isLoading && (
        <div className="max-w-xl mx-auto mt-10">
          <p className="text-2xl font-bold text-amber-950 tracking-tight mb-6 text-center">
            Sign Up For An Account
          </p>
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl bg-amber-50 p-8 shadow-xl border border-amber-200 space-y-6"
          >
            <p className="text-lg font-semibold text-amber-900">
              Personal information
            </p>
            <hr className="border-amber-200"></hr>
            <label className="block space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-900">
                Username
              </span>
              <input
                type="text"
                name="user"
                id="user"
                value={details.user}
                className="w-full rounded-lg border border-amber-300 bg-white px-4 py-2 shadow-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-colors sm:text-sm"
                onChange={(e) =>
                  setDetails({ ...details, user: e.target.value })
                }
              />
              {errors.user && (
                <span className="text-red-500 text-xs font-medium p-2 block">
                  {errors.user}
                </span>
              )}
            </label>
            <label className="block space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-900">
                Email Address
              </span>
              <input
                type="text"
                name="email"
                id="email"
                value={details.email}
                className="w-full rounded-lg border border-amber-300 bg-white px-4 py-2 shadow-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-colors sm:text-sm"
                onChange={(e) =>
                  setDetails({ ...details, email: e.target.value })
                }
              />
              {errors.email && (
                <span className="text-red-500 text-xs font-medium p-2 block">
                  {errors.email}
                </span>
              )}
            </label>
            <label className="block space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-900">
                Password
              </span>
              <input
                type="password"
                name="password"
                id="password"
                value={details.password}
                className="w-full rounded-lg border border-amber-300 bg-white px-4 py-2 shadow-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-colors sm:text-sm"
                onChange={(e) =>
                  setDetails({ ...details, password: e.target.value })
                }
              />
              {errors.password && (
                <span className="text-red-500 text-xs font-medium p-2 block">
                  {errors.password}
                </span>
              )}
            </label>
            <button
              type="submit"
              className="w-full rounded-lg bg-amber-600 py-2.5 font-semibold text-white shadow-md transition-all duration-200 hover:bg-amber-700 hover:shadow-lg"
            >
              Submit
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default Register;
