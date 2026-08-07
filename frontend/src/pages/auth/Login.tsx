import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
const BASE_URL = "http://localhost:3000/auth/login";
const Login = () => {
  const navigate = useNavigate();
  const noErrors = {
    user: "",
    password: "",
  };
  const [details, setDetails] = useState({
    ...noErrors,
  });
  const [errors, setErrors] = useState(noErrors);

  const authenticateUser = async (details) => {
    try {
      const { user, password } = details;
      await axios.post(
        BASE_URL,
        {
          user,
          password,
        },
        { withCredentials: true },
      );
      navigate("/todos");
    } catch (error) {
      console.error(error);
    } finally {
      console.log("request completed");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (!errs) {
      authenticateUser(details);
    }
  };
  const validate = () => {
    const { user, password } = details;
    const newErrors = {
      user: user.trim().length < 6 ? "Name should be atleast 6 characters" : "",
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
      <div>
        <h1>Sign In To Your Account</h1>
        <form onSubmit={handleSubmit}>
          <h2>Personal information</h2>
          <hr></hr>
          <label>
            Username
            <input
              type="text"
              name="user"
              id="user"
              value={details.user}
              className="m-8 rounded border-gray-300 shadow-sm sm:text-sm"
              onChange={(e) => setDetails({ ...details, user: e.target.value })}
            />
            {errors.user && (
              <span className="text-red-400 text-xs p-2">{errors.user}</span>
            )}
          </label>
          <label>
            Password
            <input
              type="text"
              name="password"
              id="password"
              value={details.password}
              onChange={(e) =>
                setDetails({ ...details, password: e.target.value })
              }
            />
            {errors.password && (
              <span className="text-red-400 text-xs p-2">
                {errors.password}
              </span>
            )}
          </label>
          <button type="submit" className="bg-blue-500 rounded-xs p-2 m-4">
            Submit
          </button>
        </form>
      </div>
    </>
  );
};

export default Login;
