import { useEffect, useMemo, useState } from "react";
import { getCashouts, getWalletPaymentRows } from "../../api";
import { formatUtcDateTime } from "../../utils/date";

export default function Wallet() {
      const user = JSON.parse(localStorage.getItem("user"));
      const medicalCenterId = user?.medicalCenterId;
      const [cashouts, setCashouts] = useState([]);
      const [cashoutsLoading, setCashoutsLoading] = useState(true);


      const todayStr = new Date().toISOString().slice(0, 10);

      const [filterType, setFilterType] = useState("today");
      const [start, setStart] = useState(todayStr);
      const [end, setEnd] = useState(todayStr);

      const [rows, setRows] = useState([]);
      const [loading, setLoading] = useState(true);

      const formatDate = (d) => d.toISOString().slice(0, 10);

      // ضبط start/end حسب الفلتر
      useEffect(() => {
            const now = new Date();

            if (filterType === "custom") return;

            if (filterType === "today") {
                  setStart(formatDate(now));
                  setEnd(formatDate(now));
                  return;
            }

            if (filterType === "yesterday") {
                  const y = new Date(now);
                  y.setDate(y.getDate() - 1);
                  setStart(formatDate(y));
                  setEnd(formatDate(y));
                  return;
            }

            if (filterType === "last7") {
                  const d = new Date(now);
                  d.setDate(d.getDate() - 6);
                  setStart(formatDate(d));
                  setEnd(formatDate(now));
                  return;
            }

            if (filterType === "last30") {
                  const d = new Date(now);
                  d.setDate(d.getDate() - 29);
                  setStart(formatDate(d));
                  setEnd(formatDate(now));
                  return;
            }

            if (filterType === "thisMonth") {
                  const first = new Date(now.getFullYear(), now.getMonth(), 1);
                  setStart(formatDate(first));
                  setEnd(formatDate(now));
                  return;
            }

            if (filterType === "thisYear") {
                  const first = new Date(now.getFullYear(), 0, 1);
                  setStart(formatDate(first));
                  setEnd(formatDate(now));
                  return;
            }
      }, [filterType]);

      // Fetch rows
      useEffect(() => {
            if (!medicalCenterId || !start || !end) return;

            let cancelled = false;

            const run = async () => {
                  setLoading(true);
                  try {
                        const data = await getWalletPaymentRows(medicalCenterId, start, end);
                        if (!cancelled) setRows(Array.isArray(data) ? data : []);
                  } catch (e) {
                        console.error(e);
                        if (!cancelled) setRows([]);
                  } finally {
                        if (!cancelled) setLoading(false);
                  }
            };

            run();

            return () => {
                  cancelled = true;
            };
      }, [medicalCenterId, start, end]);


      useEffect(() => {
            if (!start || !end) return;

            let cancelled = false;

            const run = async () => {
                  setCashoutsLoading(true);
                  try {
                        const data = await getCashouts(start, end);
                        if (!cancelled) setCashouts(Array.isArray(data) ? data : []);
                  } catch (e) {
                        console.error(e);
                        if (!cancelled) setCashouts([]);
                  } finally {
                        if (!cancelled) setCashoutsLoading(false);
                  }
            };

            run();
            return () => { cancelled = true; };
      }, [start, end]);



      const totals = useMemo(() => {
            const seenSessions = new Set();
            const seenAppointments = new Set();

            let totalVisitPrice = 0;
            let totalSessionCost = 0;
            let totalPaidAmount = 0;

            // ✅ ده اللي هيطلع 1020 (مجموع عمود "اجمالي المدفوع من ثمن الجلسه" زي الجدول)
            let totalSessionPaidSum = 0;

            rows.forEach((r) => {
                  const sessionId = r.sessionId;
                  const appointmentId = r.appointmentId;

                  totalPaidAmount += Number(r.paidAmount || 0);
                  totalSessionPaidSum += Number(r.sessionPaid || 0); // ✅ هنا

                  if (appointmentId && Number(r.visitPrice || 0) > 0 && !seenAppointments.has(appointmentId)) {
                        seenAppointments.add(appointmentId);
                        totalVisitPrice += Number(r.visitPrice || 0);
                  }

                  if (sessionId && !seenSessions.has(sessionId)) {
                        seenSessions.add(sessionId);
                        totalSessionCost += Number(r.sessionCost || 0);
                  }
            });

            // المتبقي (زي ما هو عندك)
            const maxPaidBySession = new Map();
            const costBySession = new Map();

            rows.forEach((r) => {
                  const sid = r.sessionId;
                  if (!sid) return;

                  const paidSoFar = Number(r.sessionPaid || 0);
                  const cost = Number(r.sessionCost || 0);
                  costBySession.set(sid, cost);

                  const prev = maxPaidBySession.get(sid) || 0;
                  if (paidSoFar > prev) maxPaidBySession.set(sid, paidSoFar);
            });

            // ✅ إجمالي المتبقي = آخر remaining لكل session
            const latestRowBySession = new Map();

            rows.forEach((r) => {
                  const sid = r.sessionId;
                  if (!sid) return; // تجاهل دفعات appointment بدون session

                  const curKey = r.paymentDate ? new Date(r.paymentDate).getTime() : -1; // لو مفيش دفع يبقى -1
                  const prev = latestRowBySession.get(sid);

                  const prevKey = prev?.paymentDate ? new Date(prev.paymentDate).getTime() : -1;

                  // خد الصف الأحدث (أعلى paymentDate)
                  if (!prev || curKey > prevKey) latestRowBySession.set(sid, r);
            });

            let totalRemaining = 0;
            for (const r of latestRowBySession.values()) {
                  totalRemaining += Number(r.remaining || 0);
            }

            return {
                  totalVisitPrice,
                  totalSessionCost,
                  totalPaidAmount,
                  totalSessionPaidSum, // ✅ رجّعناها
                  totalRemaining,
            };
      }, [rows]);


      const cashoutTotal = useMemo(
            () => cashouts.reduce((sum, r) => sum + Number(r.amount || 0), 0),
            [cashouts]
      );

      // ✅ الدخل = الكشف + إجمالي مدفوع الجلسات (مش مدفوع الجلسة الفردي)
      const totalIncome = useMemo(
            () => Number(totals.totalVisitPrice || 0) + Number(totals.totalSessionPaidSum || 0),
            [totals.totalVisitPrice, totals.totalSessionPaidSum]
      );

      const netIncome = useMemo(
            () => totalIncome - cashoutTotal,
            [totalIncome, cashoutTotal]
      );




      if (loading) {
            return (
                  <section className="d-flex align-items-center justify-content-center" style={{ minHeight: "60vh" }}>
                        <div className="spinner-border" role="status" />
                  </section>
            );
      }

      return (
            <section className="wallet">
                  <h2 className="mb-3 fw-bold main-color text-center">الماليات</h2>

                  <div className="row g-2 mb-3 align-items-end">
                        <div className="col-md-4">
                              <div className="m-1">
                                    <label className="form-label fw-bold">تحديد مدة</label>
                                    <select className="form-control" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                                          <option value="today">اليوم</option>
                                          <option value="yesterday">أمس</option>
                                          <option value="last7">آخر 7 أيام</option>
                                          <option value="last30">آخر 30 يوم</option>
                                          <option value="thisMonth">هذا الشهر</option>
                                          <option value="thisYear">هذه السنة</option>
                                          <option value="custom">تحديد مدة</option>
                                    </select>
                              </div>
                        </div>

                        {filterType === "custom" && (
                              <>
                                    <div className="col-md-4">
                                          <div className="m-1">
                                                <label className="form-label fw-bold">من</label>
                                                <input type="date" className="form-control" value={start} onChange={(e) => setStart(e.target.value)} />
                                          </div>
                                    </div>

                                    <div className="col-md-4">
                                          <div className="m-1">
                                                <label className="form-label fw-bold">إلى</label>
                                                <input type="date" className="form-control" value={end} onChange={(e) => setEnd(e.target.value)} />
                                          </div>
                                    </div>
                              </>
                        )}
                  </div>

                  <div style={{ overflowX: "auto" }}>
                        <table className="table table-bordered table-striped text-center" style={{ minWidth: 1100 }}>
                              <thead className="table-dark" style={{ verticalAlign: "middle" }}>
                                    <tr>
                                          <th>#</th>
                                          <th>الاسم</th>
                                          <th>مبلغ الجلسة</th>
                                          <th>مبلغ الكشف</th>
                                          <th>مدفوع الجلسة</th>
                                          <th>اجمالي المدفوع من ثمن الجلسه</th>
                                          <th>المتبقي</th>
                                          <th>تاريخ الدفع</th>
                                    </tr>
                              </thead>

                              <tbody>
                                    {rows.map((r, idx) => (
                                          <tr key={r.paymentId || `${r.sessionId}-${idx}`}>
                                                <td>{idx + 1}</td>

                                                <td>
                                                      {r.caseName || "-"}
                                                      {r.sessionNumber && (
                                                            <span className="badge bg-secondary ms-2" title="رقم الجلسة">
                                                                  جلسة {r.sessionNumber}
                                                            </span>
                                                      )}
                                                </td>

                                                <td>{Number(r.sessionCost || 0).toLocaleString()}$</td>
                                                <td className="text-success">{Number(r.visitPrice || 0).toLocaleString()}$</td>

                                                <td className="text-success">{Number(r.paidAmount || 0).toLocaleString()}$</td>
                                                <td className="text-success">{Number(r.sessionPaid || 0).toLocaleString()}$</td>

                                                <td className={r.remaining == null ? "" : Number(r.remaining) > 0 ? "text-danger" : "text-success"}>
                                                      {r.remaining == null ? "—" : `${Number(r.remaining).toLocaleString()}$`}
                                                </td>

                                                <td dir="ltr">{formatUtcDateTime(r.sortDate)}</td>


                                          </tr>
                                    ))}
                              </tbody>

                              <tfoot className="table-dark fw-bold">
                                    {/* صف الإجمالي الأساسي */}
                                    <tr>
                                          <td colSpan={2}>الإجمالي</td>
                                          <td>{totals.totalSessionCost.toLocaleString()}$</td>
                                          <td>{totals.totalVisitPrice.toLocaleString()}$</td>
                                          <td>{totals.totalPaidAmount.toLocaleString()}$</td>
                                          <td>{totals.totalSessionPaidSum.toLocaleString()}$</td>
                                          <td className="text-danger">{totals.totalRemaining.toLocaleString()}$</td>
                                          <td>-</td>
                                    </tr>

                                    {/* ✅ صف جديد: (مدفوع الجلسة + مبلغ الكشف) */}
                                    <tr>
                                          <td colSpan={3}>إجمالي (مدفوع الجلسة + مبلغ الكشف)</td>
                                          <td className="text-success" colSpan={2}>
                                                {(totals.totalPaidAmount + totals.totalVisitPrice).toLocaleString()}$
                                          </td>
                                          <td colSpan={3}>-</td>
                                    </tr>
                              </tfoot>

                        </table>
                  </div>

                  <h3 className="mt-4 mb-2 fw-bold">المنصرف</h3>

                  {cashoutsLoading ? (
                        <div className="d-flex align-items-center justify-content-center" style={{ minHeight: 120 }}>
                              <div className="spinner-border" role="status" />
                        </div>
                  ) : (
                        <div style={{ overflowX: "auto" }}>
                              <table className="table table-bordered table-striped text-center" style={{ minWidth: 900 }}>
                                    <thead className="table-dark" style={{ verticalAlign: "middle" }}>
                                          <tr>
                                                <th>#</th>
                                                <th>المبلغ</th>
                                                <th>سبب الصرف</th>
                                                <th>صرف بواسطة</th>
                                                <th>الدور</th>
                                                <th>تاريخ الصرف</th>
                                          </tr>
                                    </thead>

                                    <tbody>
                                          {cashouts.length === 0 ? (
                                                <tr>
                                                      <td colSpan={6} className="text-muted">لا يوجد منصرف في هذه المدة</td>
                                                </tr>
                                          ) : (
                                                cashouts.map((c, idx) => (
                                                      <tr key={c.id}>
                                                            <td>{idx + 1}</td>
                                                            <td className="fw-bold text-danger">{Number(c.amount || 0).toLocaleString()}$</td>
                                                            <td className="text-start">{c.reason || "-"}</td>
                                                            <td>{c.spenderName || "-"}</td>
                                                            <td>{c.spenderRole || "-"}</td>
                                                            <td dir="ltr">{formatUtcDateTime(c.createdAt)}</td>
                                                      </tr>
                                                ))
                                          )}
                                    </tbody>

                                    <tfoot className="table-dark fw-bold">
                                          <tr>
                                                <td>إجمالي المنصرف</td>
                                                <td className="text-danger">{cashoutTotal.toLocaleString()}$</td>
                                                <td colSpan={4}>—</td>
                                          </tr>
                                    </tfoot>
                              </table>
                        </div>
                  )}

                  <h3 className="mt-4 mb-2 fw-bold">ملخص</h3>

                  <div style={{ overflowX: "auto" }}>
                        <table className="table table-bordered text-center" style={{ minWidth: 700 }}>
                              <thead className="table-dark">
                                    <tr>
                                          <th colSpan={2}> أجمالي الكشوفات + المدفوع من الجلسات</th>
                                          <th>إجمالي المنصرف</th>
                                          <th>صافي الدخل</th>
                                    </tr>
                              </thead>

                              <tbody>
                                    <tr className="fw-bold">
                                          <td className="text-success" colSpan={2}>
                                                {(
                                                      Number(totals.totalVisitPrice || 0) +
                                                      Number(totals.totalSessionPaidSum || 0)
                                                ).toLocaleString()}$
                                          </td>

                                          <td className="text-danger">{cashoutTotal.toLocaleString()}$</td>
                                          <td className={netIncome >= 0 ? "text-success" : "text-danger"}>
                                                {netIncome.toLocaleString()}$
                                          </td>
                                    </tr>
                              </tbody>
                        </table>
                  </div>
            </section>
      );
}
