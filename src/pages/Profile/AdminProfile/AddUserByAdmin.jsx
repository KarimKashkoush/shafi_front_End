import axios from "axios";
import { useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";

export default function AddUserByAdmin() {
      const [userType, setUserType] = useState('');
      const [specialty, setSpecialty] = useState('');
      const [loading, setLoading] = useState(false);

      const { register, handleSubmit } = useForm({
            defaultValues: {
                  fullName: '',
                  email: '',
                  phoneNumber: '',
                  password: '',
                  role: '',
                  gender: ''
            }
      })

      async function onSubmit(data) {
            setLoading(true);
            try {
                  const apiUrl = import.meta.env.VITE_API_URL;
                  const token = localStorage.getItem("token");

                  await axios.post(`${apiUrl}/addUserByAdmin`, data, {
                        headers: {
                              Authorization: `Bearer ${token}`,
                        },
                  });
                  setLoading(false);

                  alert("تم إنشاء المستخدم بنجاح ✅");
            } catch (err) {
                  setLoading(false);
                  console.error(err);
                  alert("حدث خطأ أثناء إنشاء المستخدم ❌");
            }
      }

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
            <section className="add-user-by-admin">
                  <h4 className="text-center fw-bold">إضـــافة مستخدم جديد</h4>
                  
                  <section className="form">
                        <Form noValidate onSubmit={handleSubmit(onSubmit)}>

                              {/* Name */}
                              <Row className="m-3 py-2">
                                    <Form.Group as={Col} md='12' controlId="fullName">
                                          <Form.Label>الاسم<span>*</span></Form.Label>
                                          <Form.Control {...register('fullName')} required type="text" placeholder="أدخل الاسم" />
                                          <Form.Control.Feedback type="invalid">الاسم مطلوب</Form.Control.Feedback>
                                    </Form.Group>
                              </Row>

                              {/* Email */}
                              <Row className="m-3 py-2">
                                    <Form.Group as={Col} md="12" controlId="email">
                                          <Form.Label>الايميل الشخصي</Form.Label>
                                          <Form.Control {...register('email')} type="email" placeholder="أدخل الايميل الشخصي أو رقم الهاتف" />
                                          <Form.Control.Feedback type="invalid">برجاء إدخال بريد إلكتروني أو رقم هاتف صحيح</Form.Control.Feedback>
                                    </Form.Group>
                              </Row>

                              {/* Phone Number */}
                              <Row className="m-3 py-2">
                                    <Form.Group as={Col} md="12" controlId="phoneNumber">
                                          <Form.Label>رقم الهاتف <span>*</span></Form.Label>
                                          <Form.Control {...register('phoneNumber')} required type="text" placeholder="أدخل رقم الهاتف" />
                                    </Form.Group>
                              </Row>

                              {/* اختيار نوع المستخدم */}
                              <Row className="m-3 py-2">
                                    <Form.Group as={Col} md="12" controlId="userType">
                                          <Form.Label>
                                                اختر نوع المستخدم <span>*</span>
                                          </Form.Label>
                                          <Form.Select
                                                required
                                                value={userType}
                                                {...register("userType")}
                                                onChange={(e) => setUserType(e.target.value)}
                                                className="form-control"
                                          >
                                                <option value="">-- اختر النوع --</option>
                                                <option value="medicalCenter">مركز طبي</option>
                                                <option value="doctor">دكتور - عيادة</option>
                                                <option value="radiology">مركز أشعة</option>
                                                <option value="lab">معمل تحاليل</option>
                                                <option value="pharmacy">صيدلية</option>
                                          </Form.Select>
                                          <Form.Control.Feedback type="invalid">
                                                هذا الحقل مطلوب
                                          </Form.Control.Feedback>
                                    </Form.Group>
                              </Row>

                              {/* اختيار التخصص لو اختار دكتور */}
                              {(["doctor", "medicalCenter"].includes(userType)) && (
                                    <Row className="m-3 py-2">
                                          <Form.Group as={Col} md="12" controlId="specialty">
                                                <Form.Label>
                                                      اختر التخصص <span>*</span>
                                                </Form.Label>
                                                <Form.Select
                                                      required
                                                      value={specialty}
                                                      {...register("specialty")}
                                                      onChange={(e) => setSpecialty(e.target.value)}
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
                                    <Form.Group as={Col} md="12" controlId="gender">
                                          <Form.Label>الجنس <span>*</span></Form.Label>
                                          <Form.Select required {...register('gender')} className="form-control">
                                                <option value="">-- اختر الجنس --</option>
                                                <option value="ذكر">ذكر</option>
                                                <option value="انثي">أنثى</option>
                                          </Form.Select>
                                          <Form.Control.Feedback type="invalid">هذا الحقل مطلوب</Form.Control.Feedback>
                                    </Form.Group>
                              </Row>

                              <Row className="m-3 py-2">
                                    <Button type="submit" className="mt-3" disabled={loading}>
                                          {loading ? 'جاري الإنشاء...' : 'إنشاء مستخدم'}

                                    </Button>
                              </Row>

                        </Form>
                  </section>
            </section>
      )
}
