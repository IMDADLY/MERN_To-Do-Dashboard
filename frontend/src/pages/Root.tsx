import { Outlet } from "react-router";
import Navbar from "../components/Navbar";
import { useParams } from "react-router";
const Root = () => {
  const params = useParams();
  const isLogged: boolean = params.id ? true : false;
  console.log(params);
  return (
    <>
      <Navbar isLogged={isLogged} />
      <Outlet />
    </>
  );
};

export default Root;
