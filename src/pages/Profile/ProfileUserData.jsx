import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";

const userData = JSON.parse(localStorage.getItem("user"));

export default function ProfileUserData() {
      const [data, setData] = useState(userData.UserData);
      const [editMode, setEditMode] = useState(false);

      const {
            register,
            handleSubmit,
            formState: { errors },
            reset,
      } = useForm();

      // ✨ لما يدخل وضع التعديل نعمل reset بالفورم داتا الحالية
      useEffect(() => {
            if (editMode) {
                  reset(data);
            }
      }, [editMode, data, reset]);

      const onSubmit = (formData) => {
            setData(formData);
            localStorage.setItem("user", JSON.stringify({ ...userData, UserData: formData }));
            setEditMode(false);
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
                                                <input className="form-control" {...register("firstName", { required: "الاسم مطلوب" })} />
                                                {errors.firstName && <span className="text-danger">{errors.firstName.message}</span>}
                                          </div>

                                          <div className="col-12">
                                                <label>الاسم بالكامل</label>
                                                <input className="form-control" {...register("fullName", { required: "الاسم بالكامل مطلوب" })} />
                                                {errors.fullName && <span className="text-danger">{errors.fullName.message}</span>}
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
                                                      <option value="male">ذكر</option>
                                                      <option value="female">أنثى</option>
                                                </select>
                                          </div>

                                          <div className="col-12">
                                                <label>فصيلة الدم</label>
                                                <input className="form-control" {...register("blood")} />
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
                                                <button type="submit" className="btn btn-success me-2">حفظ</button>
                                                <button type="button" className="btn btn-secondary" onClick={() => { setEditMode(false); reset(data); }}>إلغاء</button>
                                          </div>
                                    </form>
                              ) : (
                                    <>
                                          <table className="table w-100">
                                                <tbody>
                                                      <tr><th>الاسم</th><td>{data?.firstName} {data?.fullName}</td></tr>
                                                      <tr><th>رقم الهاتف</th><td>{data?.phoneNumber}</td></tr>
                                                      <tr><th>البريد الإلكتروني</th><td>{data?.email}</td></tr>
                                                      <tr><th>الجنس</th><td>{data?.gender}</td></tr>
                                                      <tr><th>فصيلة الدم</th><td>{data?.blood || "غير مسجل"}</td></tr>
                                                      <tr><th>العنوان</th><td>{data?.address || "غير مسجل"}</td></tr>
                                                      <tr><th>تاريخ الميلاد</th><td>{data?.birthDate || "غير مسجل"}</td></tr>
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
