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
                  birth_date: user.birth_date,
                  blood: user.blood,
                  email: user.email,
                  emergency_number: user.emergency_number,
                  first_name: user.first_name,
                  full_name: user.full_name,
                  gender: user.gender,
                  phone_number: user.phone_number,
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
                                                      {...register("first_name", { required: "الاسم مطلوب" })}
                                                />
                                                {errors.first_name && (
                                                      <span className="text-danger">{errors.first_name.message}</span>
                                                )}
                                          </div>

                                          <div className="col-12">
                                                <label>الاسم بالكامل</label>
                                                <input
                                                      className="form-control"
                                                      {...register("full_name", { required: "الاسم بالكامل مطلوب" })}
                                                />
                                                {errors.full_name && (
                                                      <span className="text-danger">{errors.full_name.message}</span>
                                                )}
                                          </div>

                                          <div className="col-12">
                                                <label>رقم الهاتف</label>
                                                <input className="form-control" {...register("phone_number")} />
                                          </div>

                                          <div className="col-12">
                                                <label>البريد الإلكتروني</label>
                                                <input type="email" className="form-control" {...register("email")} />
                                          </div>

                                          <div className="col-12">
                                                <label>الجنس</label>
                                                <select className="form-control" {...register("gender")}>
                                                      <option value="">اختر</option>
                                                      <option value="male">ذكر</option>
                                                      <option value="female">أنثى</option>
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
                                                <input className="form-control" {...register("emergency_number")} />
                                          </div>

                                          <div className="col-12">
                                                <label>العنوان</label>
                                                <input className="form-control" {...register("address")} />
                                          </div>

                                          <div className="col-12">
                                                <label>تاريخ الميلاد</label>
                                                <input type="date" className="form-control" {...register("birth_date")} />
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
                                                            <td>{data?.first_name} {data?.full_name}</td>
                                                      </tr>
                                                      <tr>
                                                            <th>رقم الهاتف</th>
                                                            <td>{data?.phone_number || "غير مسجل"}</td>
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
                                                            <td>{data?.emergency_number || "غير مسجل"}</td>
                                                      </tr>
                                                      <tr>
                                                            <th>العنوان</th>
                                                            <td>{data?.address || "غير مسجل"}</td>
                                                      </tr>
                                                      <tr>
                                                            <th>تاريخ الميلاد</th>
                                                            <td>{data?.birth_date || "غير مسجل"}</td>
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
