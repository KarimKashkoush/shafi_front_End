import { useState, useRef } from 'react'
import { Container, Col, Row, Form, Button } from 'react-bootstrap'
import Lottie from 'lottie-react'
import registerAnimation from "../../assets/animation/Register.json"
import './style.css'
import { useForm } from 'react-hook-form'
import axios from 'axios';
import { Navigate } from "react-router-dom";
export default function Register() {
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
            const passwordsMatch = password === confirmPassword;
            const fullPin = pin.join("");

            setValidated(true);
            setPasswordMatchError(!passwordsMatch);

            if (!passwordsMatch || pin.some(p => p === '')) {
                  return;
            }

            const finalData = {
                  ...data,
                  pin: fullPin,
            };

            try {
                  // 1. جلب المستخدمين الحاليين
                  const usersResponse = await axios.get('https://shafi-be8b0-default-rtdb.firebaseio.com/UsersData.json');
                  const users = usersResponse.data || {};

                  // 2. التحقق من وجود نفس الايميل أو رقم الهاتف
                  const isDuplicate = Object.values(users).some(user =>
                        user.email === finalData.email || user.phoneNumber === finalData.phoneNumber
                  );

                  if (isDuplicate) {
                        alert("يوجد حساب مسجل بهذا البريد الإلكتروني أو رقم الهاتف بالفعل");
                        return;
                  }

                  // 3. في حالة عدم التكرار - سجل المستخدم
                  const response = await axios.post(
                        'https://shafi-be8b0-default-rtdb.firebaseio.com/UsersData.json',
                        finalData
                  );

                  console.log("تم التسجيل بنجاح:", response.data);
                  alert("تم إنشاء الحساب بنجاح");
                  // 4. إعادة التوجيه أو أي إجراء آخر بعد التسجيل
                  Navigate('/login');

            } catch (error) {
                  console.error("حدث خطأ أثناء التسجيل:", error.response?.data || error.message);
                  alert("فشل في التسجيل، حاول مرة أخرى");
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
                                          <Form.Control {...register('email')} type="email" placeholder="أدخل الايميل الشخصي او رقم الهاتف" />
                                          <Form.Control.Feedback type="invalid">برجاء إدخال بريد إلكتروني أو رقم هاتف صحيح</Form.Control.Feedback>
                                    </Form.Group>
                              </Row>

                              <Row className="mb-2">
                                    <Form.Group as={Col} md="6" controlId="password" className='p-2'>
                                          <Form.Label>كلمة المرور <span>*</span></Form.Label>
                                          <div className="position-relative">
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
                                          </div>
                                    </Form.Group>

                                    <Form.Group as={Col} md="6" controlId="confirmPassword" className='p-2'>
                                          <Form.Label>إعادة كتابة كلمة المرور <span>*</span></Form.Label>
                                          <div className="position-relative">
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
                                          </div>
                                    </Form.Group>
                              </Row>

                              <Row className="mb-2">
                                    <Form.Group as={Col} md="12" controlId="emergencyNumber" className='p-2'>
                                          <Form.Label>رقم الهاتف <span>*</span></Form.Label>
                                          <Form.Control {...register('phoneNumber')} required type="text" placeholder="أدخل رقم الهاتف" />
                                    </Form.Group>
                              </Row>

                              <Row className="mb-3 px-2 mt-2">
                                    <Form.Label>أدخل رمز PIN لفتح الملف الشخصي (4 أرقام) <span>غير ملزم</span></Form.Label>
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
                                                            const val = e.target.value.replace(/\D/g, '') // بس أرقام
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
                                                      isInvalid={validated && pin[index] === ''}
                                                />
                                          ))}
                                    </div>
                                    <span>يستخدم هذا الرقم (Pin Code) لإظهار الملف الطبي الشخصي عند الجهات الطبية (دكتور، مركز آشعة، معمل تحاليل، صيدلية) وفي حالة عدم كتابته يكون الملف متاح الإطلاع عليه من قبل أي شخص يملك بياناتك الشخصية</span>
                                    {validated && pin.some((p) => p === '') && (
                                          <div className="text-danger mt-1">يجب إدخال رمز PIN مكون من 4 أرقام</div>
                                    )}
                              </Row>

                              <Row className="mb-3 px-2 mt-2">
                                    <Form.Group as={Col} md="12" controlId="role">
                                          <Form.Label>نوع المستخدم <span>*</span></Form.Label>
                                          <Form.Select required {...register('role')}>
                                                <option value="">اختر الدور</option>
                                                <option value="patient">مستخدم</option>
                                                <option value="doctor">عيادة</option>
                                                <option value="pharmacist">صيدلية</option>
                                                <option value="lab">معمل تحاليل</option>
                                                <option value="radiology">مركز أشعة</option>
                                          </Form.Select>
                                          <Form.Control.Feedback type="invalid">هذا الحقل مطلوب</Form.Control.Feedback>
                                    </Form.Group>
                              </Row>

                              <Row className="mb-3 px-2 mt-2">
                                    <Form.Group as={Col} md="12" controlId="gender">
                                          <Form.Label>الجنس <span>*</span></Form.Label>
                                          <Form.Select required {...register('gender')}>
                                                <option value="">اختر الجنس</option>
                                                <option value="ذكر">ذكر</option>
                                                <option value="انثي">انثي</option>
                                          </Form.Select>
                                          <Form.Control.Feedback type="invalid">هذا الحقل مطلوب</Form.Control.Feedback>
                                    </Form.Group>
                              </Row>

                              <Row className="mb-3 px-2 mt-2">
                                    <Button type="submit" className="mt-3">تسجيل</Button>
                              </Row>
                        </Form>
                        <div className="col-lg-6 d-none d-lg-flex justify-content-center">
                              <Lottie animationData={registerAnimation} />
                        </div>
                  </Container>
            </section>
      )
}
