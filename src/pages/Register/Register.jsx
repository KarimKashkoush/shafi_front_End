import React, { useState, useRef } from 'react'
import { Container, Col, Row, Form, Button } from 'react-bootstrap'
import Lottie from 'lottie-react'

export default function Register() {
      const [validated, setValidated] = useState(false)
      const [password, setPassword] = useState('')
      const [confirmPassword, setConfirmPassword] = useState('')
      const [passwordMatchError, setPasswordMatchError] = useState(false)
      const [agreed, setAgreed] = useState(false)
      const [pin, setPin] = useState(['', '', '', ''])
      const pinRefs = [useRef(), useRef(), useRef(), useRef()]
      const handleSubmit = (event) => {
            const form = event.currentTarget

            const passwordsMatch = password === confirmPassword
            const formValid = form.checkValidity()

            if (!formValid || !passwordsMatch) {
                  event.preventDefault()
                  event.stopPropagation()
            }

            setPasswordMatchError(!passwordsMatch)
            setValidated(true)
      }



      return (
            <section className="register-login vh-100 d-flex align-items-center justify-content-center">
                  <Container className='row mx-auto align-items-center py-4'>

                        <section className="image col-md-6 p-3">
                              <Lottie />
                              <h2>aaaa</h2>
                        </section>

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
                                    <Form.Label className='p-2 pb-0'>تاريخ الميلاد<span>*</span></Form.Label>
                                    <Form.Group as={Col} md="4" controlId="year" className='p-2 pt-0'>
                                          <Form.Control required type="number" placeholder="سنة الميلاد" min={1900} max={2025} />
                                          <Form.Control.Feedback type="invalid">سنة الميلاد غير صحيحة</Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group as={Col} md="4" controlId="month" className='p-2 pt-0'>
                                          <Form.Control required type="number" placeholder="شهر الميلاد" min={1} max={12} />
                                          <Form.Control.Feedback type="invalid">شهر الميلاد غير صحيح</Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group as={Col} md="4" controlId="day" className='p-2 pt-0'>
                                          <Form.Control required type="number" placeholder="يوم الميلاد" min={1} max={31} />
                                          <Form.Control.Feedback type="invalid">يوم الميلاد غير صحيح</Form.Control.Feedback>
                                    </Form.Group>
                              </Row>

                              <Row className="mb-2">
                                    <Form.Group as={Col} md="12" controlId="phone" className='p-2'>
                                          <Form.Label>رقم الهاتف المحمول</Form.Label>
                                          <Form.Control required type="text" placeholder="أدخل رقم الهاتف المحمول" pattern="^01[0-2,5]{1}[0-9]{8}$" />
                                          <Form.Control.Feedback type="invalid">برجاء إدخال رقم صحيح</Form.Control.Feedback>
                                    </Form.Group>
                              </Row>

                              <Row className="mb-2">
                                    <Form.Group as={Col} md="12" controlId="emergencyPhone" className='p-2'>
                                          <Form.Label>رقم الهاتف المحمول للطوارئ</Form.Label>
                                          <Form.Control required type="text" placeholder="أدخل رقم الهاتف المحمول للطوارئ" pattern="^01[0-2,5]{1}[0-9]{8}$" />
                                          <Form.Control.Feedback type="invalid">برجاء إدخال رقم صحيح</Form.Control.Feedback>
                                    </Form.Group>
                              </Row>

                              <Row className="mb-2">
                                    <Form.Group as={Col} md="12" controlId="bloodType" className="p-2">
                                          <Form.Label>نوع فصيلة الدم</Form.Label>
                                          <Form.Select required defaultValue="">
                                                <option value="" disabled>اختر نوع فصيلة الدم</option>
                                                <option value="A+" dir='ltr'>A+</option>
                                                <option value="A-" dir='ltr'>A-</option>
                                                <option value="B+" dir='ltr'>B+</option>
                                                <option value="B-" dir='ltr'>B-</option>
                                                <option value="AB+" dir='ltr'>AB+</option>
                                                <option value="AB-" dir='ltr'>AB-</option>
                                                <option value="O+" dir='ltr'>O+</option>
                                                <option value="O-" dir='ltr'>O-</option>
                                          </Form.Select>
                                          <Form.Control.Feedback type="invalid">برجاء اختيار فصيلة الدم</Form.Control.Feedback>
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


                              <Row className="mb-3 px-2 mt-3">
                                    <Form.Check
                                          type="checkbox"
                                          id="terms"
                                          label="أوافق على الشروط والأحكام"
                                          checked={agreed}
                                          onChange={(e) => setAgreed(e.target.checked)}
                                          isInvalid={!agreed && validated}
                                          feedback="يجب الموافقة على الشروط والأحكام"
                                          feedbackType="invalid"
                                    />
                              </Row>


                              <Button type="submit" className="mt-3">تسجيل</Button>
                        </Form>
                  </Container>
            </section>
      )
}
