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
      console.log("User ID from params:", id);

      const [reports, setReports] = useState([]);
      const [userData, setUserData] = useState(null);

      useEffect(() => {
            get(child(ref(database), "Reports")).then((snapshot) => {
                  if (snapshot.exists()) {
                        const allReports = snapshot.val();
                        const userReports = Object.values(allReports).filter(
                              (report) => report.user_id === id
                        );
                        setReports(userReports);
                  }
            });

            get(child(ref(database), `UsersData/${id}`)).then((snapshot) => {
                  if (snapshot.exists()) {
                        setUserData(snapshot.val());
                  }
            });
      }, [id]);



      return (
            <section className="profile">
                  <ProfileSidebar />
                  <section className="content row g-3">
                        <ProfileHeader userData={userData} />
                        <Emergency userData={userData} reportsCount={reports.length} />
                        <ChronicDiseases  reports={reports}/>
                        <Pharmaceutical  reports={reports}/>
                        <Reports userData={userData} reports={reports} />
                  </section>
            </section>
      )
}
