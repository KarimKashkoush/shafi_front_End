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
import StafLayout from "../layouts/StafLayout";
import StafAddResult from "../components/StafAddResult/StafAddResult";
import StafAddAppointment from "../components/StafAddAppointment/StafAddAppointment";
import Cases from "../pages/Profile/StafProfile/Cases";
import ManageReceptionists from "../pages/Profile/ManageReceptionists";
import AdminLayout from "../layouts/AdminLayout";
import AdminProfile from "../pages/Profile/AdminProfile/AdminProfile";
import AddUserByAdmin from "../pages/Profile/AdminProfile/AddUserByAdmin";
import Users from "../pages/Profile/AdminProfile/Users";
import UserInfo from "../pages/Profile/AdminProfile/UserInfo";
import FinancialAccounts from "../pages/Profile/AdminProfile/FinancialAccounts";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/Auth.Context";
import AppointmentDetails from "../pages/Profile/AppointmentDetails/AppointmentDetails";
import DoctorLayout from "../layouts/DoctorLayout";
import DoctorAddAppointments from "../components/DoctorAddAppointments/DoctorAddAppointments";
import DoctorAddResults from "../pages/Profile/DoctorProfile/DoctorAddResults";
import DoctorCases from "../pages/Profile/DoctorProfile/DoctorCases";
import DoctorPatientReports from "../pages/Profile/DoctorProfile/DoctorPatientReports";
import DoctorStafLayout from "../layouts/DoctorStafLayout";
import MedicalCenter from "../layouts/MedicalCenter";
import MainDashboard from "../pages/Dashboard/MainDashboard";

function AppRouter() {
      const { user } = useContext(AuthContext);
      const [loading, setLoading] = useState(true);

      useEffect(() => {
            const timer = setTimeout(() => setLoading(false), 300);
            return () => clearTimeout(timer);
      }, [user]);

      if (loading) return <div></div>;

      const profileRoutes = user
            ? [
                  {
                        path: "/profile/:id",
                        element:
                              user.role === "patient" ? (<PatientLayout />)
                                    : user.role === "admin" ? (<AdminLayout />)
                                          : user.role === "doctor" ? (<DoctorLayout />)
                                                : user.role === "clinic_reception" ? (<DoctorStafLayout />)
                                                      : user.role === "medicalCenter" ? (<MedicalCenter />)
                                                            : (<StafLayout />),
                        children:
                              user.role === "patient"
                                    ? [
                                          { index: true, element: <PatientProfile /> },
                                          { path: "userData", element: <ProfileUserData /> },
                                    ]
                                    : user.role === "admin"
                                          ? [
                                                { index: true, element: <AdminProfile /> },
                                                { path: "add-user", element: <AddUserByAdmin /> },
                                                { path: "users", element: <Users /> },
                                                { path: "financial-accounts", element: <FinancialAccounts /> },
                                                { path: "users/user-info/:id", element: <UserInfo /> },
                                          ]
                                          : user.role === "doctor"
                                                ? [
                                                      { index: true, element: <DoctorCases /> },
                                                      { path: "userData", element: <ProfileUserData /> },
                                                      { path: "add-appointment", element: <DoctorAddAppointments /> },
                                                      { path: "add-result", element: <DoctorAddResults /> },
                                                      { path: "patientReports/:nationalId", element: <DoctorPatientReports /> },
                                                ] : user.role === "receptionist"
                                                      ? [
                                                            { index: true, element: <DoctorCases /> },
                                                            { path: "userData", element: <ProfileUserData /> },
                                                            { path: "add-appointment", element: <DoctorAddAppointments /> },
                                                            { path: "patientReports/:nationalId", element: <DoctorPatientReports /> },
                                                      ]
                                                      :
                                                      user.role === "medicalCenter"
                                                            ? [
                                                                  { index: true, element: <DoctorCases /> },
                                                                  { path: "userData", element: <ProfileUserData /> },
                                                                  { path: "dashboard", element: <MainDashboard /> },
                                                                  { path: "add-appointment", element: <DoctorAddAppointments /> },
                                                                  { path: "manage-receptionists", element: <ManageReceptionists /> },
                                                                  { path: "patientReports/:nationalId", element: <DoctorPatientReports /> },
                                                            ]
                                                            : [
                                                                  { index: true, element: <StafProfile /> },
                                                                  { path: "userData", element: <ProfileUserData /> },
                                                                  { path: "add-appointment", element: <StafAddAppointment /> },
                                                                  { path: "add-result", element: <StafAddResult /> },
                                                                  { path: "cases", element: <Cases /> },
                                                                  { path: "manage-receptionists", element: <ManageReceptionists /> },
                                                            ],
                  },
            ]
            : [];

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
                  ],
            },
            ...profileRoutes,
            {
                  path: "/UserData/:id",
                  element: <ShowUserData />,
                  children: [{ index: true, element: <PatientProfile /> }],
            },
            { path: "/patientReports/:nationalId", element: <DoctorPatientReports /> },



            // ✅الراوت الجديد هنا
            {
                  path: "/appointment/:id",
                  element: <AppointmentDetails />,
            },
      ]);


      return <RouterProvider router={router} />;
}

export default AppRouter;
