import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Row } from "react-bootstrap";
import api from "../../lib/api";
import { toast } from "react-toastify";
import { useCallback, useEffect, useState } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { getAppointments } from "../../api";
import { useMemo } from "react";


dayjs.extend(utc);
dayjs.extend(timezone);

const schema = z.object({
      caseName: z.string().min(1, "اسم الحالة مطلوب"),
      phone: z.string().min(1, "رقم الهاتف مطلوب"),
      dateTime: z.string().min(1, "التاريخ والوقت مطلوب"),
      nationalId: z.string().optional(),
      birthDate: z.string().optional(),
      hasChronicDisease: z.boolean().optional(),
      chronicDiseaseDetails: z.string().optional(),
      isRevisit: z.boolean().optional(),
      price: z
            .union([
                  z.coerce.number()
                        .refine((val) => !isNaN(val), { message: "سعر الكشف مطلوب" })
                        .min(0, "سعر الكشف لا يمكن أن يكون سالبًا"),
                  z.literal("").transform(() => null),
                  z.null(),
                  z.undefined(),
            ]),
});

export default function DoctorAddAppointments() {
      const [loading, setLoading] = useState(false);
      const user = JSON.parse(localStorage.getItem("user"));
      const userId = user?.id;
      const medicalCenterId = user?.medicalCenterId;
      const [appointments, setAppointments] = useState([]);
      const [phoneMatches, setPhoneMatches] = useState([]);
      const [nidMatches, setNidMatches] = useState([]);
      const [showSuggestions, setShowSuggestions] = useState(false);



      const fetchAppointments = useCallback(async () => {
            try {
                  setLoading(true);
                  const data = await getAppointments(userId, medicalCenterId);
                  setAppointments(data);

            } catch (err) {
                  console.error("Error fetching appointments", err);
            } finally {
                  setLoading(false);
            }
      }, [userId, medicalCenterId]);

      useEffect(() => {
            fetchAppointments();
      }, [fetchAppointments]);

      const normalizePhone = (v) => String(v ?? "").replace(/\s+/g, "").trim();
      const normalizeNID = (v) => String(v ?? "").replace(/\s+/g, "").trim();


      const pickPatientFields = (appt) => ({
            caseName: appt.caseName || "",
            phone: appt.phone || "",
            nationalId: appt.nationalId || "",
            // birthDate عندك جاية ISO، نخليها YYYY-MM-DD عشان input date
            birthDate: appt.birthDate ? dayjs(appt.birthDate).format("YYYY-MM-DD") : "",
            hasChronicDisease: !!appt.hasChronicDisease,
            chronicDiseaseDetails: appt.chronicDiseaseDetails || "",
            isRevisit: !!appt.isRevisit,
      });

      const patients = useMemo(() => {
            // هنطلع patients unique على أساس phone + nationalId + caseName (أو أي مفتاح يعجبك)
            const seen = new Set();
            const list = [];

            for (const appt of appointments || []) {
                  const phone = normalizePhone(appt?.phone);
                  const nid = normalizeNID(appt?.nationalId);
                  const name = String(appt?.caseName ?? "").trim();

                  if (!phone && !nid) continue;

                  const key = `${phone}|${nid}|${name}`;// يضمن uniqueness بشكل معقول
                  if (seen.has(key)) continue;
                  seen.add(key);

                  list.push({
                        key,
                        id: appt.id,
                        phone,
                        nationalId: nid,
                        name,
                        data: pickPatientFields(appt),
                  });
            }

            return list;
      }, [appointments]);

      const applyPatient = (p) => {
            // عبّي البيانات القديمة
            setValue("caseName", p.data.caseName, { shouldValidate: true });
            setValue("phone", p.data.phone, { shouldValidate: true });
            setValue("nationalId", p.data.nationalId, { shouldValidate: true });
            setValue("birthDate", p.data.birthDate);
            setValue("hasChronicDisease", p.data.hasChronicDisease);
            setValue("chronicDiseaseDetails", p.data.chronicDiseaseDetails);
            setValue("isRevisit", p.data.isRevisit);

            // اقفل الليست
            setShowSuggestions(false);

            // لو عايز كمان تمسح الماتشز:
            setPhoneMatches([]);
            setNidMatches([]);
      };


      // تحديث الوقت الحالي كل ثانية
      const [currentDateTime, setCurrentDateTime] = useState(
            dayjs().format("YYYY-MM-DDTHH:mm")
      );

      useEffect(() => {
            const interval = setInterval(() => {
                  setCurrentDateTime(dayjs().format("YYYY-MM-DDTHH:mm"));
            }, 1000);
            return () => clearInterval(interval);
      }, []);

      const { register, setValue, handleSubmit, watch, formState: { errors } } = useForm({
            resolver: zodResolver(schema),
            defaultValues: {
                  caseName: "",
                  phone: "",
                  nationalId: "",
                  birthDate: "",
                  hasChronicDisease: false,
                  isRevisit: false,
                  chronicDiseaseDetails: "",
                  dateTime: currentDateTime,
                  price: "",
            },
      });

      const watchChronic = watch("hasChronicDisease", false);

      const onSubmit = async (data) => {
            try {
                  setLoading(true);
                  const user = JSON.parse(localStorage.getItem("user"));
                  const token = localStorage.getItem("token");

                  // تحويل الوقت المحلي إلى UTC قبل الإرسال للباك
                  const utcDateTime = dayjs(data.dateTime).utc().format();

                  const payload = {
                        ...data,
                        dateTime: utcDateTime,
                        userId: user?.medicalCenterId,
                  };

                  const response = await api.post(`/appointments`, payload, {
                        headers: {
                              Authorization: `Bearer ${token}`,
                        },
                  });

                  if (response.data.message === "success") {
                        setValue("caseName", "");
                        setValue("phone", "");
                        setValue("nationalId", "");
                        setValue("birthDate", "");
                        setValue("hasChronicDisease", "");
                        setValue("chronicDiseaseDetails", "");
                        setValue("isRevisit", "");
                        setLoading(false);
                        toast.success("✅ تم تسجيل الحجز بنجاح");
                  }
            } catch (err) {
                  setLoading(false);
                  console.error("❌ خطأ أثناء تسجيل الحجز:", err);
                  toast.error("حصل خطأ أثناء تسجيل الحجز");
            }
      };

      const watchNationalId = watch("nationalId");

      useEffect(() => {
            const id = watchNationalId;
            if (id && id.length === 14) {
                  const centuryCode = Number(id[0]);
                  const yearCode = id.slice(1, 3);
                  const monthCode = id.slice(3, 5);
                  const dayCode = id.slice(5, 7);

                  let century = 0;
                  if (centuryCode === 2) century = 1900;
                  else if (centuryCode === 3) century = 2000;

                  const year = century + Number(yearCode);
                  const month = Number(monthCode);
                  const day = Number(dayCode);

                  // صياغة yyyy-mm-dd عشان input type=date يقبلها
                  const birthDateStr = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

                  // تعيين القيمة في الفورم
                  setValue("birthDate", birthDateStr);
            }
      }, [watchNationalId, setValue]);

      return (
            <section className="staf-add-appointment">
                  <h4 className="fw-bold">إضافة حجز جديد</h4>
                  <form className="p-2 border rounded" onSubmit={handleSubmit(onSubmit)}>
                        <Row className="mb-4 p-2">
                              {/* رقم الهاتف */}
                              <Row className="mb-4 p-2 position-relative">
                                    <h4 className="text-end fw-bold">رقم الهاتف</h4>

                                    <input
                                          className="form-control"
                                          autoComplete="off"
                                          placeholder="رقم الهاتف"
                                          {...register("phone", {
                                                onChange: (e) => {
                                                      const value = normalizePhone(e.target.value);

                                                      if (value.length < 6) { // حد أدنى عشان متبقاش بتفرفر
                                                            setPhoneMatches([]);
                                                            return;
                                                      }

                                                      const matches = patients.filter(p => p.phone && p.phone.includes(value));
                                                      setPhoneMatches(matches);
                                                      setShowSuggestions(true);
                                                },
                                          })}
                                    />

                                    {errors.phone && <p className="text-danger">{errors.phone.message}</p>}

                                    {showSuggestions && phoneMatches.length > 0 && (
                                          <div
                                                className="border rounded bg-white shadow position-absolute w-100"
                                                style={{ top: "100%", right: 0, zIndex: 50 }}
                                          >
                                                {phoneMatches.slice(0, 6).map((p) => (
                                                      <button
                                                            key={p.key}
                                                            type="button"
                                                            className="w-100 text-end btn btn-light border-0"
                                                            onClick={() => applyPatient(p)}
                                                      >
                                                            {p.name || "بدون اسم"} — {p.phone}
                                                      </button>
                                                ))}
                                          </div>
                                    )}
                              </Row>

                              <Row className="mb-4 p-2 position-relative">
                                    <h4 className="text-end fw-bold">اسم الحالة</h4>
                                    <input className="form-control" placeholder="اسم الحالة" {...register("caseName")} />
                                    {errors.caseName && <p className="text-danger">{errors.caseName.message}</p>}
                              </Row>

                              <Row className="mb-4 p-2 position-relative">
                                    <h4 className="text-end fw-bold">الرقم القومي (اختياري)</h4>

                                    <input
                                          className="form-control"
                                          placeholder="الرقم القومي"
                                          {...register("nationalId", {
                                                onChange: (e) => {
                                                      const value = normalizeNID(e.target.value);

                                                      if (value.length < 10) {
                                                            setNidMatches([]);
                                                            return;
                                                      }

                                                      const matches = patients.filter(p => p.nationalId && p.nationalId.includes(value));
                                                      setNidMatches(matches);
                                                      setShowSuggestions(true);
                                                },
                                          })}
                                    />

                                    {showSuggestions && nidMatches.length > 0 && (
                                          <div
                                                className="border rounded bg-white shadow position-absolute w-100"
                                                style={{ top: "100%", right: 0, zIndex: 50 }}
                                          >
                                                {nidMatches.slice(0, 6).map((p) => (
                                                      <button
                                                            key={p.key}
                                                            type="button"
                                                            className="w-100 text-end btn btn-light border-0"
                                                            onClick={() => applyPatient(p)}
                                                      >
                                                            {p.name || "بدون اسم"} — {p.nationalId}
                                                      </button>
                                                ))}
                                          </div>
                                    )}
                              </Row>


                              {/* تاريخ الميلاد */}
                              <Row className="mb-4 p-2">
                                    <h4 className="text-end fw-bold">تاريخ الميلاد</h4>
                                    <input type="date" className="form-control" {...register("birthDate")} />
                              </Row>

                              {/* التاريخ / الوقت */}
                              <Row className="mb-4 p-2">
                                    <h4 className="text-end fw-bold"> تاريخ / وقت الحجز (اختياري)</h4>
                                    <input type="datetime-local" className="form-control" {...register("dateTime")} />
                                    {errors.dateTime && <p className="text-danger">{errors.dateTime.message}</p>}
                              </Row>

                              <Row className="mb-4 p-2">
                                    <div className="form-check text-end">
                                          <label className="form-check-label" htmlFor="revisitCheckbox">
                                                إعادة كشف ؟
                                          </label>
                                          <input
                                                type="checkbox"
                                                className="form-check-input"
                                                id="revisitCheckbox"
                                                {...register("isRevisit")}
                                          />
                                    </div>
                              </Row>

                              {/* سعر الكشف */}
                              <Row className="mb-4 p-2">
                                    <h4 className="text-end fw-bold">سعر الكشف</h4>
                                    <input type="number" className="form-control" placeholder="سعر الكشف" {...register("price")} />
                                    {errors.price && <p className="text-danger">{errors.price.message}</p>}
                              </Row>

                              {/* أمراض مزمنة */}
                              <Row className="mb-4 p-2">
                                    <div className="form-check text-end">
                                          <label className="form-check-label" htmlFor="chronicDiseaseCheckbox">
                                                يعاني من أمراض مزمنة
                                          </label>
                                          <input
                                                type="checkbox"
                                                className="form-check-input"
                                                {...register("hasChronicDisease")}
                                                id="chronicDiseaseCheckbox"
                                          />
                                    </div>
                              </Row>

                              {/* خانة تفاصيل المرض تظهر لو checkbox مفعل */}
                              {watchChronic && (
                                    <Row className="mb-4 p-2">
                                          <h4 className="text-end fw-bold">تفاصيل المرض المزمن</h4>
                                          <input
                                                type="text"
                                                className="form-control"
                                                placeholder="اكتب تفاصيل المرض"
                                                {...register("chronicDiseaseDetails")}
                                          />
                                    </Row>
                              )}

                              <button className="btn btn-primary px-4 py-2 w-100" type="submit" disabled={loading}>
                                    {loading ? "جاري الإرسال..." : "إضافة الحجز"}
                              </button>
                        </Row>
                  </form>
            </section>
      );
}
