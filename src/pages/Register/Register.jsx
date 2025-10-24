import { useState, useRef } from 'react'
import { Container, Col, Row, Form, Button } from 'react-bootstrap'
import Lottie from 'lottie-react'
import registerAnimation from "../../assets/animation/Register.json"
import './style.css'
import { useForm } from 'react-hook-form'
import axios from 'axios';
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Register() {
      const [userType, setUserType] = useState("");
      const [specialty, setSpecialty] = useState("");
      const navigate = useNavigate();
      const [loading, setLoading] = useState(false)
      const [validated, setValidated] = useState(false)
      const [password, setPassword] = useState('')
      const [confirmPassword, setConfirmPassword] = useState('')
      const [passwordMatchError, setPasswordMatchError] = useState(false)
      const [pin, setPin] = useState(['', '', '', ''])
      const pinRefs = [useRef(), useRef(), useRef(), useRef()]


      const specialties = [
            { value: "internal_medicine", label: "الباطنة (Internal Medicine)" },
            { value: "general_surgery", label: "الجراحة العامة (General Surgery)" },
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
            { value: "general_practice", label: "الطب العام (General Practice)" },
      ];


      const { register, handleSubmit } = useForm({
            defaultValues: {
                  firstName: '',
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
            const passwordsMatch = password === confirmPassword;
            const fullPin = pin.join("");

            setValidated(true);
            setPasswordMatchError(!passwordsMatch);

            if (!passwordsMatch) {
                  setLoading(false);
                  return;
            }

            const finalData = {
                  ...data,
                  role: userType, // علشان الباك اند يستقبل الدور الصحيح
                  specialty,      // علشان التخصص يتسجل
                  pin: pin.some(p => p !== '') ? fullPin : "",
            };

            try {
                  const apiUrl = import.meta.env.VITE_API_URL;
                  await axios.post(`${apiUrl}/register`, finalData);
                  toast.success("تم إنشاء الحساب بنجاح 🎉");
                  navigate("/login");
            } catch (error) {
                  console.error("حدث خطأ أثناء التسجيل:", error.response?.data || error.message);
                  alert(error.response?.data?.message || "فشل في التسجيل، حاول مرة أخرى");
            } finally {
                  setLoading(false);
            }
      }

      return (
            <section className="py-5 register-login min-vh-100 d-flex flex-column align-items-center justify-content-center">
                  <h3 className='fw-semibold'><span>إنشـــاء</span> حساب جديد</h3>
                  <Container className='row mx-auto align-items-center py-4'>
                        <Form noValidate validated={validated} onSubmit={handleSubmit(onSubmit)} className="form col-lg-6 p-3">

                              <Row className="mb-2">
                                    <Form.Group as={Col} lg="3" controlId="firstName" className='p-2'>
                                          <Form.Label>الاسم الأول <span>*</span></Form.Label>
                                          <Form.Control {...register('firstName')} required type="text" placeholder="أدخل الاسم الأول" />
                                          <Form.Control.Feedback type="invalid">الاسم الأول مطلوب</Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group as={Col} lg="9" controlId="fullName" className='p-2'>
                                          <Form.Label>باقي الاسم بالكامل <span>*</span></Form.Label>
                                          <Form.Control {...register('fullName')} required type="text" placeholder="أدخل باقي الاسم بالكامل" />
                                          <Form.Control.Feedback type="invalid">هذا الحقل مطلوب</Form.Control.Feedback>
                                    </Form.Group>
                              </Row>

                              <Row className="mb-2">
                                    <Form.Group as={Col} md="12" controlId="email" className='p-2'>
                                          <Form.Label>الايميل الشخصي</Form.Label>
                                          <Form.Control {...register('email')} type="email" placeholder="أدخل الايميل الشخصي أو رقم الهاتف" />
                                          <Form.Control.Feedback type="invalid">برجاء إدخال بريد إلكتروني أو رقم هاتف صحيح</Form.Control.Feedback>
                                    </Form.Group>
                              </Row>

                              <Row className="mb-2">
                                    <Form.Group as={Col} md="6" controlId="password" className='p-2'>
                                          <Form.Label>كلمة المرور <span>*</span></Form.Label>
                                          <Form.Control
                                                {...register('password')}
                                                required
                                                type="password"
                                                placeholder="أدخل كلمة المرور"
                                                minLength={6}
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                isInvalid={passwordMatchError}
                                          />
                                          <Form.Control.Feedback type="invalid">
                                                كلمة المرور مطلوبة ويجب أن تطابق التأكيد
                                          </Form.Control.Feedback>
                                    </Form.Group>

                                    <Form.Group as={Col} md="6" controlId="confirmPassword" className='p-2'>
                                          <Form.Label>إعادة كتابة كلمة المرور <span>*</span></Form.Label>
                                          <Form.Control
                                                required
                                                type="password"
                                                placeholder="أدخل كلمة المرور مرة أخرى"
                                                minLength={6}
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                isInvalid={passwordMatchError}
                                          />
                                          <Form.Control.Feedback type="invalid">
                                                {passwordMatchError
                                                      ? 'كلمتا المرور غير متطابقتين'
                                                      : 'تأكيد كلمة المرور مطلوب'}
                                          </Form.Control.Feedback>
                                    </Form.Group>
                              </Row>

                              <Row className="mb-2">
                                    <Form.Group as={Col} md="12" controlId="phoneNumber" className='p-2'>
                                          <Form.Label>رقم الهاتف <span>*</span></Form.Label>
                                          <Form.Control {...register('phoneNumber')} required type="text" placeholder="أدخل رقم الهاتف" />
                                    </Form.Group>
                              </Row>

                              <Row className="mb-2">
                                    <Form.Group as={Col} md="12" controlId="nationalId" className="p-2">
                                          <Form.Label>الرقم القومي <span>*</span></Form.Label>
                                          <Form.Control
                                                {...register('nationalId')}
                                                required
                                                type="text"
                                                placeholder="أدخل الرقم القومي"
                                                pattern="\d{14}"
                                          />
                                          <Form.Control.Feedback type="invalid">
                                                برجاء إدخال رقم قومي صحيح مكون من 14 رقمًا
                                          </Form.Control.Feedback>
                                    </Form.Group>
                              </Row>
                              
                              {/* اختيار نوع المستخدم */}
                              <Row className="mb-3 px-2 mt-2">
                                    <Form.Group as={Col} md="12" controlId="userType">
                                          <Form.Label>
                                                اختر نوع المستخدم: <span>*</span>
                                          </Form.Label>
                                          <Form.Select
                                                required
                                                value={userType}
                                                {...register("userType")}
                                                onChange={(e) => setUserType(e.target.value)}
                                          >
                                                <option value="">-- اختر النوع --</option>
                                                <option value="doctor">دكتور - عيادة</option>
                                                <option value="clinic_reception">استقبال عيادة</option>
                                                <option value="radiology_center">مركز أشعة</option>
                                                <option value="radiology_reception">استقبال أشعة</option>
                                                <option value="lab">معمل تحاليل</option>
                                                <option value="lab_reception">استقبال تحاليل</option>
                                                <option value="pharmacy">صيدلية</option>
                                                <option value="user">مستخدم (مريض)</option>
                                          </Form.Select>
                                          <Form.Control.Feedback type="invalid">
                                                هذا الحقل مطلوب
                                          </Form.Control.Feedback>
                                    </Form.Group>
                              </Row>

                              {/* اختيار التخصص لو اختار دكتور */}
                              {userType === "doctor" && (
                                    <Row className="mb-3 px-2 mt-2">
                                          <Form.Group as={Col} md="12" controlId="specialty">
                                                <Form.Label>
                                                      اختر التخصص: <span>*</span>
                                                </Form.Label>
                                                <Form.Select
                                                      required
                                                      value={specialty}
                                                      {...register("specialty")}
                                                      onChange={(e) => setSpecialty(e.target.value)}
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

                              <Row className="mb-3 px-2 mt-2">
                                    <Form.Group as={Col} md="12" controlId="gender">
                                          <Form.Label>الجنس <span>*</span></Form.Label>
                                          <Form.Select required {...register('gender')}>
                                                <option value="">اختر الجنس</option>
                                                <option value="ذكر">ذكر</option>
                                                <option value="انثي">أنثى</option>
                                          </Form.Select>
                                          <Form.Control.Feedback type="invalid">هذا الحقل مطلوب</Form.Control.Feedback>
                                    </Form.Group>
                              </Row>

                              {/* كود PIN */}
                              <Row className="mb-3 px-2 mt-2">
                                    <Form.Label>أدخل رمز PIN لفتح الملف الشخصي (4 أرقام) <span>اختياري</span></Form.Label>
                                    <div className="d-flex gap-2" dir="ltr">
                                          {pin.map((digit, index) => (
                                                <Form.Control
                                                      key={index}
                                                      ref={pinRefs[index]}
                                                      type="text"
                                                      maxLength={1}
                                                      pattern="[0-9]{1}"
                                                      value={digit}
                                                      className="text-center"
                                                      onChange={(e) => {
                                                            const val = e.target.value.replace(/\D/g, '')
                                                            const newPin = [...pin]
                                                            newPin[index] = val
                                                            setPin(newPin)

                                                            if (val && index < 3) {
                                                                  pinRefs[index + 1].current.focus()
                                                            }
                                                      }}
                                                      onKeyDown={(e) => {
                                                            if (e.key === 'Backspace' && pin[index] === '' && index > 0) {
                                                                  pinRefs[index - 1].current.focus()
                                                            }
                                                      }}
                                                />
                                          ))}
                                    </div>
                                    <small className="text-muted">
                                          يُستخدم هذا الرقم (Pin Code) لإظهار الملف الطبي الشخصي عند الجهات الطبية.
                                          في حالة عدم إدخاله، يمكن لأي جهة لديها بياناتك الشخصية الإطلاع على الملف.
                                    </small>
                              </Row>

                              <Button type="submit" className="mt-3" disabled={loading}>
                                    {loading ? "جاري التسجيل..." : "تسجيل"}
                              </Button>

                              <Row className="mt-2">
                                    <Link to='/login'>تسجيل الدخول</Link>
                              </Row>
                        </Form>

                        <div className="col-lg-6 d-none d-lg-flex justify-content-center">
                              <Lottie animationData={registerAnimation} />
                        </div>

                  </Container>
            </section>
      )
}
