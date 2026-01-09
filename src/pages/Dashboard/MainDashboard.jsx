import { useCallback, useEffect, useState } from 'react'
import { getAppointmentsForDashboard, getPaymentsByMedicalCenter } from '../../api';
import WeeklyReportGraph from './WeeklyReportGraph';
import MonthlyReportGraph from './MonthlyReportGraph';

export default function MainDashboard() {
      const user = JSON.parse(localStorage.getItem("user"));
      const medicalCenterId = user?.medicalCenterId;
      const [appointments, setAppointments] = useState([]);
      const [loading, setLoading] = useState(false);
      const [payments, setPayments] = useState([]);
      const [filterType, setFilterType] = useState("today");
      const [customStart, setCustomStart] = useState("");
      const [customEnd, setCustomEnd] = useState("");



      const fetchAppointments = useCallback(async () => {
            setLoading(true);
            try {
                  const data = await getAppointmentsForDashboard(medicalCenterId);
                  setAppointments(Array.isArray(data) ? data : []);
                  setLoading(false);
            } catch (err) {
                  setLoading(false);
                  console.error("Error fetching appointments", err);
            } finally {
                  setLoading(false);
            }
      }, [medicalCenterId]);

      const fetchPayments = useCallback(async () => {
            setLoading(true);
            try {
                  const data = await getPaymentsByMedicalCenter(medicalCenterId);
                  setPayments(data);
                  setLoading(false);
                  // معالجة البيانات حسب الحاجة
            } catch (err) {
                  setLoading(false);
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


      const normalizeDate = (item) => {
            if (!item || typeof item !== "object") return null;

            const raw =
                  item.dateTime ||
                  item.createdAt ||
                  item.paymentdate ||
                  item.date;

            if (!raw) return null;

            const d = new Date(raw);
            return isNaN(d.getTime()) ? null : d;
      };

      const getLocalDateString = (date) => {
            if (!date) return null;
            const d = new Date(date);
            return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
      };

      const isInRange = (date, start, end) => {
            const d = new Date(date);

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

                  default:
                        return data;
            }

            return data.filter(item => {
                  const d = normalizeDate(item);
                  return d && d >= start && d <= end;
            });
      };



      const filteredAppointments =
            filterType === "custom"
                  ? appointments.filter(a => {
                        const d = normalizeDate(a);
                        return d && isInRange(d, new Date(customStart), new Date(customEnd));
                  })
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
            if (item.report) {
                  return acc + 10;
            }

            // لو مفيش تقرير (null)
            return acc + 5;
      }, 0);

      // فلترة المواعيد الخاصة بالنهارده
      const todaysAppointments = appointments.filter(a => {
            const d = normalizeDate(a);
            if (!d) return false;

            return d.toISOString().split("T")[0] === today;
      });

      const todayStats = getVisitStats(todaysAppointments);
      const totalStats = getVisitStats(filteredAppointments);

      const getCurrentWeekDates = () => {
            const now = new Date();
            const day = now.getDay();
            const saturday = new Date(now);
            saturday.setDate(now.getDate() - ((day + 1) % 7));
            const weekDates = [];
            for (let i = 0; i < 7; i++) {
                  const d = new Date(saturday);
                  d.setDate(saturday.getDate() + i);
                  weekDates.push(d);
            }
            return weekDates;
      };

      const getWeeklyCases = (appointments = []) => {
            const weekDates = getCurrentWeekDates();

            return weekDates.map(date => {
                  const dateStr = date.toISOString().split("T")[0];

                  return appointments.filter(a => {
                        const d = normalizeDate(a);
                        return d && d.toISOString().split("T")[0] === dateStr;
                  }).length;
            });
      };

      const weeklyCases = getWeeklyCases(appointments);

      const getCurrentMonthDates = () => {
            const now = new Date();
            const year = now.getFullYear();
            const month = now.getMonth(); // 0 = يناير
            const daysInMonth = new Date(year, month + 1, 0).getDate(); // عدد أيام الشهر

            const dates = [];
            for (let i = 1; i <= daysInMonth; i++) {
                  dates.push(new Date(year, month, i));
            }
            return dates;
      };

      const getMonthlyCases = (appointments = []) => {
            const monthDates = getCurrentMonthDates();

            return monthDates.map(date => {
                  const dateStr = getLocalDateString(date); // بدل toISOString
                  return appointments.filter(a => {
                        const d = normalizeDate(a);
                        return getLocalDateString(d) === dateStr;
                  }).length;
            });
      };


      const monthlyCases = getMonthlyCases(appointments);



      const [selectedDoctor, setSelectedDoctor] = useState("all");
      const doctors = [
            { id: "all", name: "كل الدكاترة" },
            ...Array.from(
                  new Map(
                        appointments
                              .filter(a => a.doctorId)
                              .map(a => [a.doctorId, { id: a.doctorId, name: a.doctorName }])
                  ).values()
            )
      ];

      const doctorFilteredAppointments = selectedDoctor === "all"
            ? filteredAppointments
            : appointments.filter(a => a.doctorId === selectedDoctor);


      const totalMoney = doctorFilteredAppointments.reduce((acc, a) => {
            return acc + (Number(a.sessionCost) || 0);
      }, 0);

      const totalPrice = doctorFilteredAppointments.reduce((acc, a) => {
            return acc + (Number(a.price) || 0);
      }, 0);

      { loading && <p>Loading...</p> }

      return (

            <section className="main-dashboard">
                  <section className='section-header'>
                        <h3 className='section-title'>لـــوحة القيادة</h3>
                  </section>


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

                  <div className="row my-3 " >
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
                  <section className="boxs row border-bottom border-3 mb-3">
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

                  <section className="side-doctors border-bottom border-3 mb-3"
                        style={{ overflowX: "auto", marginBottom: "20px" }}>
                        <div className="row mb-3">
                              <div className="col-md-4">
                                    <select
                                          className="form-control"
                                          value={selectedDoctor}
                                          onChange={(e) => setSelectedDoctor(e.target.value)}
                                    >
                                          {doctors.map(d => (
                                                <option key={d.id} value={d.id}>
                                                      {d.name}
                                                </option>
                                          ))}
                                    </select>
                              </div>
                        </div>

                        {/* Table Of appoinments for side doctor */}
                        <table
                              className="table table-bordered table-striped text-center"
                              style={{ width: "100%", minWidth: "1050px" }}
                        >
                              <thead className="table-dark" style={{ verticalAlign: "middle" }}>
                                    <tr>
                                          <th>#</th>
                                          <th>اسم الحالة</th>
                                          <th>الدكتور</th>
                                          <th>الحاله</th>
                                          <th>تاريخ الحجز</th>
                                          <th>تكلفة الجلسة</th>
                                          <th>سعر الكشف</th>
                                    </tr>
                              </thead>
                              <tbody>
                                    {doctorFilteredAppointments.map((appt, index) => (
                                          <tr key={appt.id}>
                                                <td>{index + 1}</td>
                                                <td>{appt.caseName}</td>
                                                <td>{appt.doctorName || "لم يتم تعيين دكتور"}</td>
                                                <td>{appt.isRevisit ? 'إعادة' : 'جديد'}</td>
                                                <td dir="ltr">
                                                      {new Date(appt.dateTime).toLocaleDateString("en-GB")}
                                                      {' , '}
                                                      {new Date(appt.dateTime).toLocaleTimeString("en-US", {
                                                            hour: "numeric",
                                                            minute: "2-digit",
                                                            hour12: true,
                                                      })}
                                                </td>
                                                <td>{appt.sessionCost || 0}$</td>
                                                <td>{appt.price || 0}$</td>
                                          </tr>
                                    ))}
                              </tbody>
                              <tfoot className="table-dark fw-bold">
                                    <tr>
                                          <td colSpan={5}>عدد الحالات: {doctorFilteredAppointments.length}</td>
                                          <td>الإجمالي: ${totalMoney.toLocaleString()}</td>
                                          <td>الإجمالي: ${totalPrice.toLocaleString()}</td>
                                    </tr>
                              </tfoot>

                        </table>
                  </section>

                  <section className="charts row border-bottom border-3 mb-3">
                        <div className="col-12 col-lg-6 mb-3">
                              <WeeklyReportGraph cases={weeklyCases} />
                        </div>

                        <div className="col-12 col-lg-6 mb-3">
                              <MonthlyReportGraph cases={monthlyCases} />
                        </div>
                  </section>
            </section>

      )
}

