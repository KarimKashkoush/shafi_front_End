import React, { useEffect, useState } from "react";
import axios from "axios";
import "./style.css";

export default function Rate() {
      const today = new Date().toISOString().split("T")[0]; // ✅ تاريخ اليوم بصيغة yyyy-mm-dd

      const [appointments, setAppointments] = useState([]);
      const [loading, setLoading] = useState(true);
      const [startDate, setStartDate] = useState(today); 
      const [endDate, setEndDate] = useState(""); 
      const apiUrl = import.meta.env.VITE_API_URL;
      const user = JSON.parse(localStorage.getItem("user"));
      const userId = user?.id;

      const fetchAppointments = async () => {
            const token = localStorage.getItem("token"); 

            try {
                  setLoading(true);
                  const res = await axios.get(`${apiUrl}/appointments`, {
                        headers: { Authorization: `Bearer ${token}` },
                  });

                  const userAppointments = res.data.data.filter(
                        (appt) => appt.userId === userId
                  );

                  setAppointments(userAppointments);
            } catch (err) {
                  console.error("❌ Error fetching appointments:", err);
            } finally {
                  setLoading(false);
            }
      };

      useEffect(() => {
            fetchAppointments();
      }, []);

      // ✅ فلترة حسب الفترة المحددة
      const filterAppointments = (data) => {
            const start = startDate ? new Date(startDate) : new Date("2000-01-01");
            const end = endDate ? new Date(endDate) : new Date();

            // نخلي نهاية اليوم شاملة كل الساعات
            end.setHours(23, 59, 59, 999);

            return data.filter((appt) => {
                  const created = new Date(appt.createdAt);
                  return created >= start && created <= end;
            });
      };

      const filteredAppointments = filterAppointments(appointments);

      // إحصائيات
      const total = filteredAppointments.length;
      const withResults = filteredAppointments.filter(
            (appt) => appt.resultFiles && appt.resultFiles.length > 0
      ).length;
      const withoutResults = total - withResults;

      return (
            <section className="rate container my-4">
                  <h4 className="fw-bold mb-3">📊 ملخص الحالات</h4>

                  {/* ✅ اختيار المدة */}
                  <div className="d-flex align-items-center gap-3 mb-4 flex-wrap">
                        <div>
                              <label className="form-label fw-bold me-2">من:</label>
                              <input
                                    type="date"
                                    className="form-control"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                              />
                        </div>

                        <div>
                              <label className="form-label fw-bold me-2">إلى:</label>
                              <input
                                    type="date"
                                    className="form-control"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                              />
                        </div>
                  </div>

                  {loading ? (
                        <div className="text-center fw-bold">⏳ جاري التحميل...</div>
                  ) : (
                        <section className="boxs row g-3">
                              <section className="box col-6 col-md-3 px-2">
                                    <section className="content">
                                          <p>📥 إجمالي الحالات</p>
                                          <span>{total}</span>
                                    </section>
                              </section>

                              <section className="box col-6 col-md-3 px-2">
                                    <section className="content">
                                          <p>📄 حالات لديها نتائج</p>
                                          <span>{withResults}</span>
                                    </section>
                              </section>

                              <section className="box col-6 col-md-3 px-2">
                                    <section className="content">
                                          <p>❌ حالات بدون نتائج</p>
                                          <span>{withoutResults}</span>
                                    </section>
                              </section>

                              <section className="box col-6 col-md-3 px-2">
                                    <section className="content">
                                          <p>📊 نسبة النتائج</p>
                                          <span>
                                                {total > 0
                                                      ? ((withResults / total) * 100).toFixed(1) + "%"
                                                      : "0%"}
                                          </span>
                                    </section>
                              </section>
                        </section>
                  )}
            </section>
      );
}
