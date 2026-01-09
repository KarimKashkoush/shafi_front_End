import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import api from "../../lib/api";
import { calculateAgeUtc, formatUtcDate, formatUtcForInput } from "../../utils/date";
import { Row } from "react-bootstrap";


function mapUser(user) {
      return {
            id: user.id,
            fullName: user.fullName,
            phoneNumber: user.phoneNumber,
            email: user.email,
            nationalId: user.nationalId,
            gender: user.gender,
            blood: user.blood,
            role: user.role,
            emergencyNumber: user.emergencyNumber,
            address: user.address,
            birthDate: user.birthDate,
            createdAt: user.createdAt,
      };
}

export default function ProfileUserData() {
      const { id } = useParams(); // ✅ هنا بناخد الـ id من الـ URL
      const [show, setShow] = useState(false);
      const [showPassword, setShowPassword] = useState(false);
      const [data, setData] = useState(null);
      const [editMode, setEditMode] = useState(false);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState("");
      const [loadingPassword, setLoadingPassword] = useState(false);

      const {
            register,
            handleSubmit,
            formState: { errors },
            reset,
      } = useForm();

      useEffect(() => {
            const fetchUser = async () => {
                  try {
                        const res = await api.get(`/user/${id}`);
                        const mapped = mapUser(res.data.user);
                        setData(mapped);
                        reset(mapped);
                  } catch (err) {
                        console.error("خطأ في جلب بيانات المستخدم:", err);
                        setError("حدث خطأ أثناء تحميل البيانات");
                  } finally {
                        setLoading(false);
                  }
            };

            if (id) fetchUser();
      }, [id, reset]);

      const onChangePassword = async (formData) => {
            setLoadingPassword(true)
            if (formData.newPassword !== formData.confirmPassword) {
                  return alert("كلمة السر الجديدة غير متطابقة");
            }

            try {
                  await api.put(`/users/${id}/change-password`, {
                        currentPassword: formData.currentPassword,
                        newPassword: formData.newPassword,
                  });

                  alert("تم تغيير كلمة السر بنجاح");
                  setShowPassword(false);
                  reset();
            } catch (error) {
                  setLoadingPassword(false)
                  alert(error.response?.data?.message || "فشل تغيير كلمة السر");
            }
      };


      const onSubmit = async (formData) => {
            try {
                  const payload = {
                        fullName: formData.fullName,
                        phoneNumber: formData.phoneNumber,
                        email: formData.email,
                        gender: formData.gender,
                        blood: formData.blood,
                        emergencyNumber: formData.emergencyNumber,
                        nationalId: formData.nationalId,
                        address: formData.address,
                        birthDate: formData.birthDate,
                  };

                  const res = await api.put(`/user/${id}`, payload);

                  if (res.data.message === "success") {
                        const mappedUser = mapUser(res.data.user);
                        setData(mappedUser);
                        reset(mappedUser);
                        setEditMode(false);
                        alert("تم تحديث البيانات بنجاح");
                  }
            } catch (error) {
                  alert(error.response?.data?.message || "حدث خطأ أثناء تحديث البيانات");
            }
      };

      if (loading) return <p>جاري تحميل البيانات...</p>;
      if (error) return <p className="text-danger">{error}</p>;

      return (
            <section className="profile-user-data">
                  <section className="content">
                        <h2>بيانات الحساب</h2>
                        <div className="user-data">
                              {editMode ? (
                                    <form onSubmit={handleSubmit(onSubmit)} className="row g-3">
                                          <div className="col-12">
                                                <label>الاسم بالكامل</label>
                                                <input
                                                      className="form-control"
                                                      {...register("fullName", { required: "الاسم بالكامل مطلوب" })}
                                                />
                                                {errors.fullName && (
                                                      <span className="text-danger">{errors.fullName.message}</span>
                                                )}
                                          </div>

                                          <div className="col-12">
                                                <label>رقم الهاتف</label>
                                                <input className="form-control" {...register("phoneNumber")} />
                                          </div>

                                          <div className="col-12">
                                                <label>البريد الإلكتروني</label>
                                                <input type="email" className="form-control" {...register("email")} />
                                          </div>

                                          <div className="col-12">
                                                <label>الرقم القومي</label>
                                                <input className="form-control" {...register("nationalId")} />
                                          </div>

                                          <div className="col-12">
                                                <label>الجنس</label>
                                                <select className="form-control" {...register("gender")}>
                                                      <option value="">اختر</option>
                                                      <option value="ذكر">ذكر</option>
                                                      <option value="أنثي">أنثى</option>
                                                </select>
                                          </div>

                                          <div className="col-12">
                                                <label>فصيلة الدم</label>
                                                <select className="form-control" {...register("blood")}>
                                                      <option value="">اختر</option>
                                                      <option value="A+">A+</option>
                                                      <option value="A-">A-</option>
                                                      <option value="B+">B+</option>
                                                      <option value="B-">B-</option>
                                                      <option value="AB+">AB+</option>
                                                      <option value="AB-">AB-</option>
                                                      <option value="O+">O+</option>
                                                      <option value="O-">O-</option>
                                                </select>
                                          </div>

                                          <div className="col-12">
                                                <label>رقم الطوارئ</label>
                                                <input className="form-control" {...register("emergencyNumber")} />
                                          </div>

                                          <div className="col-12">
                                                <label>العنوان</label>
                                                <input className="form-control" {...register("address")} />
                                          </div>

                                          <div className="col-12">
                                                <label>تاريخ الميلاد</label>
                                                <input
                                                      type="date"
                                                      className="form-control"
                                                      {...register("birthDate")}
                                                      defaultValue={formatUtcForInput(data?.birthDate)}
                                                />
                                          </div>

                                          <div className="col-12 mt-3">
                                                <button type="submit" className="btn btn-success me-2">
                                                      حفظ
                                                </button>
                                                <button
                                                      type="button"
                                                      className="btn btn-secondary"
                                                      onClick={() => {
                                                            setEditMode(false);
                                                            reset(data);
                                                      }}
                                                >
                                                      إلغاء
                                                </button>
                                          </div>
                                    </form>
                              ) : (
                                    <>
                                          {showPassword && (
                                                <section
                                                      className="bg-white p-5 rounded shadow"
                                                      style={{
                                                            position: "fixed",       // مهم عشان يثبت في النص مهما كان scroll
                                                            top: "50%",
                                                            left: "50%",
                                                            transform: "translate(-50%, -50%)",
                                                            width: "90%",            // تقريبًا عرض الشاشة
                                                            maxWidth: "500px",       // أقصى عرض عشان ما يكونش كبير جدًا على الشاشات الكبيرة
                                                            zIndex: 1050             // فوق أي عناصر تانية
                                                      }}
                                                >
                                                      <button
                                                            className="btn btn-sm btn-danger position-absolute"
                                                            style={{ top: "10px", right: "10px" }}
                                                            onClick={() => setShowPassword(false)}
                                                      >
                                                            X
                                                      </button>
                                                      <p className="text-center fw-bold mb-3">تغيير كلمة المرور</p>

                                                      <form onSubmit={handleSubmit(onChangePassword)}>
                                                            {[
                                                                  { name: "currentPassword", placeholder: "كلمة المرور الحالية" },
                                                                  { name: "newPassword", placeholder: "كلمة المرور الجديدة" },
                                                                  { name: "confirmPassword", placeholder: "إعادة إدخال كلمة السر الجديدة" },
                                                            ].map((item, index) => (
                                                                  <Row className="mb-2" key={index}>
                                                                        <div className="input-group" dir="ltr">
                                                                              <input
                                                                                    type={show ? "text" : "password"}
                                                                                    className="form-control text-center"
                                                                                    placeholder={item.placeholder}
                                                                                    {...register(item.name, { required: true })}
                                                                              />
                                                                              <button
                                                                                    type="button"
                                                                                    className="btn btn-outline-secondary"
                                                                                    onClick={() => setShow(!show)}
                                                                              >
                                                                                    <i className={`bi ${show ? "bi-eye-slash" : "bi-eye"}`}></i>
                                                                              </button>
                                                                        </div>
                                                                        {errors[item.name] && (
                                                                              <small className="text-danger">هذا الحقل مطلوب</small>
                                                                        )}
                                                                  </Row>
                                                            ))}

                                                            <button
                                                                  type="submit"
                                                                  className="btn btn-warning w-100"
                                                                  disabled={loadingPassword}
                                                            >
                                                                  {loadingPassword ? "جاري التغيير..." : "تغيير كلمة المرور"}
                                                            </button>
                                                      </form>
                                                </section>
                                          )}


                                          <table className="table w-100">
                                                <tbody>
                                                      <tr>
                                                            <th>رقم الهاتف</th>
                                                            <td>{data?.phoneNumber || "غير مسجل"}</td>
                                                      </tr>
                                                      <tr>
                                                            <th>البريد الإلكتروني</th>
                                                            <td>{data?.email || "غير مسجل"}</td>
                                                      </tr>
                                                      <tr>
                                                            <th>الرقم القومي</th>
                                                            <td>{data?.nationalId || "غير مسجل"}</td>
                                                      </tr>
                                                      <tr>
                                                            <th>الجنس</th>
                                                            <td>{data?.gender || "غير مسجل"}</td>
                                                      </tr>
                                                      <tr>
                                                            <th>فصيلة الدم</th>
                                                            <td>{data?.blood || "غير مسجل"}</td>
                                                      </tr>
                                                      <tr>
                                                            <th>رقم الطوارئ</th>
                                                            <td>{data?.emergencyNumber || "غير مسجل"}</td>
                                                      </tr>
                                                      <tr>
                                                            <th>العنوان</th>
                                                            <td>{data?.address || "غير مسجل"}</td>
                                                      </tr>
                                                      <tr>
                                                            <th>تاريخ الميلاد</th>
                                                            <td>
                                                                  {data?.birthDate
                                                                        ? `${formatUtcDate(data.birthDate)}${calculateAgeUtc(data.birthDate) !== null
                                                                              ? ` (${calculateAgeUtc(data.birthDate)} سنة)`
                                                                              : ""
                                                                        }`
                                                                        : "غير مسجل"}
                                                            </td>
                                                      </tr>
                                                      <tr>
                                                            <th>تاريخ إنشاء الحساب</th>
                                                            <td>{formatUtcDate(data?.createdAt)}</td>
                                                      </tr>
                                                      <tr>
                                                            <th>
                                                                  كلمة المرور
                                                            </th>
                                                            <td>
                                                                  <button className="btn btn-danger" onClick={() => { setShowPassword(true) }}>تغير كلمة المرور</button>
                                                            </td>
                                                      </tr>
                                                </tbody>
                                          </table>

                                          <button className="btn bg-black text-white" onClick={() => setEditMode(true)}>
                                                تعديل البيانات
                                          </button>
                                    </>
                              )}
                        </div>
                  </section>
            </section>
      );
}
