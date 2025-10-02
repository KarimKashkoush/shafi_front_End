import { Outlet } from "react-router";
import ProfileSidebar from "../pages/Profile/ProfileSidebar";
import ProfileHeader from "../pages/Profile/ProfileHeader";

import usersImg from "../assets/images/users.png";
import dataAnalyticsImg from "../assets/images/data-analytics.png";
import registeredImg from "../assets/images/registered.png";
import AddResultImg from "../assets/images/add-result.png";
import MedicalDataImg from "../assets/images/medical-data.png";
import ProfileImg from "../assets/images/profile.png";
import LogOutImg from "../assets/images/logout.png";

const linksForPatient = [
      { to: "cases", label: "الحالات", icon: usersImg },
      { to: "add-appointment", label: "تسجيل حالة", icon: registeredImg },
      { to: "add-result", label: "إضافة نتيجة جديدة", icon: AddResultImg },
      { to: "/profile/:id", label: "التعداد", icon: dataAnalyticsImg },
      { to: "userData", label: "بيانات الحساب", icon: ProfileImg },
      {
            to: "/", label: "تسجيل الخروج", icon: LogOutImg, onClick: () => {
                  localStorage.removeItem("user");
                  localStorage.removeItem("token");
                  localStorage.removeItem("theme");
            }
      }
];

export default function StafLayout() {
      return (
            <section className="profile-layout">
                  <ProfileSidebar links={linksForPatient} />
                  <section className="content">
                        <ProfileHeader />
                        <Outlet />
                  </section>
            </section>
      )
}
