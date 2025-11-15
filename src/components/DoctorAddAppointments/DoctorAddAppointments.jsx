import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Row } from "react-bootstrap";
import api from "../../lib/api";
import { toast } from "react-toastify";
import { useState } from "react";

const schema = z.object({
      caseName: z.string().min(1, "اسم الحالة مطلوب"),
      phone: z.string().min(1, "رقم الهاتف مطلوب"),
      dateTime: z.string().min(1, "التاريخ والوقت مطلوب"),
      nationalId: z.string().optional()
});

export default function DoctorAddAppointments() {
      const [loading, setLoading] = useState(false);
      const {
            register,
            handleSubmit,
            formState: { errors },
      } = useForm({
            resolver: zodResolver(schema),
            defaultValues: {
                  caseName: "",
                  phone: "",
                  nationalId: "",
                  dateTime: "",
            },
      });

      const onSubmit = async (data) => {
            try {

                  setLoading(true);
                  const user = JSON.parse(localStorage.getItem("user"));
                  const token = localStorage.getItem("token");

                  const payload = {
                        ...data,
                        userId: user?.id,
                  };

                  console.log("DATA RECEIVED:", data);

                  const response = await api.post(`/appointments`, payload, {
                        headers: {
                              Authorization: `Bearer ${token}`,
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

                        {/* رقم الهاتف */}
                        <Row className="mb-4 p-2">
                              <h4 className="text-end fw-bold">التاريخ / الوقت</h4>

                              <input
                                    type="datetime-local"
                                    className="form-control"
                                    {...register("dateTime", {
                                          required: "مطلوب إدخال التاريخ والوقت"
                                    })}
                              />

                              {errors.dateTime && (
                                    <p className="text-danger">{errors.dateTime.message}</p>
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
