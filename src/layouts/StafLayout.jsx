import { Outlet } from "react-router";
import ProfileSidebar from "../pages/Profile/ProfileSidebar";
import ProfileHeader from "../pages/Profile/ProfileHeader";

import MedicalDataImg from "../assets/images/medical-data.png";
import ProfileImg from "../assets/images/profile.png";
import LogOutImg from "../assets/images/logout.png";

const linksForPatient = [
      { to: "add-appointment", label: "تسجيل حالة", icon: MedicalDataImg },
      { to: "add-result", label: "إضافة نتيجة جديدة", icon: MedicalDataImg },
      { to: "/profile/:id", label: "البيانات الطبية", icon: MedicalDataImg },
      { to: "userData", label: "بيانات الحساب", icon: ProfileImg },
      { to: "cases", label: "الحالات", icon: ProfileImg },
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
