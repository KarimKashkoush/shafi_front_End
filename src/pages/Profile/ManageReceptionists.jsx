import { useState, useEffect } from "react";
import api from "../../lib/api";
import { toast } from "react-toastify";
import axios from "axios";

export default function ManageReceptionists() {
      const [receptionists, setReceptionists] = useState([]);
      const [formData, setFormData] = useState({
            fullName: "",
            email: "",
            phoneNumber: "",
            password: "",
      });
      const token = localStorage.getItem("token");
      const apiUrl = import.meta.env.VITE_API_URL;

      // 🟢 جلب موظفي الاستقبال
      const fetchReceptionists = async () => {
            try {
                  const res = await api.get("/getReceptionists", {
                        headers: { Authorization: `Bearer ${token}` },
                  });

                  const data = res.data?.data || [];
                  setReceptionists(data);
            } catch (err) {
                  console.error("Error fetching receptionists:", err);
                  toast.error("حدث خطأ أثناء جلب موظفي الاستقبال");
            }
      };

      useEffect(() => {
            fetchReceptionists();
      }, []);

      // 🟡 إضافة موظف استقبال جديد
      const handleSubmit = async (e) => {
            e.preventDefault();

            if (
                  !formData.fullName ||
                  !formData.email ||
                  !formData.phoneNumber ||
                  !formData.password
            ) {
                  toast.error("يرجى ملء جميع الحقول");
                  return;
            }

            try {
                  const res = await axios.post(`${apiUrl}/addReceptionists`, formData, {
                        headers: { Authorization: `Bearer ${token}` },
                  });


                  toast.success(res.data?.message || "تمت الإضافة بنجاح");
                  setFormData({
                        fullName: "",
                        email: "",
                        phoneNumber: "",
                        password: "",
                  });
                  fetchReceptionists();
            } catch (err) {
                  console.error("Error adding receptionist:", err);
                  toast.error(err.response?.data?.message || "حدث خطأ أثناء الإضافة");
            }
      };

      // 🔴 حذف موظف استقبال
      const handleDelete = async (id) => {
            if (!window.confirm("هل أنت متأكد من الحذف؟")) return;

            try {
                  const res = await api.delete(`/deleteReceptionist/${id}`, {
                        headers: { Authorization: `Bearer ${token}` },
                  });

                  toast.success(res.data?.message || "تم حذف الموظف");
                  fetchReceptionists();
            } catch (err) {
                  console.error("Error deleting receptionist:", err);
                  toast.error("فشل الحذف");
            }
      };

      // 🟠 تغيير حالة الموظف (تفعيل / تجميد)
      const handleToggleStatus = async (id, currentStatus) => {
            const newStatus = currentStatus === "active" ? "frozen" : "active";

            try {
                  const res = await api.patch(
                        `/updateReceptionistStatus/${id}`,
                        { status: newStatus },
                        { headers: { Authorization: `Bearer ${token}` } }
                  );

                  toast.success(res.data?.message || "تم تحديث الحالة");
                  fetchReceptionists();
            } catch (err) {
                  console.error("Error updating status:", err);
                  toast.error("حدث خطأ أثناء تحديث الحالة");
            }
      };

      return (
            <div className="p-4">
                  <h2 className="mb-3">إدارة موظفي الاستقبال</h2>

                  <form onSubmit={handleSubmit} className="mb-4 flex flex-col gap-2">
                        <input
                              type="text"
                              placeholder="الاسم"
                              value={formData.fullName}
                              onChange={(e) =>
                                    setFormData({ ...formData, fullName: e.target.value })
                              }
                              required
                        />
                        <input
                              type="email"
                              placeholder="الإيميل"
                              value={formData.email}
                              onChange={(e) =>
                                    setFormData({ ...formData, email: e.target.value })
                              }
                              required
                        />
                        <input
                              type="tel"
                              placeholder="رقم الهاتف"
                              value={formData.phoneNumber}
                              onChange={(e) =>
                                    setFormData({ ...formData, phoneNumber: e.target.value })
                              }
                              required
                        />
                        <input
                              type="password"
                              placeholder="كلمة المرور"
                              value={formData.password}
                              onChange={(e) =>
                                    setFormData({ ...formData, password: e.target.value })
                              }
                              required
                        />
                        <button type="submit">➕ إضافة موظف استقبال</button>
                  </form>

                  <table border="1" width="100%" cellPadding="5">
                        <thead>
                              <tr>
                                    <th>الاسم</th>
                                    <th>الإيميل</th>
                                    <th>رقم الهاتف</th>
                                    <th>الحالة</th>
                                    <th>تحكم</th>
                              </tr>
                        </thead>
                        <tbody>
                              {receptionists.length > 0 ? (
                                    receptionists.map((r) => (
                                          <tr key={r.id}>
                                                <td>{r.fullName}</td>
                                                <td>{r.email}</td>
                                                <td>{r.phoneNumber}</td>
                                                <td>{r.status === "active" ? "نشط" : "مجمد"}</td>
                                                <td>
                                                      <button onClick={() => handleToggleStatus(r.id, r.status)}>
                                                            {r.status === "active" ? "🚫 تجميد" : "✅ تفعيل"}
                                                      </button>
                                                      <button
                                                            onClick={() => handleDelete(r.id)}
                                                            style={{ marginLeft: "10px" }}
                                                      >
                                                            🗑️ حذف
                                                      </button>
                                                </td>
                                          </tr>
                                    ))
                              ) : (
                                    <tr>
                                          <td colSpan="5" className="text-center">
                                                لا يوجد موظفون حاليًا
                                          </td>
                                    </tr>
                              )}
                        </tbody>
                  </table>
            </div>
      );
}
