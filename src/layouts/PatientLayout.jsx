import { Outlet, useParams } from "react-router";
import ProfileSidebar from "../pages/Profile/ProfileSidebar";
import ProfileHeader from "../pages/Profile/ProfileHeader";
import ProfileImg from "../assets/images/profile.png";
import medicalFiles from "../assets/images/medical_files.png";
import "./layout.css"



export default function PatientLayout() {
      const { id } = useParams();
      const links = [
            { to: `/profile/${id}`, label: "التقارير الطبيه", icon: medicalFiles },
            { to: "userData", label: "بيانات الحساب", icon: ProfileImg },
      ];

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