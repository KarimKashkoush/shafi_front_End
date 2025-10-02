import { useState } from "react";
import { Form, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { toast } from "react-toastify";

const schema = z.object({
      testName: z.string().min(1, "اسم الآشعة / التحليل مطلوب"),
      caseName: z.string().min(1, "اسم الحالة مطلوب"),
      phone: z.string().min(1, "رقم الهاتف مطلوب"),
      nationalId: z.string().optional()
});
export default function StafAddResult() {
      const [files, setFiles] = useState([]);
      const [loading, setLoading] = useState(false);

      const {
            register,
            handleSubmit,
            formState: { errors },
      } = useForm({
            resolver: zodResolver(schema),
            defaultValues: {
                  testName: "",
                  caseName: "",
                  phone: "",
                  nationalId: "",
            },
      });

      const handleFileChange = (e) => {
            setFiles(Array.from(e.target.files));
      };

      const onSubmit = async (data) => {
            try {
                  const apiUrl = import.meta.env.VITE_API_URL;
                  const user = JSON.parse(localStorage.getItem("user"));
                  const formData = new FormData();
                  setLoading(true)

                  formData.append("caseName", data.caseName);
                  formData.append("phone", data.phone);
                  formData.append("nationalId", data.nationalId || "");
                  formData.append("testName", data.testName || "");
                  formData.append("userId", user?.id);
                  formData.append("createdAt", new Date().toISOString());

                  files.forEach((file) => {
                        formData.append("files", file);
                  });


                  const response = await axios.post(`${apiUrl}/staffAddResult`, formData, {
                        headers: { "Content-Type": "multipart/form-data" },
                  });

                  if (response.data.message === "success") {
                        setLoading(false)
                        toast.success("تم رفع النتيجة بنجاح 🎉");
                  }
            } catch (err) {
                  setLoading(false)
                  console.error("❌ خطأ أثناء رفع النتيجة:", err);
                  toast.error("حصل خطأ أثناء رفع النتيجة");
            }
      };

      return (
            <section className="staf-add-result">
                  <h4 className="fw-bold">إضافة نتيجة جديدة</h4>
                  <form
                        className="p-2 border rounded"
                        onSubmit={handleSubmit(onSubmit)}
                        encType="multipart/form-data"
                  >
                        {/* اسم الحالة */}
                        <Row className="mb-4 p-2">
                              <h4 className="text-end fw-bold">اسم الآشعة / التحليل</h4>
                              <input
                                    className="form-control"
                                    placeholder="اسم الآشعة  / التحليل"
                                    {...register("testName")}
                              />
                              {errors.testName && (
                                    <p className="text-danger">{errors.testName.message}</p>
                              )}
                        </Row>

                        {/* اسم الحالة */}
                        <Row className="mb-4 p-2">
                              <h4 className="text-end fw-bold">اسم الحالة</h4>
                              <input
                                    className="form-control"
                                    placeholder="اسم الحالة"
                                    {...register("caseName")}
                              />
                              {errors.caseName && (
                                    <p className="text-danger">{errors.caseName.message}</p>
                              )}
                        </Row>

                        {/* رقم الهاتف */}
                        <Row className="mb-4 p-2">
                              <h4 className="text-end fw-bold">رقم الهاتف</h4>
                              <input
                                    className="form-control"
                                    placeholder="رقم الهاتف"
                                    {...register("phone")}
                              />
                              {errors.phone && (
                                    <p className="text-danger">{errors.phone.message}</p>
                              )}
                        </Row>

                        {/* الرقم القومي (اختياري) */}
                        <Row className="mb-4 p-2">
                              <h4 className="text-end fw-bold">الرقم القومي</h4>
                              <input
                                    className="form-control"
                                    placeholder="الرقم القومي (اختياري)"
                                    {...register("nationalId")}
                              />
                        </Row>

                        {/* رفع الملفات */}
                        <Row className="mb-4 p-2">
                              <h4 className="text-end fw-bold">الملفات / التشخيص</h4>
                              <Form.Group className="mb-3">
                                    <Form.Control
                                          type="file"
                                          accept="image/*,application/pdf"
                                          multiple
                                          onChange={handleFileChange}
                                          style={{ display: "none" }}
                                          id="customFile"
                                    />
                                    <label
                                          htmlFor="customFile"
                                          className="btn fw-bold btn-warning"
                                          style={{ cursor: "pointer" }}
                                    >
                                          اختيار الملفات أو الصور
                                    </label>
                              </Form.Group>

                              {/* المعاينة */}
                              <div className="preview d-flex flex-wrap justify-content-center gap-3">
                                    {files.map((file, idx) => {
                                          const isImage = file.type.startsWith("image/");
                                          const isPDF = file.type === "application/pdf";

                                          if (isImage) {
                                                const imageUrl = URL.createObjectURL(file);
                                                return (
                                                      <img
                                                            key={idx}
                                                            src={imageUrl}
                                                            alt={file.name}
                                                            style={{
                                                                  width: 60,
                                                                  height: 60,
                                                                  objectFit: "cover",
                                                                  cursor: "pointer",
                                                                  borderRadius: 8,
                                                            }}
                                                            onClick={() => window.open(imageUrl)}
                                                      />
                                                );
                                          }
                                          if (isPDF) {
                                                const pdfUrl = URL.createObjectURL(file);
                                                return (
                                                      <div
                                                            key={idx}
                                                            onClick={() => window.open(pdfUrl)}
                                                            style={{
                                                                  width: 60,
                                                                  height: 60,
                                                                  display: "flex",
                                                                  justifyContent: "center",
                                                                  alignItems: "center",
                                                                  backgroundColor: "#f44336",
                                                                  color: "white",
                                                                  fontWeight: "bold",
                                                                  borderRadius: 8,
                                                                  cursor: "pointer",
                                                            }}
                                                      >
                                                            PDF
                                                      </div>
                                                );
                                          }
                                          return null;
                                    })}
                              </div>
                        </Row>

                        <button className="btn btn-primary px-4 py-2 w-100" type="submit" disabled={loading}>
                              {loading ? "جاري الإضافة..." : "إضافة النتيجة"}
                        </button>
                  </form>
            </section>
      );
}
