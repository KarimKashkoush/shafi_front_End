import { useState } from 'react'
import { Container, Col, Row, Form, Button } from 'react-bootstrap'
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from 'react-router-dom';

export default function Login() {
      const navigate = useNavigate();
      const [validated, setValidated] = useState(false);
      const [password, setPassword] = useState('');


      const handleSubmit = async (event) => {
            event.preventDefault();
            const form = event.currentTarget;

            setValidated(true);

            const email = form.email.value;

            const auth = getAuth();

            try {
                  const userCredential = await signInWithEmailAndPassword(auth, email, password);
                  const user = userCredential.user;
                  localStorage.setItem('user', JSON.stringify(user));
                  alert("تم تسجيل الدخول بنجاح");
                  console.log("User Info:", user);
                  navigate("/", { replace: true, user: { user } });

            } catch (error) {
                  console.error(error);
                  alert("فشل في تسجيل الدخول: " + error.message);
            }
      };

      return (
            <section className="register-login vh-100 d-flex align-items-center justify-content-center">
                  <Container className='row mx-auto align-items-center py-4'>
                        <Form noValidate validated={validated} onSubmit={handleSubmit} className="form col-md-6 p-3">

                              <Row className="mb-2">
                                    <Form.Group as={Col} md="12" controlId="email" className='p-2'>
                                          <Form.Label>البريد الإلكتروني</Form.Label>
                                          <Form.Control required type="email" placeholder="أدخل بريدك الإلكتروني" />
                                          <Form.Control.Feedback type="invalid">
                                                برجاء إدخال بريد إلكتروني صحيح
                                          </Form.Control.Feedback>
                                    </Form.Group>
                              </Row>

                              <Row className="mb-2">
                                    <Form.Group as={Col} md="12" controlId="password" className='p-2'>
                                          <Form.Label>كلمة المرور</Form.Label>
                                          <Form.Control
                                                required
                                                type="password"
                                                placeholder="أدخل كلمة المرور"
                                                minLength={6}
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                          />
                                          <Form.Control.Feedback type="invalid">
                                                كلمة المرور مطلوبة
                                          </Form.Control.Feedback>
                                    </Form.Group>
                              </Row>

                              <Button type="submit" className="mt-3">تسجيل الدخول</Button>
                        </Form>
                  </Container>
            </section>
      )
}
