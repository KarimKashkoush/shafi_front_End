import { Outlet } from "react-router";
import ProfileSidebar from "../pages/Profile/ProfileSidebar";
import ProfileHeader from "../pages/Profile/ProfileHeader";
import "./layout.css"

import usersImg from "../assets/images/users.png";
import dataAnalyticsImg from "../assets/images/data-analytics.png";
import registeredImg from "../assets/images/registered.png";
import AddResultImg from "../assets/images/add-result.png";
import ProfileImg from "../assets/images/profile.png";
import receptionImage from "../assets/images/computer.png";

const links = [
      { to: "/profile/:id", label: "التعداد", icon: dataAnalyticsImg },
      { to: "cases", label: "الحالات", icon: usersImg },
      { to: "add-appointment", label: "تسجيل حالة", icon: registeredImg },
      { to: "add-result", label: "إضافة نتيجة جديدة", icon: AddResultImg },
      { to: "manage-receptionists", label: "موظفين الاستقبال", icon: receptionImage },
      { to: "userData", label: "بيانات الحساب", icon: ProfileImg },
];

export default function StafLayout() {
      return (
            <section className="profile-layout layout">
                  <ProfileSidebar links={links} />
                  <section className="content">
                        <ProfileHeader />
                        <Outlet />
                  </section>
            </section>
      )
}
