import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import Swal from "sweetalert2";
import "yet-another-react-lightbox/styles.css";
import { formatUtcDateTime } from "../../../utils/date";
import { getAppointments } from "../../../api";

export default function DoctorCases() {
      const [fromDate, setFromDate] = useState("");
      const [toDate, setToDate] = useState("");
      const [appointments, setAppointments] = useState([]);
      const [search, setSearch] = useState("");
      const [loading, setLoading] = useState(true);
      const apiUrl = import.meta.env.VITE_API_URL;
      const user = JSON.parse(localStorage.getItem("user"));
      const userId = user?.id;
      const medicalCenterId = user?.medicalCenterId;

      // جلب البيانات
      const fetchAppointments = useCallback(async () => {
            try {
                  setLoading(true);
                  const data = await getAppointments(userId, medicalCenterId);
                  setAppointments(data);

            } catch (err) {
                  console.error("Error fetching appointments", err);
            } finally {
                  setLoading(false);
            }
      }, [userId, medicalCenterId]);

      useEffect(() => {
            fetchAppointments();
      }, [fetchAppointments]);

      const handleDelete = async (id, nationalId) => {
            Swal.fire({
                  title: "هل أنت متأكد؟",
                  text: "سيتم حذف كل الحالات الخاصة بهذا الرقم القومي!",
                  icon: "warning",
                  showCancelButton: true,
                  confirmButtonColor: "#d33",
                  cancelButtonColor: "#3085d6",
                  confirmButtonText: "نعم، احذفها",
                  cancelButtonText: "إلغاء",
            }).then(async (result) => {
                  if (result.isConfirmed) {
                        try {
                              const token = localStorage.getItem("token");

                              if (nationalId) {
                                    // حذف كل الحالات بنفس الرقم القومي
                                    await axios.delete(`${apiUrl}/appointments/deleteByNationalId/${nationalId}`, {
                                          headers: { Authorization: `Bearer ${token}` },
                                    });

                                    // تحديث الواجهة
                                    setAppointments((prev) =>
                                          prev.filter((appt) => appt.nationalId !== nationalId)
                                    );
                              } else {
                                    // حذف حالة واحدة بدون رقم قومي
                                    await axios.delete(`${apiUrl}/appointments/${id}`, {
                                          headers: { Authorization: `Bearer ${token}` },
                                    });
                                    setAppointments((prev) => prev.filter((appt) => appt.id !== id));
                              }

                              Swal.fire({
                                    icon: "success",
                                    title: "تم الحذف",
                                    text: "تم حذف الحالة/الحالات بنجاح",
                                    timer: 2000,
                                    showConfirmButton: false,
                              });
                        } catch (err) {
                              console.error("❌ خطأ أثناء الحذف:", err);
                              Swal.fire("خطأ", "حدث خطأ أثناء الحذف", "error");
                        }
                  }
            });
      };

      // تعديل الرقم القومي
      const handleEditNationalId = async (id, currentValue) => {
            const newId = window.prompt("ادخل الرقم القومي:", currentValue || "");
            if (newId && newId !== currentValue) {
                  try {
                        const token = localStorage.getItem("token");

                        const res = await axios.put(
                              `${apiUrl}/appointments/${id}/nationalId`,
                              { nationalId: newId },
                              {
                                    headers: {
                                          Authorization: `Bearer ${token}`,
                                    },
                              }
                        );

                        if (res.data.message === "success") {
                              setAppointments((prev) =>
                                    prev.map((appt) =>
                                          appt.id === id ? { ...appt, nationalId: newId } : appt
                                    )
                              );
                              Swal.fire("تم التحديث", "تم تعديل الرقم القومي", "success");
                        } else {
                              Swal.fire("خطأ", "لم يتم تعديل الرقم القومي", "error");
                        }
                  } catch (err) {
                        console.error("❌ خطأ أثناء التعديل:", err);
                        Swal.fire("خطأ", "حدث خطأ أثناء التعديل", "error");
                  }
            }
      };

      // البحث
      const filteredAppointments = appointments.filter((appt) => {
            const matchesSearch = [appt.caseName, appt.phone, appt.nationalId].some(
                  (field) => field && field.toString().includes(search)
            );

            const apptDate = new Date(appt.createdAt);

            const afterFrom = !fromDate || apptDate >= new Date(fromDate + "T00:00:00");
            const beforeTo = !toDate || apptDate <= new Date(toDate + "T23:59:59");

            return matchesSearch && afterFrom && beforeTo;
      });

      // ترتيب البيانات
      const sortedAppointments = [...filteredAppointments].sort((a, b) => {
            const aHasReport = a.resultReports && a.resultReports.length > 0;
            const bHasReport = b.resultReports && b.resultReports.length > 0;

            // ⬇️ اللي عنده تقارير ينزل تحت
            if (!aHasReport && bHasReport) return -1;
            if (aHasReport && !bHasReport) return 1;

            // ⏱️ نفس الحالة → ترتيب حسب وقت التسجيل
            return new Date(a.createdAt) - new Date(b.createdAt);
      });

      // تاريخ اليوم (من غير وقت)
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // حالات اليوم فقط
      const todayCases = appointments.filter(appt => {
            const apptDate = new Date(appt.createdAt);
            apptDate.setHours(0, 0, 0, 0);
            return apptDate.getTime() === today.getTime();
      });

      // اللي لهم نتايج
      const casesWithResults = todayCases.filter(
            appt => appt.resultReports && appt.resultReports.length > 0
      );

      // اللي مالهمش نتايج
      const casesWithoutResults = todayCases.filter(
            appt => !appt.resultReports || appt.resultReports.length === 0
      );


      return (
            <section className="cases">
                  <h4 className="fw-bold">إدارة الحالات</h4>

                  <section className="boxs row">
                        <section className="box col-4">
                              <section className="content m-1 p-2 shadow rounded-2 text-center">
                                    <p> حالات اليوم</p>
                                    <span>
                                          {todayCases.length}
                                    </span>
                              </section>
                        </section>
                        <section className="box col-4">
                              <section className="content m-1 p-2 shadow rounded-2 text-center">
                                    <p>تـــم الكشف</p>
                                    <span>
                                          {casesWithResults.length}
                                    </span>
                              </section>
                        </section>
                        <section className="box col-4">
                              <section className="content m-1 p-2 shadow rounded-2 text-center">
                                    <p> في الإنتظار</p>
                                    <span>
                                          {casesWithoutResults.length}
                                    </span>
                              </section>
                        </section>
                  </section>

                  <div className="container my-4">
                        <div className="row gap-2 align-items-end justify-content-center">
                              <div className="col-md-3">
                                    <label className="form-label fw-bold">من تاريخ:</label>
                                    <input
                                          type="date"
                                          className="form-control"
                                          value={fromDate}
                                          onChange={(e) => setFromDate(e.target.value)}
                                    />
                              </div>
                              <div className="col-md-3">
                                    <label className="form-label fw-bold">إلى تاريخ:</label>
                                    <input
                                          type="date"
                                          className="form-control"
                                          value={toDate}
                                          onChange={(e) => setToDate(e.target.value)}
                                    />
                              </div>
                              <div className="col-md-2 text-center">
                                    <button className="btn btn-primary w-100" onClick={fetchAppointments}>
                                          🔄 تحديث
                                    </button>
                              </div>
                        </div>
                  </div>

                  <div className="container my-4">
                        <div className="mb-3">
                              <input
                                    type="text"
                                    className="form-control"
                                    placeholder="ابحث بالاسم أو الهاتف أو الرقم القومي"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                              />
                        </div>
                  </div>


                  {loading ? (
                        <div className="text-center my-4 fw-bold">جاري التحميل...</div>
                  ) : (
                        <section className="table overflow-x-auto">
                              <table
                                    className="table table-bordered table-striped text-center"
                                    style={{ width: "100%", minWidth: "1050px" }}
                              >
                                    <thead className="table-dark" style={{ verticalAlign: "middle" }}>
                                          <tr>
                                                <th>#</th>
                                                <th>اسم الحالة</th>
                                                <th>رقم الهاتف</th>
                                                <th>الرقم القومي</th>
                                                <th>العمر</th>
                                                <th>الحاله</th>
                                                <th>أمراض مزمنة</th>
                                                <th>وقت التسجيل</th>
                                                <th>الإجراءات</th>
                                          </tr>
                                    </thead>
                                    <tbody style={{ verticalAlign: "middle" }}>
                                          {sortedAppointments.length > 0 ? (
                                                sortedAppointments.map((appt, idx) => (
                                                      <tr key={idx}>
                                                            <td className={appt.resultReports ? 'bg-success-subtle' : 'bg-warning-subtle'}>{idx + 1}</td>
                                                            <td className={appt.resultReports ? 'bg-success-subtle' : 'bg-warning-subtle'}>{appt.caseName}</td>
                                                            <td className={appt.resultReports ? 'bg-success-subtle' : 'bg-warning-subtle'}>{appt.phone}</td>
                                                            <td className={appt.resultReports ? 'bg-success-subtle' : 'bg-warning-subtle'}>{appt.nationalId || "❌ غير مسجل"}</td>
                                                            <td className={appt.resultReports ? 'bg-success-subtle' : 'bg-warning-subtle'}>
                                                                  {appt.birthDate
                                                                        ? (() => {
                                                                              const birth = new Date(appt.birthDate);
                                                                              const today = new Date();
                                                                              let age = today.getFullYear() - birth.getFullYear();
                                                                              const m = today.getMonth() - birth.getMonth();
                                                                              if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
                                                                                    age--; // لو لسه عيد ميلاد السنة دي ما جهش
                                                                              }
                                                                              return age;
                                                                        })()
                                                                        : "❌"}
                                                            </td>
                                                            <td className={appt.resultReports ? 'bg-success-subtle' : 'bg-warning-subtle'}>{appt.isRevisit ? <span className="bg-warning px-2 rounded">إعادة</span> : <span className="bg-success px-2 rounded">جديدة</span>}</td>
                                                            <td className={appt.resultReports ? 'bg-success-subtle' : 'bg-warning-subtle'}>{appt.chronicDiseaseDetails || "❌"}</td>
                                                            <td className={appt.resultReports ? 'bg-success-subtle' : 'bg-warning-subtle'} dir="ltr">{formatUtcDateTime(appt.createdAt)}</td>
                                                            <td className={`d-flex flex-wrap gap-2 justify-content-center align-items-center ${appt.resultReports ? 'bg-success-subtle' : 'bg-warning-subtle'}`}>
                                                                  <button
                                                                        className="btn btn-sm btn-warning"
                                                                        onClick={() => handleEditNationalId(appt.id, appt.nationalId)}
                                                                  >
                                                                        تعديل
                                                                  </button>
                                                                  <button
                                                                        className="btn btn-sm btn-danger"
                                                                        onClick={() => handleDelete(appt.id)}
                                                                  >
                                                                        حذف
                                                                  </button>
                                                                  <button
                                                                        className="btn btn-sm btn-success"
                                                                        onClick={() => {
                                                                              if (appt.nationalId) {
                                                                                    localStorage.setItem(
                                                                                          "currentPatientNationalId",
                                                                                          appt.nationalId
                                                                                    );
                                                                                    window.location.href = `/profile/${userId}/patientReports/${appt.nationalId}`;
                                                                              } else {
                                                                                    Swal.fire("❌", "لا يوجد رقم قومي لهذا المريض", "error");
                                                                              }
                                                                        }}
                                                                  >
                                                                        عرض التقارير
                                                                  </button>
                                                            </td>
                                                      </tr>
                                                ))
                                          ) : (
                                                <tr>
                                                      <td colSpan="11" className="text-center">
                                                            لا توجد بيانات
                                                      </td>
                                                </tr>
                                          )}
                                    </tbody>
                              </table>
                        </section>
                  )}
            </section>
      );
}
