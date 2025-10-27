import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Col, Form, Row } from "react-bootstrap";
import api from "../../lib/api";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";

const schema = z.object({
      testName: z.string().min(1, "اسم الآشعة / التحليل مطلوب"),
      caseName: z.string().min(1, "اسم الحالة مطلوب"),
      phone: z.string().min(1, "رقم الهاتف مطلوب"),
      nationalId: z.string().optional()
});

export default function StafAddAppointment() {
      const [doctors, setDoctors] = useState([]);
      const [search, setSearch] = useState("");
      const [filteredDoctors, setFilteredDoctors] = useState([]);
      const [selectedDoctor, setSelectedDoctor] = useState(null);
      const [showList, setShowList] = useState(false);
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

      useEffect(() => {
            const fetchDoctors = async () => {
                  try {
                        const res = await api.get("/doctors");
                        setDoctors(res.data);
                  } catch (err) {
                        console.error("Error fetching doctors:", err);
                  }
            };
            fetchDoctors();
      }, []);


      const handleSearch = (e) => {
            const value = e.target.value;
            setSearch(value);

            if (value.trim() === "") {
                  setFilteredDoctors([]);
                  setShowList(false);
                  return;
            }

            const results = doctors.filter((doc) =>
                  doc.fullName.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredDoctors(results);
            setShowList(true);
      };

      const handleSelectDoctor = (doc) => {
            setSearch(doc.fullName);
            setSelectedDoctor(doc.doctorId);
            setShowList(false);
      };

      const onSubmit = async (data) => {
            try {
                  if (!selectedDoctor) {
                        toast.error("من فضلك اختر اسم الدكتور أولاً");
                        return;
                  }

                  setLoading(true);
                  const user = JSON.parse(localStorage.getItem("user"));
                  const token = localStorage.getItem("token");

                  const payload = {
                        ...data,
                        userId: user?.id,
                        doctorId: selectedDoctor, // ✅ هنا أضفنا الـ doctorId
                  };

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

                        {/* اسم الدكتور */}
                        <Row className="mb-4 p-2 position-relative">
                              <h4 className="text-end fw-bold">اسم الدكتور</h4>

                              <input
                                    type="text"
                                    className="form-control"
                                    placeholder="ابحث عن الدكتور..."
                                    value={search}
                                    onChange={handleSearch}
                                    onFocus={() => filteredDoctors.length > 0 && setShowList(true)}
                              />

                              {showList && (
                                    <ul
                                          className="list-group position-absolute w-100 mt-1 shadow-sm"
                                          style={{ zIndex: 10, maxHeight: "200px", overflowY: "auto" }}
                                    >
                                          {filteredDoctors.length > 0 ? (
                                                filteredDoctors.map((doc) => (
                                                      <li
                                                            key={doc.doctorId}
                                                            className="list-group-item list-group-item-action"
                                                            onClick={() => handleSelectDoctor(doc)}
                                                            style={{ cursor: "pointer" }}
                                                      >
                                                            {doc.fullName}
                                                      </li>
                                                ))
                                          ) : (
                                                <li className="list-group-item text-muted">لا يوجد نتائج</li>
                                          )}
                                    </ul>
                              )}
                        </Row>

                        <button className="btn btn-primary px-4 py-2 w-100" type="submit" disabled={loading}>
                              {loading ? "جاري الإرسال..." : "إضافة الحجز"}
                        </button>
                  </form>
            </section>
      );
}
