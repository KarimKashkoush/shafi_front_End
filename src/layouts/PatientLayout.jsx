import { Outlet, useParams } from "react-router";
import ProfileSidebar from "../pages/Profile/ProfileSidebar";
import ProfileHeader from "../pages/Profile/ProfileHeader";
import ProfileImg from "../assets/images/profile.png";
import medicalFiles from "../assets/images/medical_files.png";
import "./layout.css"
import { useEffect, useState } from "react";
import Loading from "../pages/Loading/Loading";



export default function PatientLayout() {
      const { id } = useParams();
      const links = [
            { to: `/profile/${id}`, label: "التقارير الطبيه", icon: medicalFiles },
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
            <section className="profile-layout layout">
                  <ProfileSidebar links={links} />
                  <section className="content">
                        <ProfileHeader />
                        <Outlet />
                  </section>
            </section>
      )
}