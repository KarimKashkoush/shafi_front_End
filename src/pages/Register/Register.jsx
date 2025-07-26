import React, { useState, useRef } from 'react'
import { Container, Col, Row, Form, Button } from 'react-bootstrap'
import Lottie from 'lottie-react'
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { ref, set } from "firebase/database";
import { database } from "../../firebase/firebase";

export default function Register() {
      const [validated, setValidated] = useState(false)
      const [password, setPassword] = useState('')
      const [confirmPassword, setConfirmPassword] = useState('')
      const [passwordMatchError, setPasswordMatchError] = useState(false)
      const [pin, setPin] = useState(['', '', '', ''])
      const pinRefs = [useRef(), useRef(), useRef(), useRef()]
      const handleSubmit = async (event) => {
            event.preventDefault();
            const form = event.currentTarget;
            const passwordsMatch = password === confirmPassword;
            const formValid = form.checkValidity();
            const pinCode = pin.join(''); // اجمع الأرقام الأربعة

            setValidated(true);
            setPasswordMatchError(!passwordsMatch);

            if (!formValid || !passwordsMatch || pin.some(p => p === '')) {
                  return;
            }

            const email = form.email.value;
            const fullName = form.fullName.value;
            const firstName = form.firstName.value;
            const emergencyNumber = form.emergencyNumber.value
            const birthDay = form.birthDay.value
            const bloodType = form.bloodType.value


            const auth = getAuth();
            const db = database;

            try {
                  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                  const uid = userCredential.user.uid;

                  // احفظ بيانات المستخدم
                  await set(ref(db, 'UsersData/' + uid), {
                        firstName,
                        fullName,
                        bloodType,
                        emergencyNumber,
                        birthDay,
                        pinCode,
                  });

                  alert("تم التسجيل بنجاح");
            } catch (error) {
                  console.error(error);
                  alert("حدث خطأ أثناء التسجيل: " + error.message);
            }
      };



      return (
            <section className="register-login vh-100 d-flex align-items-center justify-content-center">
                  <Container className='row mx-auto align-items-center py-4'>

                        <Form noValidate validated={validated} onSubmit={handleSubmit} className="form col-md-6 p-3">
                              <Row className="mb-2">
                                    <Form.Group as={Col} lg="3" controlId="firstName" className='p-2'>
                                          <Form.Label>الاسم الأول <span>*</span></Form.Label>
                                          <Form.Control required type="text" placeholder="أدخل الاسم الأول" />
                                          <Form.Control.Feedback type="invalid">الاسم الأول مطلوب</Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group as={Col} lg="9" controlId="fullName" className='p-2'>
                                          <Form.Label>باقي الاسم بالكامل <span>*</span></Form.Label>
                                          <Form.Control required type="text" placeholder="أدخل باقي الاسم بالكامل" />
                                          <Form.Control.Feedback type="invalid">هذا الحقل مطلوب</Form.Control.Feedback>
                                    </Form.Group>
                              </Row>

                              <Row className="mb-2">
                                    <Form.Group as={Col} md="12" controlId="email" className='p-2'>
                                          <Form.Label>الايميل الشخصي او رقم الهاتف</Form.Label>
                                          <Form.Control required type="email" placeholder="أدخل الايميل الشخصي او رقم الهاتف" />
                                          <Form.Control.Feedback type="invalid">برجاء إدخال بريد إلكتروني أو رقم هاتف صحيح</Form.Control.Feedback>
                                    </Form.Group>
                              </Row>

                              <Row className="mb-2">
                                    <Form.Group as={Col} md="6" controlId="password" className='p-2'>
                                          <Form.Label>كلمة المرور</Form.Label>
                                          <div className="position-relative">
                                                <Form.Control
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
                                          <Form.Label>إعادة كتابة كلمة المرور</Form.Label>
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
                                    <Form.Group as={Col} md="12" controlId="bloodType" className='p-2'>
                                          <Form.Label>فصيلة الدم</Form.Label>
                                          <Form.Control required type="text" placeholder="فصيلة الدم" />
                                    </Form.Group>
                              </Row>

                              <Row className="mb-2">
                                    <Form.Group as={Col} md="12" controlId="emergencyNumber" className='p-2'>
                                          <Form.Label>رقم الطوارئ</Form.Label>
                                          <Form.Control required type="text" placeholder="رقم الطوارئ" />
                                    </Form.Group>
                              </Row>



                              <Row className="mb-2">
                                    <Form.Group as={Col} md="12" controlId="birthDay" className='p-2'>
                                          <Form.Label>تاريخ الميلاد</Form.Label>
                                          <Form.Control required type="date" placeholder="" />
                                    </Form.Group>
                              </Row>





                              <Row className="mb-3 px-2 mt-2">
                                    <Form.Label className=''>أدخل رمز PIN لفتح الملف الشخصي (4 أرقام)</Form.Label>
                                    <div className="d-flex gap-2" dir="ltr">
                                          {pin.map((digit, index) => (
                                                <Form.Control
                                                      key={index}
                                                      ref={pinRefs[index]}
                                                      required
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
                                    {validated && pin.some((p) => p === '') && (
                                          <div className="text-danger mt-1">يجب إدخال رمز PIN مكون من 4 أرقام</div>
                                    )}
                              </Row>





                              <Button type="submit" className="mt-3">تسجيل</Button>
                        </Form>
                  </Container>
            </section>
      )
}
