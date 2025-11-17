// import { useParams } from 'react-router';

import usersImg from "../assets/images/users.png";
import dataAnalyticsImg from "../assets/images/data-analytics.png";
import registeredImg from "../assets/images/registered.png";
import AddResultImg from "../assets/images/add-result.png";
import ProfileImg from "../assets/images/profile.png";
import receptionImage from "../assets/images/computer.png";
import ProfileSidebar from "../pages/Profile/ProfileSidebar";
import ProfileHeader from "../pages/Profile/ProfileHeader";
import { Outlet } from "react-router";
import { useEffect, useState } from "react";
import Loading from "../pages/Loading/Loading";


export default function DoctorLayout() {
      const links = [
            { to: "/profile/:id", label: "التعداد", icon: dataAnalyticsImg },
            { to: "cases", label: "الحالات", icon: usersImg },
            { to: "add-appointment", label: "تسجيل حالة", icon: registeredImg },
            { to: "manage-receptionists", label: "موظفين الاستقبال", icon: receptionImage },
            { to: "userData", label: "بيانات الحساب", icon: ProfileImg },
      ];


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
            <section className="doctor-layout layout">
                  <ProfileSidebar links={links} />
                  <section className="content">
                        <ProfileHeader />
                        <Outlet />
                  </section>
            </section>
      )
}
