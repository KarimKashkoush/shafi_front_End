import { createBrowserRouter, RouterProvider } from "react-router-dom";

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
import StafProfile from "../pages/Profile/StafProfile/StafProfile";
import { AuthContext } from "../context/Auth.Context";
import StafLayout from "../layouts/StafLayout";
import StafAddResult from "../components/StafAddResult/StafAddResult";

function AppRouter() {
      const user = JSON.parse(localStorage.getItem("user")); // يبقى object

      // تعريف routes الخاصة بالبروفايل حسب الدور
      const profileRoutes = user ? [
            {
                  path: "/profile/:id",
                  element: user.role === "patient" ? <PatientLayout /> : <StafLayout />,
                  children: user.role === "patient" ? [
                        { index: true, element: <PatientProfile /> },
                        { path: "userData", element: <ProfileUserData /> }
                  ] : [
                        { index: true, element: <StafProfile /> },
                        { path: "userData", element: <ProfileUserData /> },
                        { path: "add-result", element: <StafAddResult /> }
                  ]
            }
      ] : [];

      const router = createBrowserRouter([
            { path: "/login", element: <Login /> },
            { path: "/register", element: <Register /> },
            {
                  path: "/",
                  element: <MainLayout />,
                  children: [
                        { index: true, element: <Home /> },
                        { path: "services", element: <Services /> },
                        { path: "about", element: <About /> },
                  ]
            },
            ...profileRoutes, // دمج routes الخاصة بالبروفايل
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
