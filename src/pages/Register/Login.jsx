import { useContext, useState } from 'react';
import { Container, Col, Row, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Lottie from 'lottie-react';
import LoginAnimation from "../../assets/animation/login.json";
import { toast } from "react-toastify";
import api from "../../lib/api";
import { AuthContext } from '../../context/Auth.Context';

export default function Login() {
      const { setUser, setToken } = useContext(AuthContext)
      const navigate = useNavigate();
      const [validated, setValidated] = useState(false);
      const [emailOrPhone, setEmailOrPhone] = useState('');
      const [password, setPassword] = useState('');
      const [loading, setLoading] = useState(false);

      const handleSubmit = async (event) => {
            event.preventDefault();
            setValidated(true);

            if (!emailOrPhone || !password) {
                  toast.error("الرجاء إدخال البريد أو الهاتف وكلمة المرور");
                  return;
            }

            try {
                  setLoading(true);
                  const payload = emailOrPhone.includes("@")
                        ? { email: emailOrPhone, password }
                        : { phoneNumber: emailOrPhone, password };

                  const res = await api.post(`/login`, payload);

                  
                  if (res.data.message === "success") {
                        localStorage.setItem("token", res.data.token);
                        localStorage.setItem("user", JSON.stringify(res.data.user));
                        setUser(res.data.user)
                        setToken(res.data.token)
                        setLoading(false);
                        toast.success("تم تسجيل الدخول بنجاح");
                        navigate("/", { replace: true });
                  } else {
                        setLoading(false);
                        toast.error(res.data.message);
                  }
            } catch (error) {
                  toast.error(error.response?.data?.message || "فشل تسجيل الدخول");
            } finally {
                  setLoading(false);
            }
      };

      return (
            <section className="py-5 register-login min-vh-100 d-flex flex-column align-items-center justify-content-center">
                  <h3 className='fw-semibold'><span>تسجيل</span> الدخول</h3>
                  <Container className='row mx-auto align-items-center py-4'>
                        <Form noValidate validated={validated} onSubmit={handleSubmit} className="form col-md-6 p-3">
                              <Row className="mb-2">
                                    <Form.Group as={Col} md="12" className='p-2'>
                                          <Form.Label>البريد الإلكتروني أو رقم الهاتف</Form.Label>
                                          <Form.Control
                                                required
                                                type="text"
                                                placeholder="أدخل البريد أو رقم الهاتف"
                                                value={emailOrPhone}
                                                onChange={(e) => setEmailOrPhone(e.target.value)}
                                          />
                                          <Form.Control.Feedback type="invalid">
                                                برجاء إدخال البريد الإلكتروني أو رقم الهاتف
                                          </Form.Control.Feedback>
                                    </Form.Group>
                              </Row>

                              <Row className="mb-2">
                                    <Form.Group as={Col} md="12" className='p-2'>
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

                              <Button type="submit" className="mt-3" disabled={loading}>
                                    {loading ? "جارٍ تسجيل الدخول..." : "تسجيل الدخول"}
                              </Button>
                        </Form>

                        <div className="col-md-6 d-none d-lg-flex justify-content-center">
                              <Lottie animationData={LoginAnimation} />
                        </div>
                  </Container>
            </section>
      );
}
