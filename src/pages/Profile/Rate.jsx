import React, { useEffect, useState } from "react";
import axios from "axios";
import "./style.css";

export default function Rate() {
      const [appointments, setAppointments] = useState([]);
      const [loading, setLoading] = useState(true);
      const [filter, setFilter] = useState("all"); // today | week | month | all
      const apiUrl = import.meta.env.VITE_API_URL;

      // دالة تجيب الداتا
      const fetchAppointments = async () => {
            try {
                  setLoading(true);
                  const res = await axios.get(`${apiUrl}/appointments`);
                  setAppointments(res.data.data);
            } catch (err) {
                  console.error("❌ Error fetching appointments:", err);
            } finally {
                  setLoading(false);
            }
      };

      useEffect(() => {
            fetchAppointments();
      }, []);

      // فلترة المدة
      const filterAppointments = (data) => {
            const now = new Date();

            return data.filter((appt) => {
                  const created = new Date(appt.createdAt);
                  switch (filter) {
                        case "today":
                              return (
                                    created.toDateString() === now.toDateString()
                              );
                        case "week":
                              const weekAgo = new Date();
                              weekAgo.setDate(now.getDate() - 7);
                              return created >= weekAgo;
                        case "month":
                              const monthAgo = new Date();
                              monthAgo.setMonth(now.getMonth() - 1);
                              return created >= monthAgo;
                        default:
                              return true;
                  }
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

                  {/* الفلتر */}
                  <div className="mb-4">
                        <select
                              className="form-select w-auto"
                              value={filter}
                              onChange={(e) => setFilter(e.target.value)}
                        >
                              <option value="all">الكل</option>
                              <option value="today">اليوم</option>
                              <option value="week">هذا الأسبوع</option>
                              <option value="month">هذا الشهر</option>
                        </select>
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
                                          <p>📄 حالات ليها نتائج</p>
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
                                                {total > 0 ? ((withResults / total) * 100).toFixed(1) + "%" : "0%"}
                                          </span>
                                    </section>
                              </section>
                        </section>
                  )}
            </section>
      );
}
