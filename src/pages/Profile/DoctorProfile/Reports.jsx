import pdfImage from '../../../assets/images/file.png';
import { formatUtcDateTime } from "../../../utils/date";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { Zoom } from "yet-another-react-lightbox/plugins";
import { z } from "zod";
import Swal from "sweetalert2";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Col, Row } from "react-bootstrap";
import { Modal, Button, Table } from "react-bootstrap";
export default function Reports({ nationalId }) {
      const [appointments, setAppointments] = useState([]);
      const [uploadingId, setUploadingId] = useState(null);
      const apiUrl = import.meta.env.VITE_API_URL;
      const user = JSON.parse(localStorage.getItem("user"));
      const userId = user?.id;
      const medicalCenterId = user?.medicalCenterId;
      const [uploading, setUploading] = useState(false);
      const [files, setFiles] = useState([]);
      const [loading, setLoading] = useState(false);



      // جوه الـ component
      const [paymentModal, setPaymentModal] = useState({
            isOpen: false,
            payments: [],
      });

      const fetchAppointments = useCallback(async () => {

            const token = localStorage.getItem("token");
            try {
                  const res = await axios.get(`${apiUrl}/doctor/patientFiles/${nationalId}`, {
                        headers: { Authorization: `Bearer ${token}` }
                  });

                  const userAppointments = res.data.data.filter(
                        (appt) => appt.userId === userId || appt.userId === medicalCenterId
                  );

                  setAppointments(userAppointments);
            } catch (err) {
                  console.error("Error fetching appointments", err);
            }
      }, [apiUrl, userId, medicalCenterId, nationalId]);

      // إزالة التكرار حسب res.id
      const allResults = appointments.flatMap(a => a.result || []);
      const uniqueResults = [
            ...new Map(allResults.map(res => [res.id, res])).values()
      ];
      // قبل return
      const totalSessionCost = uniqueResults.reduce(
            (sum, res) => sum + Number(res.sessionCost || 0),
            0
      );

      const totalPaid = uniqueResults.reduce((sum, res) => {
            // دور على الـ appointments اللي تخص نفس الـ session
            const payments = appointments
                  .flatMap(a => a.payments || [])
                  .filter(p => p.sessionId === res.id);

            const paidAmount = payments.reduce(
                  (s, p) => s + Number(p.amount || 0),
                  0
            );

            return sum + paidAmount;
      }, 0);

      const totalRemaining = totalSessionCost - totalPaid;

      useEffect(() => {
            fetchAppointments();
      }, [fetchAppointments]);

      const schema = z.object({
            report: z.string().min(1, "التقرير مطلوب"),
            nextAction: z.string().min(1, "الإجراء التالي مطلوب"),
            sessionCost: z.any().optional(),

            medications: z.array(z.object({
                  name: z.string().optional(),
                  startDate: z.string().optional(),
                  endDate: z.string().optional(),
                  times: z.string().optional(),
            })).optional(),

            radiology: z.array(z.object({
                  name: z.string().optional(),
                  notes: z.string().optional(),
            })).optional(),

            labTests: z.array(z.object({
                  name: z.string().optional(),
                  notes: z.string().optional(),
            })).optional(),
      });


      const {
            register,
            handleSubmit,
            formState: { errors },
            control
      } = useForm({
            resolver: zodResolver(schema),
            defaultValues: {
                  report: "",
                  nextAction: "",
                  sessionCost: 0,
                  pharmaceutical: "",
                  medications: [{ name: "", startDate: "", endDate: "", times: "" }],
                  radiology: [{ name: "", notes: "" }],
                  labTests: [{ name: "", notes: "" }]
            },
      });

      const onSubmit = async (data, e) => {
            try {
                  const token = localStorage.getItem("token");
                  setUploading(true);
                  setLoading(true);

                  const formData = new FormData();
                  formData.append("report", data.report);
                  formData.append("nextAction", data.nextAction);
                  formData.append("sessionCost", data.sessionCost);
                  formData.append("userId", userId);
                  formData.append("medicalCenterId", medicalCenterId);
                  formData.append("medications", JSON.stringify(data.medications));
                  formData.append("radiology", JSON.stringify(data.radiology));
                  formData.append("labTests", JSON.stringify(data.labTests));



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

                  e.target.reset();
                  setFiles([]);

                  // ✅ تحديث الجدول تلقائي
                  await fetchAppointments();

                  setUploadingId(null);
                  setLoading(false);
            } catch (err) {
                  setLoading(false);
                  console.error("- خطأ أثناء رفع النتيجة:", err);
                  Swal.fire("خطأ", "حدث خطأ أثناء الرفع", "error");
            } finally {
                  setLoading(false);
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

      // لينك صفحة المريض

      const [payingSession, setPayingSession] = useState(null);
      const [paymentData, setPaymentData] = useState({
            amount: "",
            paymentMethod: "cash",
            notes: ""
      });

      const handlePayment = async ({
            payingSession,
            paymentData,
            apiUrl,
            fetchAppointments,
            setPayingSession,
            setPaymentData
      }) => {
            try {
                  setLoading(true);
                  const token = localStorage.getItem("token");
                  await axios.post(`${apiUrl}/addPayment`, {
                        appointmentId: payingSession.appointmentId,  // <<==== أهو
                        patientNationalId: payingSession.patientNationalId,
                        doctorId: userId,
                        sessionId: payingSession.sessionId,
                        amount: paymentData.amount,
                        paymentMethod: paymentData.paymentMethod,
                        notes: paymentData.notes,
                        medicalCenterId: medicalCenterId,
                  }, {
                        headers: { Authorization: `Bearer ${token}` }
                  });
                  setLoading(false);


                  Swal.fire("تم الدفع", "تم تسجيل الدفع بنجاح 💰", "success");

                  setPayingSession(null);
                  setPaymentData({ amount: "", paymentMethod: "cash", notes: "" });

                  await fetchAppointments(); // تحديث بعد الدفع

            } catch {
                  setLoading(false);
                  Swal.fire("خطأ", "حدث خطأ أثناء الدفع", "error");
            }
      };


      const { fields: medFields, append: addMedication } = useFieldArray({ control, name: "medications" });
      const { fields: radFields, append: addRadiology } = useFieldArray({ control, name: "radiology" });
      const { fields: labFields, append: addLabTest } = useFieldArray({ control, name: "labTests" });



      return (
            <>
                  <section className="table overflow-auto">
                        <table
                              className="table table-bordered table-striped text-center"
                              style={{ width: "100%", minWidth: "1050px" }}
                        >
                              <thead className="table-dark" style={{ verticalAlign: "middle" }}>
                                    <tr>
                                          <th>#</th>
                                          <th>التقرير</th>
                                          <th>الإجراء التالي</th>
                                          <th>الملفات</th>
                                          <th>مبلغ الجلسة</th>
                                          <th>المدفوع</th>
                                          <th>المتبقي</th>
                                          <th>تاريخ الإضافة</th>
                                          <th>اضافة تقرير</th>
                                          <th>الدفع</th>
                                    </tr>
                              </thead>
                              <tbody style={{ verticalAlign: "middle" }}>
                                    {appointments.length > 0 ? (
                                          appointments.map((r, idx) => (
                                                <tr key={r.id}>


                                                      <td>{idx + 1}</td>

                                                      {/* التقرير */}
                                                      <td>

                                                            {r.result && r.result.length > 0 ? (
                                                                  [...new Map(r.result.map(item => [item.id, item])).values()].map((res) => (
                                                                        <div key={res.id}>{res.report}</div>
                                                                  ))
                                                            ) : (
                                                                  <span className="text-danger fw-bold">-</span>
                                                            )}
                                                      </td>


                                                      {/* الإجراء التالي */}
                                                      <td>
                                                            {r.result && r.result.length > 0 ? (
                                                                  [...new Map(r.result.map(item => [item.id, item])).values()].map((res) => (
                                                                        <div key={res.id}>{res.nextAction}</div>
                                                                  ))
                                                            ) : (
                                                                  <span className="text-danger fw-bold">-</span>
                                                            )}
                                                      </td>


                                                      {/* الملفات */}
                                                      <td>
                                                            {r.result && r.result.length > 0 ? (
                                                                  <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "center" }}>
                                                                        {[...new Map(r.result.map(item => [item.id, item])).values()].map((res, idx) =>
                                                                              Array.isArray(res.files) && res.files.length > 0 ? (
                                                                                    res.files.map((file, i) =>
                                                                                          file.toLowerCase().endsWith(".pdf") ? (
                                                                                                <a key={`${idx}-${i}`} href={file} target="_blank" rel="noopener noreferrer">
                                                                                                      <img src={pdfImage} alt="PDF" style={{ width: 40, height: 40, cursor: "pointer" }} />
                                                                                                </a>
                                                                                          ) : (
                                                                                                <img
                                                                                                      key={`${idx}-${i}`}
                                                                                                      src={file}
                                                                                                      alt="file"
                                                                                                      style={{ width: 50, height: 50, objectFit: "cover", borderRadius: 5, cursor: "pointer" }}
                                                                                                      onClick={() => openGallery(res.files, i)}
                                                                                                />
                                                                                          )
                                                                                    )
                                                                              ) : (
                                                                                    <span key={res.id} className="text-danger fw-bold">-</span>
                                                                              )
                                                                        )}
                                                                  </div>
                                                            ) : (
                                                                  <span className="text-danger fw-bold">-</span>
                                                            )}
                                                      </td>


                                                      {/* مبلغ الجلسة */}
                                                      <td>
                                                            {r.result && r.result.length > 0 ? (
                                                                  [...new Map(r.result.map(item => [item.id, item])).values()].map((res) => (
                                                                        <div key={res.id}>
                                                                              {res.sessionCost ? Number(res.sessionCost).toLocaleString() : '0'}
                                                                        </div>
                                                                  ))
                                                            ) : (
                                                                  <div>0</div>
                                                            )}
                                                      </td>

                                                      {/* المدفوع */}
                                                      <td>
                                                            {r.result && r.result.length > 0 ? (
                                                                  [...new Map(r.result.map(item => [item.id, item])).values()].map((res) => {
                                                                        const paymentsForSession = r.payments?.filter(p => p.sessionId === res.id) || [];
                                                                        const paidAmount = paymentsForSession.reduce((sum, p) => sum + Number(p.amount || 0), 0);

                                                                        return (
                                                                              <div key={res.id}>
                                                                                    <span
                                                                                          style={{ cursor: "pointer" }}
                                                                                          className="fw-bold"
                                                                                          onClick={() =>
                                                                                                setPaymentModal({
                                                                                                      isOpen: true,
                                                                                                      payments: paymentsForSession,
                                                                                                })
                                                                                          }
                                                                                    >
                                                                                          {paidAmount.toLocaleString()}
                                                                                    </span>
                                                                              </div>
                                                                        );
                                                                  })
                                                            ) : (
                                                                  <div>0</div>
                                                            )}
                                                            <Modal
                                                                  show={paymentModal.isOpen}
                                                                  onHide={() => setPaymentModal({ isOpen: false, payments: [] })}
                                                                  centered
                                                                  size="lg"
                                                                  className="pe-0"
                                                            >
                                                                  <Modal.Header>
                                                                        <Modal.Title>تفاصيل المدفوعات</Modal.Title>
                                                                  </Modal.Header>
                                                                  <Modal.Body style={{ maxHeight: "70vh", overflowY: "auto" }}>
                                                                        {paymentModal.payments.length > 0 ? (
                                                                              <Table bordered striped>
                                                                                    <thead>
                                                                                          <tr style={{ textAlign: "center", verticalAlign: "middle" }}>
                                                                                                <th>طريقة الدفع</th>
                                                                                                <th>المبلغ</th>
                                                                                                <th>التاريخ</th>
                                                                                                <th>ملاحظات</th>
                                                                                          </tr>
                                                                                    </thead>
                                                                                    <tbody>
                                                                                          {paymentModal.payments
                                                                                                .filter(p => p) // ✅ فلترة العناصر غير الموجودة
                                                                                                .slice()
                                                                                                .sort((a, b) => new Date(b.paymentdate) - new Date(a.paymentdate))
                                                                                                .map((p) => (
                                                                                                      <tr key={p.id} style={{ textAlign: "center", verticalAlign: "middle" }}>
                                                                                                            <td>{p.paymentMethod}</td>
                                                                                                            <td>{Number(p.amount).toLocaleString()}</td>
                                                                                                            <td dir="ltr">{formatUtcDateTime(p.paymentdate, "DD/MM/YYYY - hh:mm A")}</td>
                                                                                                            <td>{p.notes || "-"}</td>
                                                                                                      </tr>
                                                                                                ))}
                                                                                    </tbody>

                                                                              </Table>
                                                                        ) : (
                                                                              <p className="text-center text-danger">لا توجد مدفوعات</p>
                                                                        )}
                                                                  </Modal.Body>
                                                                  <Modal.Footer>
                                                                        <Button variant="secondary" onClick={() => setPaymentModal({ isOpen: false, payments: [] })}>
                                                                              غلق
                                                                        </Button>
                                                                  </Modal.Footer>
                                                            </Modal>
                                                      </td>
                                                      {/* Modal */}


                                                      {/* المتبقي */}
                                                      <td>
                                                            {r.result && r.result.length > 0 ? (
                                                                  [...new Map(r.result.map(item => [item.id, item])).values()].map((res) => {
                                                                        const paymentsForSession = r.payments?.filter(p => p.sessionId === res.id) || [];
                                                                        const paidAmount = paymentsForSession.reduce((sum, p) => sum + Number(p.amount || 0), 0);
                                                                        const remaining = res.sessionCost ? Number(res.sessionCost) - paidAmount : 0;

                                                                        return <div key={res.id}>{remaining.toLocaleString()}</div>;
                                                                  })
                                                            ) : (
                                                                  <div>0</div>
                                                            )}
                                                      </td>


                                                      {/* تاريخ الإضافة */}
                                                      <td dir="ltr">{formatUtcDateTime(r.resultCreatedAt || r.createdAt)}</td>

                                                      {/* زر إضافة تقرير */}
                                                      <td>
                                                            <button
                                                                  className="btn btn-sm btn-warning"
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
                                                                        <div className="modal-dialog modal-dialog-centered modal-xl w-100">
                                                                              <div className="modal-content p-3">
                                                                                    <form onSubmit={handleSubmit(onSubmit)}>
                                                                                          <h3 className="mb-3 fw-bold">رفع تقرير الحالة</h3>
                                                                                          <Row className="mb-2">
                                                                                                <Col xs={12} md={6} className='p-1'>
                                                                                                      <p className="text-end fw-bold mb-1">التقرير</p>
                                                                                                      <textarea
                                                                                                            className="form-control"
                                                                                                            placeholder="التقرير"
                                                                                                            rows={2}
                                                                                                            {...register("report")}
                                                                                                      />
                                                                                                      {errors.report && <p className="text-danger">{errors.report.message}</p>}
                                                                                                </Col>

                                                                                                <Col xs={12} md={6} className='p-1'>
                                                                                                      <p className="text-end fw-bold mb-1">الإجراء التالي</p>
                                                                                                      <textarea
                                                                                                            className="form-control"
                                                                                                            placeholder="الإجراء التالي"
                                                                                                            rows={2}
                                                                                                            {...register("nextAction")}
                                                                                                      />
                                                                                                      {errors.nextAction && (
                                                                                                            <p className="text-danger">{errors.nextAction.message}</p>
                                                                                                      )}
                                                                                                </Col>
                                                                                          </Row>

                                                                                          {/* الأدوية */}
                                                                                          <Row className='mb-2 border p-2 rounded'>
                                                                                                <p className='text-end fw-bold mb-1'>وصف الأدوية</p>
                                                                                                {medFields.map((item, index) => (
                                                                                                      <Row className="mb-3" key={item.id}>
                                                                                                            <Col md={3} className='p-1'>
                                                                                                                  <label>اسم الدواء</label>
                                                                                                                  <input type="text" placeholder="اسم الدواء" className="form-control" {...register(`medications.${index}.name`)} />
                                                                                                            </Col>
                                                                                                            <Col md={3} className='p-1'>
                                                                                                                  <label >من يوم</label>
                                                                                                                  <input type="date" className="form-control"  {...register(`medications.${index}.startDate`)} />
                                                                                                            </Col>
                                                                                                            <Col md={3} className='p-1'>
                                                                                                                  <label >الي يوم</label>
                                                                                                                  <input type="date" className="form-control"  {...register(`medications.${index}.endDate`)} />
                                                                                                            </Col>
                                                                                                            <Col md={3} className='p-1'>
                                                                                                                  <label >أوقات الدواء</label>
                                                                                                                  <input type="text" placeholder="أوقات الدواء" className="form-control" {...register(`medications.${index}.times`)} />
                                                                                                            </Col>
                                                                                                      </Row>
                                                                                                ))}
                                                                                                <Button type="button" className='bg-warning border-0' onClick={() => addMedication({ name: "", startDate: "", endDate: "", times: "" })}>
                                                                                                      إضافة دواء آخر
                                                                                                </Button>
                                                                                          </Row>

                                                                                          {/* الأشعة */}
                                                                                          <Row className='mb-2'>
                                                                                                <Col xs={12} md={6}>
                                                                                                      <div className="rounded border p-1">
                                                                                                            <p className='text-end fw-bold mb-1'>طلب اشعة</p>
                                                                                                            {radFields.map((item, index) => (
                                                                                                                  <Row className="mb-3" key={item.id}>
                                                                                                                        <Col md={6} className='p-1'>
                                                                                                                              <input type="text" placeholder="اسم الأشعة" className="form-control" {...register(`radiology.${index}.name`)} />
                                                                                                                        </Col>
                                                                                                                        <Col md={6} className='p-1'>
                                                                                                                              <input type="text" placeholder="ملاحظات" className="form-control" {...register(`radiology.${index}.notes`)} />
                                                                                                                        </Col>
                                                                                                                  </Row>
                                                                                                            ))}
                                                                                                            <Button type="button" className='bg-warning border-0 w-100' onClick={() => addRadiology({ name: "", date: "", notes: "" })}>
                                                                                                                  إضافة أشعة أخرى
                                                                                                            </Button>
                                                                                                      </div>
                                                                                                </Col>

                                                                                                {/* التحاليل */}
                                                                                                <Col xs={12} md={6}>
                                                                                                      <div className="rounded border p-1">
                                                                                                            <p className='text-end fw-bold mb-1'>طلب تحليل</p>
                                                                                                            {labFields.map((item, index) => (
                                                                                                                  <Row className="mb-3" key={item.id}>
                                                                                                                        <Col md={6} className='p-1'>
                                                                                                                              <input type="text" placeholder="اسم التحليل" className="form-control" {...register(`labTests.${index}.name`)} />
                                                                                                                        </Col>
                                                                                                                        <Col md={6} className='p-1'>
                                                                                                                              <input type="text" placeholder="ملاحظات" className="form-control" {...register(`labTests.${index}.notes`)} />
                                                                                                                        </Col>
                                                                                                                  </Row>
                                                                                                            ))}
                                                                                                            <Button type="button" className='bg-warning border-0 w-100' onClick={() => addLabTest({ name: "", date: "", notes: "" })}>
                                                                                                                  إضافة تحليل آخر
                                                                                                            </Button>
                                                                                                      </div>
                                                                                                </Col>
                                                                                          </Row>


                                                                                          <Row className="mb-2">
                                                                                                <p className='text-end fw-bold mb-1'>تكلفة الجلسة</p>

                                                                                                <input
                                                                                                      type="number"
                                                                                                      className="form-control"
                                                                                                      placeholder="تكلفة الجلسة"
                                                                                                      {...register("sessionCost")}
                                                                                                />

                                                                                          </Row>

                                                                                          <Row className="mb-2">
                                                                                                <p className="text-end fw-bold mb-1">إضافة ملفات / صور</p>
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

                                                      {/* الدفع */}
                                                      <td>
                                                            {r.result && r.result.length > 0 ? (() => {
                                                                  const allRemaining = r.result.map((res) => {
                                                                        const paymentsForSession = r.payments?.filter(p => p.sessionId === res.id) || [];
                                                                        const paidAmount = paymentsForSession.reduce((sum, p) => sum + Number(p.amount || 0), 0);
                                                                        return res.sessionCost ? Number(res.sessionCost) - paidAmount : 0;
                                                                  });

                                                                  const hasRemaining = allRemaining.some(x => x > 0);

                                                                  return (
                                                                        <button
                                                                              className="btn btn-sm btn-primary"
                                                                              disabled={!hasRemaining}
                                                                              onClick={() => {
                                                                                    if (!hasRemaining) return;

                                                                                    const target = r.result.find((res, i) => allRemaining[i] > 0);
                                                                                    const remaining = allRemaining[r.result.indexOf(target)];

                                                                                    setPayingSession({
                                                                                          appointmentId: r.id,
                                                                                          sessionId: target.id,
                                                                                          patientNationalId: r.nationalId,
                                                                                          doctorId: r.doctorId,
                                                                                          remaining: remaining
                                                                                    });
                                                                              }}

                                                                        >
                                                                              دفع
                                                                        </button>
                                                                  );
                                                            })() : <span className="text-danger fw-bold">-</span>}
                                                      </td>
                                                </tr>
                                          ))
                                    ) : (
                                          <tr>
                                                <td colSpan="10" className="text-center">
                                                      لا توجد بيانات
                                                </td>
                                          </tr>
                                    )}
                              </tbody>
                              <tfoot>
                                    <tr className="table-dark fw-bold">
                                          <td colSpan="4"></td>
                                          <td>{totalSessionCost.toLocaleString()}</td>
                                          <td>{totalPaid.toLocaleString()}</td>
                                          <td>{totalRemaining.toLocaleString()}</td>
                                          <td colSpan="3"></td>
                                    </tr>
                              </tfoot>
                        </table>
                  </section>


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

                  {payingSession && (
                        <div className="modal fade show d-block" style={{ background: "rgba(0,0,0,0.4)" }}>
                              <div className="modal-dialog modal-dialog-centered">
                                    <div className="modal-content p-3">

                                          <h3 className="mb-3 fw-bold">دفع مبلغ الجلسة</h3>

                                          <Row className="mb-4 p-2">
                                                <h4 className="text-end fw-bold">المبلغ المدفوع</h4>
                                                <input
                                                      type="number"
                                                      className="form-control"
                                                      max={payingSession.remaining} // أقصى مبلغ ممكن
                                                      value={paymentData.amount}
                                                      onChange={(e) => {
                                                            let val = Number(e.target.value);
                                                            if (val > payingSession.remaining) val = payingSession.remaining; // منع الزيادة
                                                            if (val < 0) val = 0; // منع القيم السالبة
                                                            setPaymentData({ ...paymentData, amount: val });
                                                      }}
                                                />
                                                <small className="text-muted">أقصى مبلغ متبقي: {payingSession.remaining.toLocaleString()} جنيه</small>
                                          </Row>

                                          <Row className="mb-4 p-2">
                                                <h4 className="fw-bold">طريقة الدفع</h4>
                                                <select
                                                      className="form-control"
                                                      value={paymentData.paymentMethod}
                                                      onChange={(e) => setPaymentData({ ...paymentData, paymentMethod: e.target.value })}
                                                >
                                                      <option value="cash">كاش</option>
                                                      <option value="visa">فيزا</option>
                                                      <option value="transfer">تحويل</option>
                                                </select>
                                          </Row>

                                          <Row className="mb-4 p-2">
                                                <h4 className="fw-bold">ملاحظات (اختياري)</h4>
                                                <textarea
                                                      className="form-control"
                                                      rows="2"
                                                      value={paymentData.notes}
                                                      onChange={(e) => setPaymentData({ ...paymentData, notes: e.target.value })}
                                                ></textarea>
                                          </Row>

                                          <div className="d-flex justify-content-end gap-2">

                                                <button
                                                      className="btn btn-secondary"
                                                      onClick={() => setPayingSession(null)}
                                                >
                                                      إلغاء
                                                </button>

                                                <button
                                                      className="btn btn-success"
                                                      onClick={() =>
                                                            handlePayment({
                                                                  payingSession,
                                                                  paymentData,
                                                                  apiUrl,
                                                                  fetchAppointments,
                                                                  setPayingSession,
                                                                  setPaymentData
                                                            })
                                                      }
                                                      disabled={loading || paymentData.amount <= 0}
                                                >
                                                      {loading ? "جاري الدفع..." : "تأكيد الدفع"}
                                                </button>
                                          </div>
                                    </div>
                              </div>
                        </div>
                  )}
            </>
      )
}
