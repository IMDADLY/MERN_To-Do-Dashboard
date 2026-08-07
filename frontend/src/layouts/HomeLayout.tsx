import Navbar from "../components/Navbar";
import { Outlet } from "react-router";
const HomeLayout = () => {
  return (
    <>
      <Navbar isLogged={true} />
      <Outlet />
    </>
  );
};

export default HomeLayout;
