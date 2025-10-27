import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import Swal from "sweetalert2";
import "./style.css";
export default function Cases() {
      const [appointments, setAppointments] = useState([]);
      const [search, setSearch] = useState("");
      const [loading, setLoading] = useState(true);
      const [uploadingId, setUploadingId] = useState(null);
      const [files, setFiles] = useState([]);
      const apiUrl = import.meta.env.VITE_API_URL;
      const user = JSON.parse(localStorage.getItem("user"));
      const userId = user?.id;
      const [uploading, setUploading] = useState(false);


      // جلب البيانات
      const fetchAppointments = useCallback(async () => {
            const token = localStorage.getItem("token");
            try {
                  setLoading(true);
                  const res = await axios.get(`${apiUrl}/appointments`, {
                        headers: {
                              Authorization: `Bearer ${token}`,
                        },
                  }); const userAppointments = res.data.data.filter(
                        (appt) => appt.userId === userId
                  );
                  setAppointments(userAppointments);
            } catch (err) {
                  console.error("Error fetching appointments", err);
            } finally {
                  setLoading(false);
            }
      }, [apiUrl, userId]); // ✅ dependencies المطلوبة فقط

      useEffect(() => {
            fetchAppointments();
      }, [fetchAppointments]); // ✅ التحذير اختفى

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
                              const token = localStorage.getItem("token"); // 🟢 جلب التوكن
                              await axios.delete(`${apiUrl}/appointments/${id}`, {
                                    headers: {
                                          "Content-Type": "multipart/form-data",
                                          Authorization: `Bearer ${token}`, // 🟢 إضافة التوكن هنا
                                    },
                              });

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
                        const token = localStorage.getItem("token"); // 🟢 جلب التوكن

                        const res = await axios.put(
                              `${apiUrl}/appointments/${id}/nationalId`,
                              { nationalId: newId },
                              {
                                    headers: {
                                          Authorization: `Bearer ${token}`, // 🟢 إضافة التوكن هنا
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

      // رفع نتيجة
      const handleUploadResult = async (id) => {
            if (files.length === 0)
                  return Swal.fire("تنبيه", "اختر ملفات أولاً", "warning");

            const formData = new FormData();
            for (let f of files) formData.append("files", f);
            formData.append("userId", userId);

            try {
                  const token = localStorage.getItem("token");
                  setUploading(true); // ✅ بدأ التحميل

                  const res = await axios.post(
                        `${apiUrl}/appointments/${id}/addResultAppointment`,
                        formData,
                        {
                              headers: {
                                    "Content-Type": "multipart/form-data",
                                    Authorization: `Bearer ${token}`,
                              },
                        }
                  );

                  Swal.fire("تم", "تم رفع النتيجة بنجاح ✅", "success");

                  setAppointments((prev) =>
                        prev.map((appt) =>
                              appt.id === id
                                    ? { ...appt, resultFiles: res.data.data.files }
                                    : appt
                        )
                  );

                  setUploadingId(null);
                  setFiles([]);
            } catch (err) {
                  console.error("❌ خطأ أثناء رفع النتيجة:", err);
                  Swal.fire("خطأ", "حدث خطأ أثناء رفع النتيجة", "error");
            } finally {
                  setUploading(false); // ✅ انتهى التحميل
            }
      };


      // البحث
      const filteredAppointments = appointments.filter((appt) =>
            [appt.caseName, appt.phone, appt.nationalId].some(
                  (field) => field && field.toString().includes(search)
            )
      );

      // ✅ ترتيب البيانات: اللي مافيهمش نتايج فوق + اللي فيهم نتايج تحت (الأحدث في الآخر)
      const sortedAppointments = [...filteredAppointments].sort((a, b) => {
            const aHasResult = a.resultFiles && a.resultFiles.length > 0;
            const bHasResult = b.resultFiles && b.resultFiles.length > 0;

            if (!aHasResult && bHasResult) return -1;
            if (aHasResult && !bHasResult) return 1;

            return new Date(a.createdAt) - new Date(b.createdAt);
      });

      // ✅ إرسال النتيجة على واتساب
      const handleSendWhatsApp = (appt) => {
            if (!appt.doctorPhone) {
                  return Swal.fire("تنبيه", "لا يوجد رقم هاتف للدكتور!", "warning");
            }

            // ✅ تجهيز نص الرسالة
            const message = `
📋 *تفاصيل الحالة:*
👤 الاسم: ${appt.caseName}
📞 الهاتف:${appt.phone}
🧾 المطلوب: ${appt.testName}
🆔 الرقم القومي: ${appt.nationalId || "غير مسجل"}
🕒 وقت التسجيل: ${new Date(appt.createdAt).toLocaleString("ar-EG")}

📄 *النتيجة:*
${appt.resultFiles && appt.resultFiles.length > 0
                        ? appt.resultFiles.map((f, i) => `نتيجة ${i + 1}: ${f}`).join("\n")
                        : "❌ لم يتم إرفاق نتيجة بعد"}
`.trim();



            // ✅ تجهيز رقم الدكتور (بدون + أو 0)
            const phone = `${appt.doctorPhone}`;
            const whatsappURL = `https://wa.me/2${phone}?text=${encodeURIComponent(message)}`;

            // ✅ فتح واتساب في تبويب جديد
            window.open(whatsappURL, "_blank");
      };


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
                        <section className="table overflow-x-auto">
                              <table className="table table-bordered table-striped text-center" style={{ width: "100%", minWidth: "1050px" }}>
                                    <thead className="table-dark">
                                          <tr>
                                                <th>#</th>
                                                <th>اسم الحالة</th>
                                                <th>المطلوب</th>
                                                <th>رقم الهاتف</th>
                                                <th>الرقم القومي</th>
                                                <th>وقت التسجيل</th>
                                                <th>النتيجة</th>
                                                <th>اسم الدكتور</th>
                                                <th>ارسال النتيجه</th>
                                                <th>الإجراءات</th>
                                          </tr>
                                    </thead>
                                    <tbody>
                                          {sortedAppointments.length > 0 ? (
                                                sortedAppointments.map((appt, idx) => (
                                                      <tr key={`${appt.id}`} >
                                                            <td>{idx + 1}</td>
                                                            <td>{appt.caseName}</td>
                                                            <td>{appt.testName}</td>
                                                            <td>{appt.phone}</td>
                                                            <td>{appt.nationalId || "❌ غير مسجل"}</td>

                                                            <td>
                                                                  {appt.createdAt
                                                                        ? (() => {
                                                                              const dateObj = new Date(new Date(appt.createdAt).getTime() + 3 * 60 * 60 * 1000);

                                                                              // الوقت (مثلاً 11:30)
                                                                              const time = dateObj.toLocaleTimeString("ar-EN", {
                                                                                    hour: "2-digit",
                                                                                    minute: "2-digit",
                                                                                    hour12: true,
                                                                              });

                                                                              // التاريخ (مثلاً 2/10/2025)
                                                                              const date = dateObj.toLocaleDateString("en-GB", {
                                                                                    day: "2-digit",
                                                                                    month: "2-digit",
                                                                                    year: "numeric",
                                                                              });

                                                                              return `${time} - ${date}`;
                                                                        })()
                                                                        : "—"}
                                                            </td>



                                                            <td>
                                                                  {appt.resultFiles && appt.resultFiles.length > 0 ? (
                                                                        <div className="d-flex flex-column gap-1">
                                                                              {appt.resultFiles.map((file, i) => (
                                                                                    <a
                                                                                          key={i}
                                                                                          href={file}
                                                                                          target="_blank"
                                                                                          rel="noopener noreferrer"
                                                                                          className="text-success fw-bold"
                                                                                    >
                                                                                          📄 نتيجة {i + 1}
                                                                                    </a>
                                                                              ))}
                                                                        </div>
                                                                  ) : (
                                                                        <span className="text-danger fw-bold">
                                                                              ❌ لم يتم إرفاق نتيجة
                                                                        </span>
                                                                  )}
                                                            </td>

                                                            <td>{appt.doctorName || "—"}</td>


                                                            <td>
                                                                  <button
                                                                        className="btn btn-sm btn-success"
                                                                        onClick={() => handleSendWhatsApp(appt)}
                                                                  >
                                                                        📩 ارسال واتساب
                                                                  </button>
                                                            </td>

                                                            <td className="d-flex justify-content-center align-items-center flex-wrap gap-2">
                                                                  <button
                                                                        className="btn btn-sm btn-warning"
                                                                        onClick={() =>
                                                                              handleEditNationalId(appt.id, appt.nationalId)
                                                                        }
                                                                  >
                                                                        ✏ تعديل
                                                                  </button>
                                                                  <button
                                                                        className="btn btn-sm btn-danger"
                                                                        onClick={() => handleDelete(appt.id)}
                                                                  >
                                                                        🗑 حذف
                                                                  </button>
                                                                  <button
                                                                        className="btn btn-sm btn-success"
                                                                        onClick={() => setUploadingId(appt.id)}
                                                                        disabled={appt.resultFiles && appt.resultFiles.length > 0} // ✅ قفل الزرار لو فيه نتيجة
                                                                  >
                                                                        📤 {appt.resultFiles && appt.resultFiles.length > 0 ? "تم رفع النتيجة" : "رفع نتيجة"}
                                                                  </button>


                                                                  {uploadingId === appt.id && (
                                                                        <div
                                                                              className="modal fade show d-block"
                                                                              tabIndex="-1"
                                                                              style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
                                                                        >
                                                                              <div className="modal-dialog modal-dialog-centered">
                                                                                    <div className="modal-content p-3">
                                                                                          <h5 className="mb-3">رفع نتيجة الحالة</h5>
                                                                                          <input
                                                                                                type="file"
                                                                                                multiple
                                                                                                className="form-control"
                                                                                                onChange={(e) =>
                                                                                                      setFiles(Array.from(e.target.files))
                                                                                                }
                                                                                          />
                                                                                          <div className="mt-3 d-flex justify-content-end gap-2">
                                                                                                <button
                                                                                                      className="btn btn-secondary"
                                                                                                      onClick={() => setUploadingId(null)}
                                                                                                >
                                                                                                      إلغاء
                                                                                                </button>
                                                                                                <button
                                                                                                      className="btn btn-success d-flex align-items-center justify-content-center gap-2"
                                                                                                      onClick={() => handleUploadResult(appt.id)}
                                                                                                      disabled={uploading} // ✅ يقفل الزرار أثناء الرفع فقط
                                                                                                >
                                                                                                      {uploading && (
                                                                                                            <span
                                                                                                                  className="spinner-border spinner-border-sm"
                                                                                                                  role="status"
                                                                                                                  aria-hidden="true"
                                                                                                            ></span>
                                                                                                      )}
                                                                                                      {uploading ? "جاري رفع النتيجة..." : "✅ تأكيد الرفع"}
                                                                                                </button>


                                                                                          </div>
                                                                                    </div>
                                                                              </div>
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
                        </section>
                  )}
            </section>
      );
}
