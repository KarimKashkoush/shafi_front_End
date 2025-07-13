import Lottie from "lottie-react";
// import ContactUsAnimation from '../../../assets/icons/Connect with us.json'
import './style.css'
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';


export default function ContactUs() {
      const [validated, setValidated] = useState(false);

      const handleSubmit = (event) => {
            const form = event.currentTarget;
            if (form.checkValidity() === false) {
                  event.preventDefault();
                  event.stopPropagation();
            }

            setValidated(true);
      };
      return (
            <section className="contactus">
                  <section className="section-header">
                        <h2 className="section-title"><span> تــواصل </span>معنــا </h2>
                        <p className="section-subtitle">نحن هنا لمساعدتك والإجابة عن جميع استفساراتك</p>
                  </section>

                  <section className="content row align-items-center">
                        <section className="animation col-12 col-md-6">
                              {/* <Lottie animationData={ContactUsAnimation} className="animation" /> */}
                        </section>

                        <section className="form col-12 col-md-6">
                              <Form noValidate validated={validated} onSubmit={handleSubmit}>
                                    <Row className="mb-3">
                                          <Form.Group as={Col} md="12" controlId="validationCustom01" className="mb-3">
                                                <Form.Label>الاسم</Form.Label>
                                                <Form.Control
                                                      required
                                                      type="text"
                                                      placeholder="الاسم"
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                      من فضلك أدخل اسم صحيح
                                                </Form.Control.Feedback>
                                          </Form.Group>

                                          <Form.Group as={Col} md="12" controlId="validationCustom02" className="mb-3">
                                                <Form.Label>البريد الالكتروني</Form.Label>
                                                <Form.Control
                                                      required
                                                      type="email"
                                                      placeholder="الايمل الشخصي"
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                      من فضلك أدخل ايميل صحيح
                                                </Form.Control.Feedback>
                                          </Form.Group>

                                          <Form.Group as={Col} md="12" controlId="validationCustom03" className="mb-3">
                                                <Form.Label>الرسالة</Form.Label>
                                                <Form.Control
                                                      as="textarea"
                                                      rows={4}
                                                      required
                                                      placeholder="رسالتك"
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                      من فضلك أدخل الرسالة
                                                </Form.Control.Feedback>
                                          </Form.Group>
                                    </Row>

                                    <Button type="submit">إرســـال</Button>
                              </Form>
                        </section>
                  </section>
            </section>
      )
}
