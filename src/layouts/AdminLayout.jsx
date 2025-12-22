import { Outlet } from "react-router";
import ProfileSidebar from "../pages/Profile/ProfileSidebar";
import "./layout.css"
import userImage from "../assets/images/profile.png"
import addUserImage from "../assets/images/registered.png"
import usersImage from "../assets/images/about-team.png"
import financialAccountImage from "../assets/images/accounting.png"
import ProfileImg from "../assets/images/profile.png";
import { useEffect, useState } from "react";
import Loading from "../pages/Loading/Loading"
export default function AdminLayout() {

      const links = [
            { to: "/profile/:id", label: "الحساب", icon: userImage },
            { to: "add-user", label: "إضافة حساب جديد", icon: addUserImage },
            { to: "users", label: "المستخدمين", icon: usersImage },
            { to: "financial-accounts", label: "الحسابات", icon: financialAccountImage },
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
            <section className="admin-layout layout">
                  <ProfileSidebar links={links} />
                  <Outlet />
            </section>
      )
}
