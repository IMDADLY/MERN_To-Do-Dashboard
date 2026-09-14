import logo from "../assets/logo.png";
import { Link } from "react-router";
import axiosAuth from "../api/axiosAuth";
import { useNavigate } from "react-router";
const Navbar = ({ isLogged }: { isLogged: boolean }) => {
  const navigate = useNavigate();
  const userLogOut = async () => {
    try {
      await axiosAuth.post("/logout");
      navigate("/about");
    } catch {}
  };
  return (
    <nav className="bg-amber-100 border-b border-amber-200 shadow-sm flex items-center justify-between px-6 py-3">
      <div>
        <a href="/" className="flex items-center space-x-3">
          <img src={logo} alt="Todo logo" style={{ height: 50, width: 50 }} />
          <span className="font-sans text-2xl font-bold text-amber-950 tracking-tight">
            To Do List
          </span>
        </a>
      </div>

      {!isLogged ? (
        <div className="flex">
          <ul className="flex items-center gap-6">
            <li>
              <Link
                to="/auth/login"
                className="text-sm font-semibold text-amber-800 hover:text-amber-950 transition-colors"
              >
                Log In
              </Link>
            </li>
            <li>
              <Link
                to="/auth/register"
                className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:bg-amber-700 hover:shadow-lg"
              >
                Sign Up
              </Link>
            </li>
          </ul>
        </div>
      ) : (
        <div className="flex">
          <ul className="flex items-center">
            <li>
              <button
                onClick={() => userLogOut()}
                className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:bg-amber-700 hover:shadow-lg"
              >
                Log Out
              </button>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
