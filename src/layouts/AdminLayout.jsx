import { Outlet } from "react-router";
import ProfileSidebar from "../pages/Profile/ProfileSidebar";
import "./layout.css"
import userImage from "../assets/images/profile.png"
import addUserImage from "../assets/images/registered.png"
import usersImage from "../assets/images/about-team.png"
import financialAccountImage from "../assets/images/accounting.png"
export default function AdminLayout() {
      const links = [
            { to: "/profile/:id", label: "الحساب", icon: userImage },
            { to: "add-user", label: "إضافة حساب جديد", icon: addUserImage },
            { to: "users", label: "المستخدمين", icon: usersImage },
            { to: "financial-accounts", label: "الحسابات", icon: financialAccountImage },
      ];
      return (
            <section className="admin-layout layout">
                  <ProfileSidebar links={links} />
                  <Outlet />
            </section>
      )
}
