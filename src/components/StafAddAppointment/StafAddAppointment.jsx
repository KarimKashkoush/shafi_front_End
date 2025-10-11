import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Row } from "react-bootstrap";
import api from "../../lib/api";
import { toast } from "react-toastify";
import { useState } from "react";

const schema = z.object({
      testName: z.string().min(1, "اسم الآشعة / التحليل مطلوب"),
      caseName: z.string().min(1, "اسم الحالة مطلوب"),
      phone: z.string().min(1, "رقم الهاتف مطلوب"),
      nationalId: z.string().optional()
});

export default function StafAddAppointment() {
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

      const onSubmit = async (data) => {
            try {
                  setLoading(true);
                  const user = JSON.parse(localStorage.getItem("user"));
                  const token = localStorage.getItem("token"); // 🟢 جلب التوكن

                  const payload = {
                        ...data,
                        userId: user?.id,
                  };

                  const response = await api.post(`/appointments`, payload, {
                        headers: {
                              Authorization: `Bearer ${token}`, // 🟢 إضافة التوكن هنا
                        },
                  });

                  if (response.data.message === "success") {
                        setLoading(false);
                        toast.success("✅ تم تسجيل الحجز بنجاح");
                  }
            } catch (err) {
                  setLoading(false);
                  console.error("❌ خطأ أثناء تسجيل الحجز:", err);
                  toast.error("حصل خطأ أثناء تسجيل الحجز");
            }
      };

      return (
            <section className="staf-add-appointment">
                  <h4 className="fw-bold">إضافة حجز جديد</h4>
                  <form
                        className="p-2 border rounded"
                        onSubmit={handleSubmit(onSubmit)}
                  >
                        {/* اسم الآشعة / التحليل */}
                        <Row className="mb-4 p-2">
                              <h4 className="text-end fw-bold">اسم الآشعة / التحليل</h4>
                              <input
                                    className="form-control"
                                    placeholder="اسم الآشعة / التحليل"
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

                        <button className="btn btn-primary px-4 py-2 w-100" type="submit" disabled={loading}>
                              {loading ? "جاري الإرسال..." : "إضافة الحجز"}
                        </button>
                  </form>
            </section>
      );
}
