import { StrictMode } from "react";
import Root from "./layouts/Root";
import AuthLayout from "./layouts/AuthLayout";
import HomeLayout from "./layouts/HomeLayout";
import NotFound from "./pages/NotFound";
import About from "./pages/About";
import Home from "./pages/todos/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Item from "./pages/todos/Item";
import ErrorBoundary from "./components/ErrorBoundary";
import { createRoot } from "react-dom/client";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import "./assets/styles.css";
const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    ErrorBoundary: ErrorBoundary,
    children: [
      { index: true, Component: About },
      {
        path: "auth",
        Component: AuthLayout,
        children: [
          { path: "login", Component: Login },
          { path: "register", Component: Register },
        ],
      },
      {
        path: "todos",
        Component: HomeLayout,
        children: [
          { index: true, Component: Home },
          { path: ":id", Component: Item },
        ],
      },
      { path: "*", Component: NotFound },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
