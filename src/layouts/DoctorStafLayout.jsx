import { Outlet } from "react-router";
import ProfileSidebar from "../pages/Profile/ProfileSidebar";
import ProfileHeader from "../pages/Profile/ProfileHeader";
import "./layout.css"

import usersImg from "../assets/images/users.png";
import registeredImg from "../assets/images/registered.png";
import ProfileImg from "../assets/images/profile.png";
import { useEffect, useState } from "react";
import Loading from "../pages/Loading/Loading";

const links = [
      { to: "/profile/:id", label: "الحالات", icon: usersImg },
      { to: "add-appointment", label: "تسجيل حالة", icon: registeredImg },
      { to: "userData", label: "بيانات الحساب", icon: ProfileImg },
];
export default function DoctorStafLayout() {
      const [loading, setLoading] = useState(true);
      useEffect(() => {
            const minLoadingTime = new Promise((resolve) => setTimeout(resolve, 2000));

            const fetchData = new Promise((resolve) => {
                  setTimeout(resolve, 500); // لو البيانات خلصت بسرعة
            });

            Promise.all([minLoadingTime, fetchData]).then(() => setLoading(false));
      }, []);
      if (loading) return <Loading />;
      return (
            <section className="doctor-staf-layout layout">
                  <ProfileSidebar links={links} />
                  <section className="content">
                        <ProfileHeader />
                        <Outlet />
                  </section>
            </section>
      )
}
