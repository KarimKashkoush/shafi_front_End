import { useState, useEffect, useContext } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { AuthContext } from "../../context/Auth.Context";

export default function ProfileUserData() {
      const { user, setUser } = useContext(AuthContext);
      const [data, setData] = useState(user);
      const [editMode, setEditMode] = useState(false);
      const {
            register,
            handleSubmit,
            formState: { errors },
            reset,
      } = useForm({
            defaultValues: {
                  address: user.address,
                  birthDate: user.birthDate,
                  blood: user.blood,
                  email: user.email,
                  emergencyNumber: user.emergencyNumber,
                  firstName: user.firstName,
                  fullName: user.fullName,
                  gender: user.gender,
                  phoneNumber: user.phoneNumber,
            }
      });



      useEffect(() => {
            if (user) {
                  setData(user);
                  reset(user);
            }
      }, [user, reset]);



      const onSubmit = async (formData) => {
            try {
                  const apiUrl = import.meta.env.VITE_API_URL;
                  const res = await axios.put(`${apiUrl}/user/${user.id}`, formData);

                  if (res.data.message === "success") {
                        setData(res.data.user);
                        setUser(res.data.user);
                        localStorage.setItem("user", JSON.stringify(res.data.user));
                        setEditMode(false);
                        alert("تم تحديث البيانات بنجاح");
                  }
            } catch (error) {
                  alert(error.response?.data?.message || "حدث خطأ أثناء تحديث البيانات");
            }
      };

      return (
            <section className="profile-user-data">
                  <section className="content">
                        <h2>بيانات الحساب</h2>
                        <div className="user-data">
                              {editMode ? (
                                    <form onSubmit={handleSubmit(onSubmit)} className="row g-3">
                                          <div className="col-12">
                                                <label>الاسم الأول</label>
                                                <input
                                                      className="form-control"
                                                      {...register("firstName", { required: "الاسم مطلوب" })}
                                                />
                                                {errors.firstName && (
                                                      <span className="text-danger">{errors.firstName.message}</span>
                                                )}
                                          </div>

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
                                                <input type="date" className="form-control" {...register("birthDate")} />
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
                                          <table className="table w-100">
                                                <tbody>
                                                      <tr>
                                                            <th>الاسم</th>
                                                            <td>{data?.firstName} {data?.fullName}</td>
                                                      </tr>
                                                      <tr>
                                                            <th>رقم الهاتف</th>
                                                            <td>{data?.phoneNumber || "غير مسجل"}</td>
                                                      </tr>
                                                      <tr>
                                                            <th>البريد الإلكتروني</th>
                                                            <td>{data?.email || "غير مسجل"}</td>
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
                                                            <td>{data?.birthDate || "غير مسجل"}</td>
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
