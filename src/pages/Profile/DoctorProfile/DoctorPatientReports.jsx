import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import Lightbox from "yet-another-react-lightbox";

import "yet-another-react-lightbox/styles.css";

import { Zoom } from "yet-another-react-lightbox/plugins";
import { z } from "zod";

import pdfImage from '../../../assets/images/file.png';
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Row } from "react-bootstrap";
import { useParams } from "react-router";
import { formatUtcDateTime } from "../../../utils/date";



export default function DoctorPatientReports() {
      const { nationalId } = useParams();

      const [appointments, setAppointments] = useState([]);
      const [loading, setLoading] = useState(true);
      const [uploadingId, setUploadingId] = useState(null);
      const apiUrl = import.meta.env.VITE_API_URL;
      const user = JSON.parse(localStorage.getItem("user"));
      const userId = user?.id;
      const [uploading, setUploading] = useState(false);
      const [files, setFiles] = useState([]);

      // جلب البيانات
      const fetchAppointments = useCallback(async () => {
            const token = localStorage.getItem("token");
            try {
                  setLoading(true);
                  const res = await axios.get(`${apiUrl}/doctor/patientFiles/${nationalId}`, {
                        headers: { Authorization: `Bearer ${token}` }
                  });

                  const userAppointments = res.data.data.filter(
                        (appt) => appt.userId === userId || appt.centerId === userId
                  );

                  setAppointments(userAppointments);
            } catch (err) {
                  console.error("Error fetching appointments", err);
            } finally {
                  setLoading(false);
            }
      }, [apiUrl, userId]);
      // ✅ dependencies المطلوبة فقط

      useEffect(() => {
            fetchAppointments();
      }, [fetchAppointments]); // ✅ التحذير اختفى


      const schema = z.object({
            report: z.string().min(1, "التقرير مطلوب"),
            nextAction: z.string().min(1, "الإجراء التالي مطلوب"),
      });

      const {
            register,
            handleSubmit,
            formState: { errors },
      } = useForm({
            resolver: zodResolver(schema),
            defaultValues: {
                  report: "",
                  nextAction: "",
            },
      });

      const onSubmit = async (data, e) => {
            try {
                  const token = localStorage.getItem("token");
                  setUploading(true);

                  const formData = new FormData();
                  formData.append("report", data.report);
                  formData.append("nextAction", data.nextAction);
                  formData.append("userId", userId);
                  files.forEach((file) => formData.append("files", file));

                  await axios.post(
                        `${apiUrl}/appointments/${uploadingId}/addResultAppointment`,
                        formData,
                        {
                              headers: {
                                    "Content-Type": "multipart/form-data",
                                    Authorization: `Bearer ${token}`,
                              },
                        }
                  );

                  Swal.fire("تم", "تم رفع تقرير الحالة بنجاح ✅", "success");

                  // ✅ مسح الفورم
                  e.target.reset();  // يمسح قيم الفورم
                  setFiles([]);      // يمسح ملفات الرفع

                  // ✅ تحديث الجدول تلقائي
                  await fetchAppointments();

                  setUploadingId(null);
            } catch (err) {
                  console.error("❌ خطأ أثناء رفع النتيجة:", err);
                  Swal.fire("خطأ", "حدث خطأ أثناء الرفع", "error");
            } finally {
                  setUploading(false);
            }
      };


      const [isOpen, setIsOpen] = useState(false);
      const [photoIndex, setPhotoIndex] = useState(0);
      const [slides, setSlides] = useState([]);

      const openGallery = (images, index) => {
            const formattedSlides = images.map((image) => ({
                  src: image.startsWith("http") ? image : `${apiUrl}${image}`,
            }));
            setSlides(formattedSlides);
            setPhotoIndex(index);
            setIsOpen(true);
      };

      console.log(appointments)
      return (
            <section>
                  {loading ? <p>⏳ جاري التحميل...</p> : (
                        <table className="table table-bordered table-striped text-center" style={{ width: "100%", minWidth: "1050px" }}>
                              <thead className="table-dark" style={{ verticalAlign: "middle" }}>
                                    <tr>
                                          <th>#</th>
                                          <th>التقرير</th>
                                          <th>الإجراء التالي</th>
                                          <th>الملفات</th>
                                          <th>تاريخ الإضافة</th>
                                          <th>اضافة تقرير</th>
                                    </tr>
                              </thead>
                              <tbody style={{ verticalAlign: "middle" }}>
                                    {appointments.length > 0 ? (
                                          appointments.map((r, idx) => (
                                                <tr key={r.id}>
                                                      <td>{idx + 1}</td>

                                                      {/* التقرير */}
                                                      <td>
                                                            {r.result
                                                                  ? r.result.map((r) => <div key={r.id}>{r.report}</div>)
                                                                  : <span className="text-danger fw-bold">❌ لم يتم إرفاق تقرير</span>}
                                                      </td>

                                                      {/* الإجراء التالي */}
                                                      <td>
                                                            {r.result
                                                                  ? r.result.map((r) => <div key={r.id}>{r.nextAction}</div>)
                                                                  : <span className="text-danger fw-bold">❌</span>}
                                                      </td>

                                                      {/* الملفات */}
                                                      <td>
                                                            {r.result
                                                                  ? (
                                                                        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                                                                              {r.result.map((r) =>
                                                                                    r.files.map((file, i) => file.toLowerCase().endsWith(".pdf") ? (
                                                                                          <a key={i} href={file} target="_blank" rel="noopener noreferrer">
                                                                                                <img
                                                                                                      src={pdfImage}
                                                                                                      alt="PDF"
                                                                                                      style={{ width: "40px", height: "40px", cursor: "pointer" }}
                                                                                                />
                                                                                          </a>
                                                                                    ) : (
                                                                                          <img
                                                                                                key={i}
                                                                                                src={file}
                                                                                                alt="file"
                                                                                                style={{
                                                                                                      width: "50px",
                                                                                                      height: "50px",
                                                                                                      objectFit: "cover",
                                                                                                      borderRadius: "5px",
                                                                                                      cursor: "pointer"
                                                                                                }}
                                                                                                onClick={() => openGallery(r.result.map(r => r.files).flat(), i)}
                                                                                          />
                                                                                    ))
                                                                              )}
                                                                        </div>
                                                                  )
                                                                  : <span className="text-danger fw-bold">❌ لم يتم إرفاق ملفات</span>
                                                            }
                                                      </td>

                                                      {/* تاريخ الإضافة */}
                                                      <td dir="ltr">{formatUtcDateTime(r.resultCreatedAt || r.createdAt)}</td>

                                                      {/* زر إضافة تقرير */}
                                                      <td>
                                                            <button
                                                                  className="btn btn-sm btn-success"
                                                                  onClick={() => setUploadingId(r.id)}
                                                                  disabled={r.result && r.result.length > 0} // قفل الزر لو فيه نتيجة
                                                            >
                                                                  {r.result && r.result.length > 0 ? "تم اضافة تقرير ✅" : "اضافة تقرير 📤"}
                                                            </button>

                                                            {/* رفع التقرير */}
                                                            {uploadingId === r.id && (
                                                                  <div
                                                                        className="modal fade show d-block"
                                                                        tabIndex="-1"
                                                                        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
                                                                  >
                                                                        <div className="modal-dialog modal-dialog-centered">
                                                                              <div className="modal-content p-3">
                                                                                    <form onSubmit={handleSubmit(onSubmit)}>
                                                                                          <h3 className="mb-3 fw-bold">رفع تقرير الحالة</h3>

                                                                                          <Row className="mb-4 p-2">
                                                                                                <h4 className="text-end fw-bold">التقرير</h4>
                                                                                                <textarea
                                                                                                      className="form-control"
                                                                                                      placeholder="التقرير"
                                                                                                      rows={3}
                                                                                                      {...register("report")}
                                                                                                />
                                                                                                {errors.report && <p className="text-danger">{errors.report.message}</p>}
                                                                                          </Row>

                                                                                          <Row className="mb-4 p-2">
                                                                                                <h4 className="text-end fw-bold">الإجراء التالي</h4>
                                                                                                <textarea
                                                                                                      className="form-control"
                                                                                                      placeholder="الإجراء التالي"
                                                                                                      rows={3}
                                                                                                      {...register("nextAction")}
                                                                                                />
                                                                                                {errors.nextAction && (
                                                                                                      <p className="text-danger">{errors.nextAction.message}</p>
                                                                                                )}
                                                                                          </Row>

                                                                                          <Row className="mb-4 p-2">
                                                                                                <h4 className="text-end fw-bold">إضافة ملفات / صور</h4>
                                                                                                <input
                                                                                                      type="file"
                                                                                                      multiple
                                                                                                      className="form-control"
                                                                                                      onChange={(e) => setFiles(Array.from(e.target.files))}
                                                                                                />
                                                                                          </Row>

                                                                                          <div className="mt-3 d-flex justify-content-end gap-2">
                                                                                                <button
                                                                                                      type="button"
                                                                                                      className="btn btn-secondary"
                                                                                                      onClick={() => setUploadingId(null)}
                                                                                                >
                                                                                                      إلغاء
                                                                                                </button>
                                                                                                <button className="btn btn-success" type="submit" disabled={uploading}>
                                                                                                      {uploading ? "جاري الرفع..." : "✅ تأكيد الرفع"}
                                                                                                </button>
                                                                                          </div>
                                                                                    </form>
                                                                              </div>
                                                                        </div>
                                                                  </div>
                                                            )}
                                                      </td>
                                                </tr>
                                          ))
                                    ) : (
                                          <tr>
                                                <td colSpan="6" className="text-center">
                                                      لا توجد بيانات
                                                </td>
                                          </tr>
                                    )}
                              </tbody>


                        </table>
                  )}

                  {isOpen && (
                        <Lightbox
                              open={isOpen}
                              close={() => setIsOpen(false)}
                              slides={slides}
                              index={photoIndex}
                              on={{ view: ({ index }) => setPhotoIndex(index) }}
                              plugins={[Zoom]} // ✅ تفعيل البلجن
                              zoom={{
                                    maxZoomPixelRatio: 3, // أقصى تكبير للصورة (3x)
                                    zoomInMultiplier: 1.3, // سرعة التكبير
                                    doubleTapDelay: 300, // دبل كليك للتكبير
                              }}
                        />
                  )}

            </section>
      );
}
