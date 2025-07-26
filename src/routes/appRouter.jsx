import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home/Home";
import Services from "../pages/Services/Services";
import About from "../pages/About/About";
import ProfileLayout from "../layouts/ProfileLayout";
import Register from "../pages/Register/Register";
import Login from "../pages/Register/Login";
import { Navigate } from "react-router-dom";
const isAuthenticated = Boolean(localStorage.getItem("user"));

const router = createBrowserRouter([

      {
            path: '/profile/:id',
            element: <ProfileLayout />
      },
      {
            path: "/login",
            element: isAuthenticated ? <Navigate to="/" /> : <Login />
      },
      {
            path: "/register",
            element: isAuthenticated ? <Navigate to="/" /> : <Register />
      },
      {
            path: "/",
            element: <MainLayout />,
            // errorElement: <div>Page Not Found</div>,
            children: [
                  {
                        index: true,
                        element: <Home />
                  },
                  {
                        path: "services",
                        element: <Services />
                  },
                  {
                        path: 'about',
                        element: <About />
                  }
            ]
      }
]);

function AppRouter() {
      return <RouterProvider router={router} />
}

export default AppRouter