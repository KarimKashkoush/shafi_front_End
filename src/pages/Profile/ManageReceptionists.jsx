import { useState, useEffect } from "react";
import api from "../../lib/api";
import { toast } from "react-toastify";
import axios from "axios";
import { Col, Row, Form, Button } from "react-bootstrap";

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

                        <Row className="m-3 py-2">
                              <Form.Group as={Col} md='12' controlId="fullName">
                                    <Form.Label>الاسم<span>*</span></Form.Label>
                                    <Form.Control required type="text" placeholder="أدخل الاسم" value={formData.fullName}
                                          onChange={(e) =>
                                                setFormData({ ...formData, fullName: e.target.value })
                                          } />
                                    <Form.Control.Feedback type="invalid">الاسم مطلوب</Form.Control.Feedback>
                              </Form.Group>
                        </Row>

                        <Row className="m-3 py-2">
                              <Form.Group as={Col} md='12' controlId="email">
                                    <Form.Label>الإيميل<span>*</span></Form.Label>
                                    <Form.Control required type="email" placeholder="أدخل الإيميل" value={formData.email}
                                          onChange={(e) =>
                                                setFormData({ ...formData, email: e.target.value })
                                          } />
                                    <Form.Control.Feedback type="invalid">الإيميل مطلوب</Form.Control.Feedback>
                              </Form.Group>
                        </Row>

                        <Row className="m-3 py-2">
                              <Form.Group as={Col} md='12' controlId="phoneNumber">
                                    <Form.Label>رقم الهاتف<span>*</span></Form.Label>
                                    <Form.Control required type="text" placeholder="رقم الهاتف" value={formData.phoneNumber}
                                          onChange={(e) =>
                                                setFormData({ ...formData, phoneNumber: e.target.value })
                                          } />
                                    <Form.Control.Feedback type="invalid">الإيميل مطلوب</Form.Control.Feedback>
                              </Form.Group>
                        </Row>

                        <Row className="m-3 py-2">
                              <Form.Group as={Col} md='12' controlId="password">
                                    <Form.Label>كلمة المرور<span>*</span></Form.Label>
                                    <Form.Control required type="password" placeholder="كلمة المرور" value={formData.password}
                                          onChange={(e) =>
                                                setFormData({ ...formData, password: e.target.value })
                                          } />
                                    <Form.Control.Feedback type="invalid">الإيميل مطلوب</Form.Control.Feedback>
                              </Form.Group>
                        </Row>

                        <Row className="m-3 py-2">
                              <Button type="submit" className="mt-3">
                                    إضافة موظف استقبال
                              </Button>
                        </Row>
                  </form>

                  <section className="table overflow-x-auto">
                        <table className="table table-bordered table-striped text-center" style={{ width: "100%", minWidth: "1199px" }}>
                              <thead className="table-dark">
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
                                                      <td className="">
                                                            <Button onClick={() => handleToggleStatus(r.id, r.status)}>
                                                                  {r.status === "active" ? "🚫 تجميد" : "✅ تفعيل"}
                                                            </Button>
                                                            <Button
                                                                  onClick={() => handleDelete(r.id)}
                                                                  style={{ marginLeft: "10px" }}
                                                                  className="bg-danger text-white mx-1"
                                                            >
                                                                  🗑️ حذف
                                                            </Button>
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
                  </section>
            </div>
      );
}
