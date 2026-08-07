import logo from "../assets/logo.png";
import { Link } from "react-router";
const Navbar = ({ isLogged }) => {
  return (
    <nav className="bg-amber-100 flex">
      <div>
        <a
          href="http://localhost:5173/"
          className="flex items-center space-x-2"
        >
          <img src={logo} alt="Todo logo" style={{ height: 50, width: 50 }} />
          <span className="font-sans text-2xl font-bold">To Do List</span>
        </a>
      </div>
      {!isLogged && (
        <div className="flex">
          <ul className="flex items-center">
            <li>
              <Link to="/auth/login">Log In</Link>
            </li>
            <li>
              <Link to="/auth/register">Sign Up</Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
