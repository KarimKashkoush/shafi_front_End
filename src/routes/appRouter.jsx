import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home/Home";
import Services from "../pages/Services/Services";
import About from "../pages/About/About";
import Login from "../pages/Login/Login";
import ProfileLayout from "../layouts/ProfileLayout";
import Register from "../pages/Register/Register";


const router = createBrowserRouter([

      {
            path: '/profile/:id',
            element: <ProfileLayout />
      },
      {
            path: '/login',
            element: <Login />
      },
      {
            path: '/register',
            element: <Register />
      },
      {
            path: "/",
            element: <MainLayout />,
            // errorElement: <div>Page Not Found</div>,
            children: [
                  {
                        index: true,
                        element: <Home/>
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