import axios from "axios";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function Cases() {
      const [appointments, setAppointments] = useState([]);
      const [search, setSearch] = useState("");
      const [loading, setLoading] = useState(true);
      const [uploadingId, setUploadingId] = useState(null); // ✅ لتحديد الصف اللي هيظهر فيه الفورم
      const [files, setFiles] = useState([]);
      const apiUrl = import.meta.env.VITE_API_URL;
      const userId = 1; // مؤقتًا لغاية ما توصله من الـ AuthContext أو الـ state

      // جلب البيانات
      const fetchAppointments = async () => {
            try {
                  setLoading(true);
                  const res = await axios.get(`${apiUrl}/appointments`);
                  setAppointments(res.data.data);
            } catch (err) {
                  console.error("Error fetching appointments", err);
            } finally {
                  setLoading(false);
            }
      };

      useEffect(() => {
            fetchAppointments();
      }, []);

      // حذف الحالة
      const handleDelete = async (id) => {
            Swal.fire({
                  title: "هل أنت متأكد؟",
                  text: "لا يمكنك التراجع بعد الحذف!",
                  icon: "warning",
                  showCancelButton: true,
                  confirmButtonColor: "#d33",
                  cancelButtonColor: "#3085d6",
                  confirmButtonText: "نعم، احذفها",
                  cancelButtonText: "إلغاء",
            }).then(async (result) => {
                  if (result.isConfirmed) {
                        try {
                              await axios.delete(`${apiUrl}/appointments/${id}`);
                              setAppointments((prev) => prev.filter((appt) => appt.id !== id));

                              Swal.fire({
                                    icon: "success",
                                    title: "تم الحذف",
                                    text: "تم حذف الحالة بنجاح",
                                    timer: 2000,
                                    showConfirmButton: false,
                              });
                        } catch (err) {
                              console.error("❌ خطأ أثناء الحذف:", err);
                              Swal.fire({
                                    icon: "error",
                                    title: "خطأ",
                                    text: "حدث خطأ أثناء الحذف",
                              });
                        }
                  }
            });
      };

      // تعديل الرقم القومي
      const handleEditNationalId = async (id, currentValue) => {
            const newId = window.prompt("ادخل الرقم القومي:", currentValue || "");
            if (newId && newId !== currentValue) {
                  try {
                        const res = await axios.put(`${apiUrl}/appointments/${id}/nationalId`, {
                              nationalId: newId,
                        });

                        if (res.data.success) {
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

      // رفع نتيجة
      const handleUploadResult = async (id) => {
            if (files.length === 0) return Swal.fire("تنبيه", "اختر ملفات أولاً", "warning");

            const formData = new FormData();
            for (let f of files) formData.append("files", f);
            formData.append("userId", userId);

            try {
                  const res = await axios.post(
                        `${apiUrl}/appointments/${id}/addResultAppointment`,
                        formData,
                        { headers: { "Content-Type": "multipart/form-data" } }
                  );

                  Swal.fire("تم", "تم رفع النتيجة بنجاح ✅", "success");

                  // تحديث الحالة في الواجهة
                  setAppointments((prev) =>
                        prev.map((appt) =>
                              appt.id === id ? { ...appt, resultFiles: res.data.data.files } : appt
                        )
                  );

                  setUploadingId(null);
                  setFiles([]);
            } catch (err) {
                  console.error("❌ خطأ أثناء رفع النتيجة:", err);
                  Swal.fire("خطأ", "حدث خطأ أثناء رفع النتيجة", "error");
            }
      };

      // البحث
      const filteredAppointments = appointments.filter((appt) =>
            [appt.caseName, appt.phone, appt.nationalId].some(
                  (field) => field && field.toString().includes(search)
            )
      );

      return (
            <section className="cases">
                  <h4 className="fw-bold">إدارة الحالات</h4>
                  <div className="container my-4">
                        {/* البحث */}
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

                  {/* الجدول */}
                  {loading ? (
                        <div className="text-center my-4 fw-bold">⏳ جاري التحميل...</div>
                  ) : (
                        <table className="table table-bordered table-striped text-center">
                              <thead className="table-dark">
                                    <tr>
                                          <th>#</th>
                                          <th>اسم الحالة</th>
                                          <th>رقم الهاتف</th>
                                          <th>الرقم القومي</th>
                                          <th>وقت التسجيل</th>
                                          <th>النتيجة</th>
                                          <th>الإجراءات</th>
                                    </tr>
                              </thead>
                              <tbody>
                                    {filteredAppointments.length > 0 ? (
                                          filteredAppointments.map((appt, idx) => (
                                                <tr key={appt.id}>
                                                      <td>{idx + 1}</td>
                                                      <td>{appt.caseName}</td>
                                                      <td>{appt.phone}</td>
                                                      <td>{appt.nationalId || "❌ غير مسجل"}</td>
                                                      <td>{new Date(appt.created_at).toLocaleString()}</td>
                                                      <td>
                                                            {appt.resultFiles && appt.resultFiles.length > 0 ? (
                                                                  <span className="text-success fw-bold">
                                                                        ✅ تم إرفاق النتيجة
                                                                  </span>
                                                            ) : (
                                                                  <span className="text-danger fw-bold">
                                                                        ❌ لم يتم إرفاق نتيجة
                                                                  </span>
                                                            )}
                                                      </td>
                                                      <td>
                                                            <button
                                                                  className="btn btn-sm btn-warning me-2"
                                                                  onClick={() =>
                                                                        handleEditNationalId(appt.id, appt.nationalId)
                                                                  }
                                                            >
                                                                  ✏ تعديل
                                                            </button>
                                                            <button
                                                                  className="btn btn-sm btn-danger me-2"
                                                                  onClick={() => handleDelete(appt.id)}
                                                            >
                                                                  🗑 حذف
                                                            </button>
                                                            <button
                                                                  className="btn btn-sm btn-info"
                                                                  onClick={() =>
                                                                        setUploadingId(uploadingId === appt.id ? null : appt.id)
                                                                  }
                                                            >
                                                                  📤 رفع نتيجة
                                                            </button>
                                                            {uploadingId === appt.id && (
                                                                  <div className="mt-2">
                                                                        <input
                                                                              type="file"
                                                                              multiple
                                                                              onChange={(e) =>
                                                                                    setFiles(Array.from(e.target.files))
                                                                              }
                                                                        />
                                                                        <button
                                                                              className="btn btn-success btn-sm mt-2"
                                                                              onClick={() => handleUploadResult(appt.id)}
                                                                        >
                                                                              ✅ تأكيد الرفع
                                                                        </button>
                                                                  </div>
                                                            )}
                                                      </td>
                                                </tr>
                                          ))
                                    ) : (
                                          <tr>
                                                <td colSpan="7" className="text-center">
                                                      لا توجد بيانات
                                                </td>
                                          </tr>
                                    )}
                              </tbody>
                        </table>
                  )}
            </section>
      );
}
