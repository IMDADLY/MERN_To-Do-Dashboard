import Navbar from "../components/Navbar";
import { Outlet } from "react-router";
const AuthLayout = () => {
  return (
    <>
      <Navbar isLogged={false} />
      <Outlet />
    </>
  );
};

export default AuthLayout;
