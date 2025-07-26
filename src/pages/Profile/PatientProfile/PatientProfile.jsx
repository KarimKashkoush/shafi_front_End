import "../style.css";
import ProfileHeader from "./ProfileHeader";
import ProfileSidebar from "./ProfileSidebar";
import Emergency from "./Emergency";
import ChronicDiseases from "./ChronicDiseases";
import Pharmaceutical from "./Pharmaceutical";
import Reports from "./Reports";

import { database } from "../../../firebase/firebase";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { ref, child, get } from "firebase/database";

export default function PatientProfile() {

      const { id } = useParams();
      const [reports, setReports] = useState([]);
      const [userData, setUserData] = useState(null);
      const [loading, setLoading] = useState(true);
      const [pinVerified, setPinVerified] = useState(false);
      const [pinDigits, setPinDigits] = useState(["", "", "", ""]);

      const handleChange = (index, value) => {
            if (/^\d?$/.test(value)) {
                  const newPin = [...pinDigits];
                  newPin[index] = value;
                  setPinDigits(newPin);
                  if (value && index < 3) {
                        document.getElementById(`pin-${index + 1}`).focus();
                  }
            }
      };

      const enteredPin = pinDigits.join("");

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

                        setLoading(false);
                  } catch (error) {
                        console.error("حدث خطأ أثناء تحميل البيانات:", error);
                        setLoading(false);
                  }
            };

            fetchData();
      }, [id]);

      if (loading) {
            return (
                  <div className="loading-spinner text-center mt-5">
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

                        {(!userData?.pinCode || pinVerified) ? (
                              <>
                                    <ChronicDiseases reports={reports} />
                                    <Pharmaceutical reports={reports} />
                                    <Reports userData={userData} reports={reports} />
                              </>
                        ) : (
                              <div className="verify-pin mt-4">
                                    <p className="text-center">يرجى إدخال الرقم السري لعرض باقي البيانات</p>
                                    <div className="d-flex gap-2 justify-content-center" style={{ direction: "ltr" }}>
                                          {pinDigits.map((digit, index) => (
                                                <input
                                                      key={index}
                                                      id={`pin-${index}`}
                                                      type="text"
                                                      maxLength={1}
                                                      value={digit}
                                                      onChange={(e) => handleChange(index, e.target.value.slice(0, 1))}
                                                      onKeyDown={(e) => {
                                                            if (e.key === "Backspace" && !pinDigits[index] && index > 0) {
                                                                  document.getElementById(`pin-${index - 1}`).focus();
                                                            }
                                                      }}
                                                      className="form-control text-center"
                                                      style={{ width: "40px", direction: "ltr", textAlign: "center" }}
                                                />
                                          ))}

                                    </div>

                                    <button
                                          className="btn btn-primary mt-2 m-auto d-block"
                                          onClick={() => {
                                                if (!userData?.pinCode || enteredPin === userData?.pinCode) {
                                                      setPinVerified(true);
                                                } else {
                                                      alert("الرقم السري غير صحيح، حاول مرة أخرى");
                                                }
                                          }}
                                    >
                                          عرض بيانات المستخدم
                                    </button>
                              </div>
                        )}
                  </section>
            </section >
      );
}