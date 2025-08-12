// import { useContext } from "react";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home/Home";
import Services from "../pages/Services/Services";
import About from "../pages/About/About";
import PatientLayout from "../layouts/PatientLayout";
import Register from "../pages/Register/Register";
import Login from "../pages/Register/Login";
import PatientProfile from "../pages/Profile/PatientProfile/PatientProfile";
import ProfileUserData from "../pages/Profile/ProfileUserData";
import ShowUserData from "../layouts/ShowUserData";
import { AuthContext } from "../context/Auth.Context";
function AppRouter() {

      // const { user } = useContext(AuthContext);
      // const isAuthenticated = Boolean(user);

      const router = createBrowserRouter([
            {
                  path: "/login",
                  element: <Login />
            },
            {
                  path: "/register",
                  element: <Register />
            },
            {
                  path: "/",
                  element: <MainLayout />,
                  children: [
                        { index: true, element: <Home /> },
                        { path: "services", element: <Services /> },
                        { path: "about", element: <About /> }
                  ]
            },
            {
                  path: "/profile/:id",
                  element: <PatientLayout />,
                  children: [
                        { index: true, element: <PatientProfile /> },
                        { path: "userData", element: <ProfileUserData /> }
                  ]
            },
            {
                  path: "/UserData/:id",
                  element: <ShowUserData />,
                  children: [
                        { index: true, element: <PatientProfile /> }
                  ]
            }
      ]);

      return <RouterProvider router={router} />;
}

export default AppRouter;
