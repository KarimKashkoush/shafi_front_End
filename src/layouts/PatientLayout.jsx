import { Outlet } from "react-router";
import ProfileSidebar from "../pages/Profile/ProfileSidebar";
import ProfileHeader from "../pages/Profile/ProfileHeader";

export default function PatientLayout() {
      return (
            <section className="patient-layout">
                  <ProfileSidebar />
                  <section className="content">
                        <ProfileHeader />
                        <Outlet />
                  </section>
            </section>
      )
}