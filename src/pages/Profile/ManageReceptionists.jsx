import { useState, useEffect, useCallback } from "react";
import api from "../../lib/api";
import { toast } from "react-toastify";
import axios from "axios";
import { Col, Row, Form, Button } from "react-bootstrap";

export default function ManageReceptionists() {

      const [loading, setLoading] = useState(false)
      const [receptionists, setReceptionists] = useState([]);
      const [formData, setFormData] = useState({
            fullName: "",
            email: "",
            phoneNumber: "",
            password: "",
            role: "",
            specialty: "",
      });

      const token = localStorage.getItem("token");
      const apiUrl = import.meta.env.VITE_API_URL;

      // 🟢 جلب موظفي الاستقبال
      const fetchReceptionists = useCallback(async () => {
            setLoading(true);
            try {
                  const res = await api.get("/getReceptionists", {
                        headers: { Authorization: `Bearer ${token}` },
                  });
                  const data = res.data?.data || [];
                  setReceptionists(data);
                  setLoading(false);
            } catch (err) {
                  setLoading(false);
                  console.error("Error fetching receptionists:", err);
                  toast.error("حدث خطأ أثناء جلب موظفي الاستقبال");
            }
      }, [token]); // تعتمد على token لو هو ممكن يتغير

      useEffect(() => {
            fetchReceptionists();
      }, [fetchReceptionists]);


      // 🟡 إضافة موظف استقبال جديد
      const handleSubmit = async (e) => {
            setLoading(true);

            e.preventDefault();

            if (
                  !formData.fullName ||
                  !formData.email ||
                  !formData.phoneNumber ||
                  !formData.password ||
                  !formData.role ||
                  (formData.role === "doctor" && !formData.specialty) // ← شرط التخصص
            ) {
                  toast.error("يرجى ملء جميع الحقول");
                  setLoading(false);
                  return;
            }

            try {
                  const res = await axios.post(`${apiUrl}/addReceptionists`, formData, {
                        headers: { Authorization: `Bearer ${token}` }
                  });

                  toast.success(res.data?.message || "تمت الإضافة بنجاح");
                  setLoading(false);
                  setFormData({
                        fullName: "",
                        role: "",
                        email: "",
                        phoneNumber: "",
                        password: "",
                        specialty: "",
                  });
                  fetchReceptionists();
            } catch (err) {
                  setLoading(false);
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
            const newStatus = currentStatus === "true" ? "false" : "true";


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

      const specialties = [
            { value: "internal medicine", label: "الباطنة (Internal Medicine)" },
            { value: "general surgery", label: "الجراحة العامة (General Surgery)" },
            { value: "pediatrics", label: "الأطفال (Pediatrics)" },
            { value: "obgyn", label: "النساء والتوليد (Obstetrics & Gynecology)" },
            { value: "ent", label: "الأنف والأذن والحنجرة (ENT)" },
            { value: "ophthalmology", label: "العيون (Ophthalmology)" },
            { value: "orthopedics", label: "العظام (Orthopedics)" },
            { value: "dermatology", label: "الجلدية (Dermatology)" },
            { value: "urology", label: "المسالك البولية (Urology)" },
            { value: "dentistry", label: "الأسنان (Dentistry)" },
            { value: "cardiology", label: "القلب والأوعية الدموية (Cardiology)" },
            { value: "pulmonology", label: "الصدر (Pulmonology)" },
            { value: "neurology", label: "المخ والأعصاب (Neurology)" },
            { value: "psychiatry", label: "النفسية والعصبية (Psychiatry)" },
            { value: "nutrition", label: "التغذية والسمنة (Nutrition & Obesity)" },
            { value: "general practice", label: "الطب العام (General Practice)" },
      ];

      return (
            <div className="p-4">
                  <h2 className="mb-3">إدارة الموظفين</h2>

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
                              <Form.Group as={Col} md='12' controlId="phoneNumber">
                                    <Form.Label>رقم الهاتف<span>*</span></Form.Label>
                                    <Form.Control required type="text" placeholder="رقم الهاتف" value={formData.phoneNumber}
                                          onChange={(e) =>
                                                setFormData({ ...formData, phoneNumber: e.target.value })
                                          } />
                                    <Form.Control.Feedback type="invalid">رقم الهاتف مطلوب</Form.Control.Feedback>
                              </Form.Group>
                        </Row>

                        <Row className="m-3 py-2">
                              <Form.Group as={Col} md='12' controlId="role">
                                    <Form.Label>الدور<span>*</span></Form.Label>

                                    <Form.Select
                                          required
                                          value={formData.role}
                                          onChange={(e) =>
                                                setFormData({ ...formData, role: e.target.value })
                                          }
                                          className="form-control"
                                    >
                                          <option value="">-- اختر الدور --</option>
                                          <option value="receptionist">موظف استقبال</option>
                                          <option value="doctor">دكتور</option>
                                    </Form.Select>
                                    <Form.Control.Feedback type="invalid">النوع مطلوب</Form.Control.Feedback>
                              </Form.Group>
                        </Row>

                        {formData.role === "doctor" && (
                              <Row className="m-3 py-2">
                                    <Form.Group as={Col} md="12" controlId="specialty">
                                          <Form.Label>
                                                اختر التخصص <span>*</span>
                                          </Form.Label>

                                          <Form.Select
                                                required
                                                value={formData.specialty}
                                                onChange={(e) =>
                                                      setFormData({ ...formData, specialty: e.target.value })
                                                }
                                                className="form-control"
                                          >
                                                <option value="">-- اختر التخصص --</option>
                                                {specialties.map((spec) => (
                                                      <option key={spec.value} value={spec.value}>
                                                            {spec.label}
                                                      </option>
                                                ))}
                                          </Form.Select>

                                          <Form.Control.Feedback type="invalid">
                                                هذا الحقل مطلوب
                                          </Form.Control.Feedback>
                                    </Form.Group>
                              </Row>
                        )}


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
                              <Button type="submit" className="mt-3" disabled={loading}>
                                    {loading ? "جاري الإضافة..." : "إضافة موظف"}
                              </Button>
                        </Row>
                  </form>

                  <section className="table overflow-x-auto">
                        <table className="table table-bordered table-striped text-center" style={{ width: "100%", minWidth: "1199px" }}>
                              <thead className="table-dark">
                                    <tr>
                                          <th>الاسم</th>
                                          <th>الحاله</th>
                                          <th>الإيميل</th>
                                          <th>رقم الهاتف</th>
                                          <th>الحالة</th>
                                          <th>تحكم</th>
                                    </tr>
                              </thead>
                              <tbody>
                                    {loading ? (
                                          <tr>
                                                <td colSpan="6" className="text-center">
                                                      جاري التحميل...
                                                </td>
                                          </tr>
                                    ) : receptionists.length > 0 ? (
                                          receptionists.map((r) => (
                                                <tr key={r.id} style={{ textAlign: "center", verticalAlign: "middle" }}>
                                                      <td>{r.fullName}</td>
                                                      <td>{r.role}</td>
                                                      <td>{r.email}</td>
                                                      <td>{r.phoneNumber}</td>
                                                      <td>
                                                            <span
                                                                  style={{
                                                                        backgroundColor:
                                                                              r.status === "true" ? "#d4edda" : "#fff3cd",
                                                                        padding: "5px 15px",
                                                                        borderRadius: "4px",
                                                                        fontSize: "14px",
                                                                  }}
                                                            >
                                                                  {r.status === "true" ? "نشط" : "مجمد"}
                                                            </span>
                                                      </td>
                                                      <td className="d-flex">
                                                            <Button
                                                                  onClick={() => handleToggleStatus(r.id, r.status)}
                                                                  className={`border-0 px-2 w-50 ${r.status === "false"
                                                                              ? "bg-warning text-dark"
                                                                              : "bg-success text-white"
                                                                        }`}
                                                            >
                                                                  {r.status === "true" ? "تجميد" : "تنشيط"}
                                                            </Button>

                                                            <Button
                                                                  onClick={() => handleDelete(r.id)}
                                                                  className="bg-danger text-white mx-1 border-0 px-2 w-50"
                                                            >
                                                                  🗑️ حذف
                                                            </Button>
                                                      </td>
                                                </tr>
                                          ))
                                    ) : (
                                          <tr>
                                                <td colSpan="6" className="text-center">
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
