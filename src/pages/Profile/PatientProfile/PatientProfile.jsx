import "../style.css"
import ProfileHeader from "./ProfileHeader"
import ProfileSidebar from "./ProfileSidebar"
import Emergency from "./Emergency"
import ChronicDiseases from "./ChronicDiseases"
import Pharmaceutical from "./Pharmaceutical"
import Reports from "./Reports"

import { database } from "../../../firebase/firebase";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { ref, child, get } from "firebase/database";

export default function PatientProfile() {
      const { id } = useParams();
      const [reports, setReports] = useState([]);
      const [userData, setUserData] = useState(null);
      const [loading, setLoading] = useState(true); // حالة التحميل

      useEffect(() => {
            const fetchData = async () => {
                  try {
                        const reportsSnapshot = await get(child(ref(database), "Reports"));
                        if (reportsSnapshot.exists()) {
                              const allReports = reportsSnapshot.val();
                              const userReports = Object.values(allReports).filter(
                                    (report) => report.user_id === id
                              );
                              setReports(userReports);
                        }

                        const userSnapshot = await get(child(ref(database), `UsersData/${id}`));
                        if (userSnapshot.exists()) {
                              setUserData(userSnapshot.val());
                        }

                        setLoading(false); // تم تحميل البيانات
                  } catch (error) {
                        console.error("حدث خطأ أثناء تحميل البيانات:", error);
                        setLoading(false);
                  }
            };

            fetchData();
      }, [id]);

      if (loading) {
            return (
                  <div className="loading-spinner">
                        <p>جاري تحميل البيانات...</p>
                  </div>
            );
      }

      return (
            <section className="profile">
                  <ProfileSidebar />
                  <section className="content row g-3">
                        <ProfileHeader userData={userData} />
                        <Emergency userData={userData} reportsCount={reports.length} />
                        <ChronicDiseases reports={reports} />
                        <Pharmaceutical reports={reports} />
                        <Reports userData={userData} reports={reports} />
                  </section>
            </section>
      );
}
