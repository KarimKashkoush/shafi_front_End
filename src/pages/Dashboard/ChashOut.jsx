import { useEffect, useMemo, useState } from "react";
import { createCashout, getCashouts, deleteCashout } from "../../api";
import { formatUtcDateTime } from "../../utils/date";   // لو عندك نفس الفنكشن

export default function ChashOut() {
      const todayStr = new Date().toISOString().slice(0, 10);

      const [start, setStart] = useState(todayStr);
      const [end, setEnd] = useState(todayStr);

      const [amount, setAmount] = useState("");
      const [reason, setReason] = useState("");

      const [rows, setRows] = useState([]);
      const [loading, setLoading] = useState(true);
      const [saving, setSaving] = useState(false);

      const total = useMemo(
            () => rows.reduce((sum, r) => sum + Number(r.amount || 0), 0),
            [rows]
      );

      useEffect(() => {
            if (!start || !end) return;

            let cancelled = false;
            const run = async () => {
                  setLoading(true);
                  try {
                        const data = await getCashouts(start, end);
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
      }, [start, end]);

      const onSubmit = async (e) => {
            e.preventDefault();

            const amt = Number(amount);
            if (!amt || amt <= 0) return alert("اكتب مبلغ منصرف صحيح");
            if (!reason.trim()) return alert("اكتب سبب الصرف");

            try {
                  setSaving(true);

                  // ✅ POST للباك
                  await createCashout({ amount: amt, reason: reason.trim() });

                  // ✅ بعد الإضافة نعمل refresh للجدول
                  const data = await getCashouts(start, end);
                  setRows(Array.isArray(data) ? data : []);

                  setAmount("");
                  setReason("");
            } catch (e) {
                  console.error(e);
                  alert("حصل خطأ أثناء إضافة المنصرف");
            } finally {
                  setSaving(false);
            }
      };

      if (loading) {
            return (
                  <section className="d-flex align-items-center justify-content-center" style={{ minHeight: "60vh" }}>
                        <div className="spinner-border" role="status" />
                  </section>
            );
      }

      return (
            <section className="cashout">
                  <h3 className="mb-3">المنصرف</h3>

                  {/* ✅ فلاتر المدة */}
                  <div className="row g-2 mb-3">
                        <div className="col-md-3">
                              <label className="form-label fw-bold">من</label>
                              <input type="date" className="form-control" value={start} onChange={(e) => setStart(e.target.value)} />
                        </div>
                        <div className="col-md-3">
                              <label className="form-label fw-bold">إلى</label>
                              <input type="date" className="form-control" value={end} onChange={(e) => setEnd(e.target.value)} />
                        </div>
                  </div>

                  {/* ✅ فورم إضافة منصرف */}
                  <form onSubmit={onSubmit} className="card p-3 mb-3">
                        <div className="row g-2 align-items-end">
                              <div className="col-md-3">
                                    <label className="form-label fw-bold">المنصرف</label>
                                    <input
                                          type="number"
                                          min="0"
                                          step="1"
                                          className="form-control"
                                          value={amount}
                                          onChange={(e) => setAmount(e.target.value)}
                                          placeholder="مثال: 150"
                                    />
                              </div>

                              <div className="col-md-6">
                                    <label className="form-label fw-bold">سبب الصرف</label>
                                    <input
                                          type="text"
                                          className="form-control"
                                          value={reason}
                                          onChange={(e) => setReason(e.target.value)}
                                          placeholder="مثال: شراء مستلزمات / صيانة..."
                                    />
                              </div>

                              <div className="col-md-3 d-grid">
                                    <button className="btn btn-dark" type="submit" disabled={saving}>
                                          {saving ? "جارٍ الحفظ..." : "إضافة عملية"}
                                    </button>
                              </div>
                        </div>
                  </form>

                  {/* ✅ جدول المنصرف */}
                  <div style={{ overflowX: "auto" }}>
                        <table className="table table-bordered table-striped text-center" style={{ minWidth: 1000 }}>
                              <thead className="table-dark" style={{ verticalAlign: "middle" }}>
                                    <tr>
                                          <th>#</th>
                                          <th>المنصرف</th>
                                          <th>سبب الصرف</th>
                                          <th>صرف بواسطة</th>
                                          <th>الدور</th>
                                          <th>تاريخ الصرف</th>
                                          <th>حذف</th>
                                    </tr>
                              </thead>

                              <tbody>
                                    {rows.length === 0 ? (
                                          <tr>
                                                <td colSpan={7} className="text-muted">
                                                      لا يوجد عمليات منصرف في هذه المدة
                                                </td>
                                          </tr>
                                    ) : (
                                          rows.map((r, idx) => (
                                                <tr key={r.id}>
                                                      <td>{idx + 1}</td>
                                                      <td className="fw-bold">{Number(r.amount || 0).toLocaleString()}$</td>
                                                      <td className="text-start">{r.reason || "-"}</td>
                                                      <td>{r.spenderName || "-"}</td>
                                                      <td>{r.spenderRole || "-"}</td>
                                                      <td dir="ltr">
                                                            {formatUtcDateTime ? formatUtcDateTime(r.createdAt) : new Date(r.createdAt).toLocaleString("ar-EG")}
                                                      </td>
                                                      <td>
                                                            <button
                                                                  className="btn btn-sm btn-danger"
                                                                  onClick={async () => {
                                                                        const ok = window.confirm("متأكد إنك عايز تحذف العملية دي؟");
                                                                        if (!ok) return;

                                                                        try {
                                                                              await deleteCashout(r.id);

                                                                              // تحديث الجدول محليًا (أسرع)
                                                                              setRows((prev) => prev.filter((x) => x.id !== r.id));
                                                                        } catch (e) {
                                                                              console.error(e);
                                                                              alert("حصل خطأ أثناء الحذف");
                                                                        }
                                                                  }}
                                                            >
                                                                  حذف
                                                            </button>
                                                      </td>

                                                </tr>
                                          ))
                                    )}
                              </tbody>

                              <tfoot className="table-dark fw-bold">
                                    <tr>
                                          <td>الإجمالي</td>
                                          <td>{total.toLocaleString()}$</td>
                                          <td colSpan={5}>—</td>
                                    </tr>
                              </tfoot>
                        </table>
                  </div>
            </section>
      );
}
