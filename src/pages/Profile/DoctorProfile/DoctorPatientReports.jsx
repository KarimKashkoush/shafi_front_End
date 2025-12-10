import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import "yet-another-react-lightbox/styles.css";
import Swal from "sweetalert2";
import { useParams } from "react-router";
import whatssappImage from '../../../assets/images/whatsapp.png';
import Reports from './Reports';
export default function DoctorPatientReports() {
      const { nationalId } = useParams();
      const [appointments, setAppointments] = useState([]);
      const [loading, setLoading] = useState(true);
      const apiUrl = import.meta.env.VITE_API_URL;
      const user = JSON.parse(localStorage.getItem("user"));
      const userId = user?.id;
      const medicalCenterId = user?.medicalCenterId;



const fetchAppointments = useCallback(async () => {
      const token = localStorage.getItem("token");
      try {
            setLoading(true);
            const res = await axios.get(`${apiUrl}/doctor/patientFiles/${nationalId}`, {
                  headers: { Authorization: `Bearer ${token}` }
            });

            const userAppointments = res.data.data.filter(
                  (appt) => appt.userId === userId || appt.userId === medicalCenterId
            );

            setAppointments(userAppointments);
      } catch (err) {
            console.error("Error fetching appointments", err);
      } finally {
            setLoading(false);
      }
}, [apiUrl, userId, medicalCenterId, nationalId]); 





      useEffect(() => {
            fetchAppointments();
      }, [fetchAppointments]);



      // حساب عمر المريض
      const calculateAgeFromBirthDate = (birthDate) => {
            if (!birthDate) return "غير متوفر";

            const birth = new Date(birthDate);
            const today = new Date();

            let age = today.getFullYear() - birth.getFullYear();
            const m = today.getMonth() - birth.getMonth();

            if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
                  age--;
            }

            return age;
      };

      const patientAge = calculateAgeFromBirthDate(appointments[0]?.birthDate);
      // لينك صفحة المريض
      const patientLink = `${window.location.origin}/patientReports/${appointments[0]?.nationalId}`;

      return (
            <section className="table overflow-x-auto">
                  {loading ? <p>⏳ جاري التحميل...</p> : (
                        <>
                              <section className="row">
                                    {[
                                          { title: "اسم الحالة", value: appointments[0]?.caseName || "غير متوفر" },
                                          { title: "العمر", value: patientAge },
                                          {
                                                title: "ارسال الملف الطبي للمريض", value: (
                                                      <span
                                                            style={{ cursor: "pointer" }}
                                                            onClick={() => {
                                                                  const phone = appointments[0]?.phone;
                                                                  if (!phone) Swal.fire("تنبيه", "لا يوجد رقم هاتف للمريض -", "warning");
                                                                  else {
                                                                        const url = `https://wa.me/${phone}?text=${encodeURIComponent(`رابط صفحتك الطبية: ${patientLink}`)}`;
                                                                        window.open(url, "_blank");
                                                                  }
                                                            }}
                                                      >
                                                            <img src={whatssappImage} alt="" width="30px" />
                                                      </span>
                                                )
                                          },
                                          {
                                                title: "نسخ لينك ملف المريض", value: (
                                                      <span
                                                            style={{ cursor: "pointer" }}
                                                            onClick={() => {
                                                                  navigator.clipboard.writeText(patientLink);
                                                                  Swal.fire("تم النسخ", "تم نسخ رابط صفحة المريض 📋", "success");
                                                            }}
                                                      >
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" viewBox="0 0 16 16">
                                                                  <path d="M6.354 5.5H4a3 3 0 1 0 0 6h2.354a.5.5 0 0 1 0 1H4a4 4 0 1 1 0-8h2.354a.5.5 0 0 1 0 1z" />
                                                                  <path d="M9.646 5.5H12a3 3 0 1 1 0 6H9.646a.5.5 0 0 0 0 1H12a4 4 0 1 0 0-8H9.646a.5.5 0 1 0 0 1z" />
                                                                  <path d="M5 8a.5.5 0 0 1 .5-.5h5a.5.5 0 1 1 0 1h-5A.5.5 0 0 1 5 8z" />
                                                            </svg>
                                                      </span>
                                                )
                                          }
                                    ].map((item, idx) => (
                                          <section key={idx} className="col-12 col-sm-6 col-md-3 d-flex mb-3">
                                                <section className="m-2 p-3 text-center rounded-2 shadow bg-body w-100 d-flex flex-column justify-content-center" style={{ minHeight: "120px" }}>
                                                      <p className="text-danger">{item.title}</p>
                                                      <span>{item.value}</span>
                                                </section>
                                          </section>
                                    ))}
                              </section>


                              <Reports nationalId={nationalId} />
                        </>
                  )}
            </section>
      );
}
