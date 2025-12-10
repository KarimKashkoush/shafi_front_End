
import usersImg from "../assets/images/users.png";
import dataAnalyticsImg from "../assets/images/data-analytics.png";
import registeredImg from "../assets/images/registered.png";
import ProfileImg from "../assets/images/profile.png";
import receptionImage from "../assets/images/computer.png";
import ProfileSidebar from "../pages/Profile/ProfileSidebar";
import ProfileHeader from "../pages/Profile/ProfileHeader";
import { Outlet } from "react-router";
import { useEffect, useState } from "react";
import Loading from "../pages/Loading/Loading";

export default function MedicalCenter() {
      const [loading, setLoading] = useState(true);
      const links = [
            { to: "/profile/:id", label: "الحالات", icon: usersImg },
            { to: "dashboard", label: "لوحة القيادة", icon: dataAnalyticsImg },
            { to: "add-appointment", label: "تسجيل حالة", icon: registeredImg },
            { to: "manage-receptionists", label: "الموظفين", icon: receptionImage },
            { to: "userData", label: "بيانات الحساب", icon: ProfileImg },
      ];

      useEffect(() => {
            const minLoadingTime = new Promise((resolve) => setTimeout(resolve, 2000));

            const fetchData = new Promise((resolve) => {
                  setTimeout(resolve, 500); // لو البيانات خلصت بسرعة
            });

            Promise.all([minLoadingTime, fetchData]).then(() => setLoading(false));
      }, []);

      if (loading) return <Loading />;

      return (
            <section className="medical-center layout">
                  <ProfileSidebar links={links} />
                  <section className="content">
                        <ProfileHeader />
                        <Outlet />
                  </section>
            </section>
      )
}
