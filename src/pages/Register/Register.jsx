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
      const navigate = useNavigate();
      const [loading, setLoading] = useState(false)
      const [validated, setValidated] = useState(false)
      const [password, setPassword] = useState('')
      const [confirmPassword, setConfirmPassword] = useState('')
      const [passwordMatchError, setPasswordMatchError] = useState(false)
      const [pin, setPin] = useState(['', '', '', ''])
      const pinRefs = [useRef(), useRef(), useRef(), useRef()]

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
                                    <Form.Group as={Col} md="12" controlId="fullName" className='p-2'>
                                          <Form.Label>الاسم بالكامل<span>*</span></Form.Label>
                                          <Form.Control {...register('fullName')} required type="text" placeholder="أدخل الاسم بالكامل" />
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
                                                <option value="patient">مستخدم</option>
                                          </Form.Select>
                                          <Form.Control.Feedback type="invalid">
                                                هذا الحقل مطلوب
                                          </Form.Control.Feedback>
                                    </Form.Group>
                              </Row>


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
