import React, { useCallback, useEffect, useState } from 'react'
import { getAppointments, getPaymentsByMedicalCenter } from '../../api';
import MyChart from './MyChart';

export default function MainDashboard() {
      const user = JSON.parse(localStorage.getItem("user"));
      const userId = user?.id;
      const medicalCenterId = user?.medicalCenterId;
      const [appointments, setAppointments] = useState([]);
      const [loading, setLoading] = useState(false);
      const [payments, setPayments] = useState([]);
      const [filterType, setFilterType] = useState("today");
      const [customStart, setCustomStart] = useState("");
      const [customEnd, setCustomEnd] = useState("");


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


      const fetchPayments = useCallback(async () => {
            try {
                  setLoading(true);
                  const data = await getPaymentsByMedicalCenter(medicalCenterId);
                  setPayments(data);
                  // معالجة البيانات حسب الحاجة
            } catch (err) {
                  console.error("Error fetching payments", err);
            } finally {
                  setLoading(false);
            }
      }, [medicalCenterId]);




      useEffect(() => {
            fetchAppointments();
            fetchPayments();
      },
            [fetchAppointments
                  , fetchPayments
            ]
      );

      const today = new Date().toISOString().split("T")[0];


      const normalizeDate = (dateString) => {
            if (!dateString) return null;

            // لو التاريخ فيه مسافة بدلاً من T → نستبدلها
            const fixed = dateString.replace(" ", "T");

            return new Date(fixed);
      };

      const isInRange = (date, start, end) => {
            const d = new Date(date);

            // لو custom end فقط
            const endDate = new Date(end);
            endDate.setHours(23, 59, 59, 999);

            return d >= start && d <= endDate;
      };



      const filterByDate = (data, type) => {
            const now = new Date();
            let start, end;

            switch (type) {
                  case "today":
                        start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                        end = new Date();
                        break;

                  case "yesterday":
                        start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
                        end = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                        break;

                  case "last7":
                        start = new Date();
                        start.setDate(start.getDate() - 7);
                        end = new Date();
                        break;

                  case "last30":
                        start = new Date();
                        start.setDate(start.getDate() - 30);
                        end = new Date();
                        break;

                  case "thisMonth":
                        start = new Date(now.getFullYear(), now.getMonth(), 1);
                        end = new Date();
                        break;

                  case "thisYear":
                        start = new Date(now.getFullYear(), 0, 1);
                        end = new Date();
                        break;

                  case "custom":
                        return data;

                  default:
                        return data;
            }

            return data.filter((item) => {
                  const d = normalizeDate(item.createdAt || item.paymentdate || item.date);
                  return d && d >= start && d <= end;
            });
      };


      const filteredAppointments =
            filterType === "custom"
                  ? appointments.filter(a =>
                        isInRange(a.createdAt, new Date(customStart), new Date(customEnd))
                  )
                  : filterByDate(appointments, filterType);

      const filteredPayments =
            filterType === "custom"
                  ? payments.filter(p =>
                        isInRange(p.paymentdate || p.createdAt, new Date(customStart), new Date(customEnd))
                  )
                  : filterByDate(payments, filterType);

      const totalIncome = filteredAppointments.reduce((acc, item) => {
            let price = parseFloat(item.price) || 0;
            let session = parseFloat(item.sessionCost) || 0;

            return acc + price + session;
      }, 0);

      const totalVisitsPaid = filteredAppointments.reduce((acc, item) => {
            return acc + (parseFloat(item.price) || 0);
      }, 0);

      const totalPaid = filteredPayments.reduce((acc, p) => acc + (parseFloat(p.amount) || 0), 0) + totalVisitsPaid;

      const totalRemaining = Math.abs(totalIncome - totalPaid);

      const getVisitStats = (list) => {
            const newVisits = list.filter(a => !a.isRevisit).length;
            const revisits = list.filter(a => a.isRevisit).length;
            return { newVisits, revisits };
      };

      const totalNet = filteredAppointments.reduce((acc, item) => {
            // لو عنده تقرير
            if (item.resultReports || (Array.isArray(item.resultFiles) && item.resultFiles.length > 0)) {
                  return acc + 10;
            }

            // لو مفيش تقرير (null)
            return acc + 5;
      }, 0);

      // فلترة المواعيد الخاصة بالنهارده
      const todaysAppointments = appointments.filter((a) => {
            const d = normalizeDate(a.createdAt || a.date);
            if (!d) return false;

            const dateOnly = d.toISOString().split("T")[0];
            return dateOnly === today;
      });
      const todayStats = getVisitStats(todaysAppointments);
      const totalStats = getVisitStats(filteredAppointments);

      { loading && <p>Loading...</p> }

      return (
            <section className="main-dashboard">
                  <section className='section-header'>
                        <h3 className='section-title'>لـــوحة القيادة</h3>
                  </section>

                  <div className="row my-3">
                        <div className="col-md-4">
                              <select
                                    className="form-control"
                                    value={filterType}
                                    onChange={(e) => setFilterType(e.target.value)}
                              >
                                    <option value="today">اليوم</option>
                                    <option value="yesterday">أمس</option>
                                    <option value="last7">آخر 7 أيام</option>
                                    <option value="last30">آخر 30 يوم</option>
                                    <option value="thisMonth">هذا الشهر</option>
                                    <option value="thisYear">هذه السنة</option>
                                    <option value="custom">تحديد مدة</option>
                              </select>
                        </div>

                        {filterType === "custom" && (
                              <>
                                    <div className="col-md-4">
                                          <input
                                                type="date"
                                                className="form-control"
                                                value={customStart}
                                                onChange={(e) => setCustomStart(e.target.value)}
                                          />
                                    </div>
                                    <div className="col-md-4">
                                          <input
                                                type="date"
                                                className="form-control"
                                                value={customEnd}
                                                onChange={(e) => setCustomEnd(e.target.value)}
                                          />
                                    </div>
                              </>
                        )}
                  </div>

                  <section className="boxs row">
                        <div className="box col-12 col-md-6 col-lg-3 p-3 text-center">
                              <div className="box-content p-3 rounded-3 shadow-sm">
                                    <h4 className="mb-2 main-color"></h4>

                                    <table className="w-100">
                                          <tbody>
                                                <tr>
                                                      <th className="text-end main-color">زيارات اليوم</th>
                                                      <td className="fw-bold">{todaysAppointments.length}</td>
                                                </tr>
                                                <tr>
                                                      <th className="text-end main-color">الزيارات الجديدة</th>
                                                      <td className="fw-bold">{todayStats.newVisits}</td>
                                                </tr>
                                                <tr>
                                                      <th className="text-end main-color">إعادة الزيارة</th>
                                                      <td className="fw-bold">{todayStats.revisits}</td>
                                                </tr>
                                          </tbody>
                                    </table>
                              </div>
                        </div>


                        <div className="box col-12 col-md-6 col-lg-3 p-3 text-center">
                              <div className="box-content p-3 rounded-3 shadow-sm">
                                    <table className="w-100">
                                          <tbody>
                                                <tr>
                                                      <th className="text-end main-color">إجمالي الزيارات</th>
                                                      <td className="fw-bold">{filteredAppointments.length}</td>
                                                </tr>
                                                <tr>
                                                      <th className="text-end main-color">الزيارات الجديدة</th>
                                                      <td className="fw-bold">{totalStats.newVisits}</td>
                                                </tr>
                                                <tr>
                                                      <th className="text-end main-color">إعادة الزيارة</th>
                                                      <td className="fw-bold">{totalStats.revisits}</td>
                                                </tr>
                                          </tbody>
                                    </table>
                              </div>
                        </div>

                        <div className="box col-12 col-md-6 col-lg-3 p-3 text-center">
                              <div className="box-content p-3 rounded-3 shadow-sm">
                                    <table className="w-100">
                                          <tbody>
                                                <tr>
                                                      <th className="text-end main-color">إجمالي الإرادات</th>
                                                      <td className="fw-bold">{`${totalIncome}$`}</td>
                                                </tr>
                                                <tr>
                                                      <th className="text-end text-success">إجمالي المدفوع</th>
                                                      <td className="fw-bold text-success">{`${totalPaid.toLocaleString()}$`}</td>
                                                </tr>
                                                <tr>
                                                      <th className="text-end text-danger">إجمالي المتبقي</th>
                                                      <td className="fw-bold text-danger">{`${totalRemaining.toLocaleString()}$`}</td>
                                                </tr>
                                          </tbody>
                                    </table>
                              </div>
                        </div>

                        <div className="box col-12 col-md-6 col-lg-3 p-3 text-center">
                              <div className="box-content p-3 rounded-3 shadow-sm">
                                    <table className="w-100">
                                          <tbody>
                                                <tr>
                                                      <th className="text-end main-color">شـــافي</th>
                                                      <td className="fw-bold">{`${totalNet}$`}</td>
                                                </tr>
                                                <tr>
                                                      <th className="text-end text-success">إجمالي المدفوع</th>
                                                      <td className="fw-bold text-success">{`0$`}</td>
                                                </tr>
                                                <tr>
                                                      <th className="text-end text-danger">إجمالي المتبقي</th>
                                                      <td className="fw-bold text-danger">{`0$`}</td>
                                                </tr>
                                          </tbody>
                                    </table>
                              </div>
                        </div>
                  </section>
            </section>
      )
}
