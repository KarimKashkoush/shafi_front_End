import Lottie from "lottie-react";
import ContactUsAnimation from '../../../assets/animation/Connectus.json'
import './style.css'
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import InputForm from "../../Forms/InputForm";


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
                              <Lottie animationData={ContactUsAnimation} className="animation" />
                        </section>

                        <section className="form col-12 col-md-6">
                              <Form noValidate validated={validated} onSubmit={handleSubmit}>
                                    <Row className="mb-3">
                                          <InputForm type="text" labelName='الاسم' placeholder='الاسم' errorMassage='من فضلك أدخل اسم صحيح'/>
                                          <InputForm type="email" labelName='البريد الالكتروني' placeholder="الايمل الشخصي" errorMassage='من فضلك أدخل بريد الكتروني صحيح'/>
                                          <InputForm type="textarea" labelName='رسالتك' placeholder="أدخل رسالتك" errorMassage='من فضلك أدخل الرسالة'/>
                                    </Row>

                                    <Button type="submit">إرســـال</Button>
                              </Form>
                        </section>
                  </section>
            </section>
      )
}
