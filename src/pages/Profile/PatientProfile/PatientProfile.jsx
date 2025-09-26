import "../style.css";
import Emergency from "./Emergency";
import ChronicDiseases from "./ChronicDiseases";
import Pharmaceutical from "./Pharmaceutical";
import Reports from "./Reports";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

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
            async function fetchPatientData() {
                  try {
                        const apiUrl = import.meta.env.VITE_API_URL;
                        const res = await axios.get(`${apiUrl}/user/${id}`);
                        const user = res?.data?.user || {};
                        const fetchedReports = res?.data?.reports || [];

                        setUserData(user);
                        setReports(fetchedReports);

                        if (!user?.pinCode || user?.pinCode.trim() === "") {
                              setPinVerified(true);
                        }
                  } catch (error) {
                        console.error("Error fetching patient data:", error);
                  } finally {
                        setLoading(false);
                  }
            }
            fetchPatientData();
      }, [id]);

      if (loading) {
            return (
                  <div className="loading-spinner text-center mt-5">
                        <p>جاري تحميل البيانات...</p>
                  </div>
            );
      }

      return (
            <section className="patient-profile">
                  <section className="content row g-3">
                        <Emergency reportsCount={reports.length} userData={userData} />

                        {pinVerified ? (
                              <>
                                    <ChronicDiseases reports={reports} />
                                    <Pharmaceutical reports={reports} />
                                    <Reports reports={reports} />
                              </>
                        ) : (
                              <div className="verify-pin mt-4">
                                    <p className="text-center">
                                          يرجى إدخال الرقم السري لعرض باقي البيانات
                                    </p>

                                    <div
                                          className="d-flex gap-2 justify-content-center"
                                          style={{ direction: "ltr" }}
                                    >
                                          {pinDigits.map((digit, index) => (
                                                <input
                                                      key={index}
                                                      id={`pin-${index}`}
                                                      type="text"
                                                      maxLength={1}
                                                      value={digit}
                                                      onChange={(e) =>
                                                            handleChange(index, e.target.value.slice(0, 1))
                                                      }
                                                      onKeyDown={(e) => {
                                                            if (
                                                                  e.key === "Backspace" &&
                                                                  !pinDigits[index] &&
                                                                  index > 0
                                                            ) {
                                                                  document.getElementById(`pin-${index - 1}`).focus();
                                                            }
                                                      }}
                                                      className="form-control text-center"
                                                      style={{
                                                            width: "40px",
                                                            direction: "ltr",
                                                            textAlign: "center",
                                                      }}
                                                />
                                          ))}
                                    </div>

                                    <button
                                          className="btn btn-primary mt-3 m-auto d-block"
                                          onClick={() => {
                                                if (enteredPin === userData?.pinCode) {
                                                      setPinVerified(true);
                                                } else {
                                                      alert("الرقم السري غير صحيح، حاول مرة أخرى");
                                                      setPinDigits(["", "", "", ""]);
                                                      document.getElementById("pin-0").focus();
                                                }
                                          }}
                                    >
                                          عرض بيانات المستخدم
                                    </button>
                              </div>
                        )}
                  </section>
            </section>
      );
}
