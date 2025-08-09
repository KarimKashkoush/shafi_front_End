import {  useState } from 'react';
import { Container, Col, Row, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Lottie from 'lottie-react';
import LoginAnimation from "../../assets/animation/login.json";
import { getDatabase, ref, get } from "firebase/database";


export default function Login() {
      const navigate = useNavigate();
      const [validated, setValidated] = useState(false);
      const [password, setPassword] = useState('');
      const [loading, setLoading] = useState(false);

      const handleSubmit = async (event) => {
            event.preventDefault();
            const form = event.currentTarget;
            setValidated(true);

            const identifier = form.email.value.trim();
            const enteredPassword = password.trim();

            try {
                  setLoading(true);
                  const db = getDatabase();
                  const usersSnap = await get(ref(db, 'UsersData'));
                  const users = usersSnap.val();

                  if (!users) throw new Error("لا يوجد مستخدمون مسجلون");
                  console.log(Object.entries(users))

                  const matchedUserEntry = Object.entries(users).find(([uid, user]) =>
                        (user.email === identifier || user.phoneNumber === identifier) &&
                        user.password === enteredPassword
                  );


                  if (!matchedUserEntry) {
                        alert("البريد الإلكتروني أو رقم الهاتف أو كلمة المرور غير صحيحة");
                        return;
                  }

                  const [uid, userData] = matchedUserEntry;

                  // جلب تقارير المستخدم
                  const reportsSnap = await get(ref(db, 'Reports'));
                  const allReports = reportsSnap?.val() || {};
                  const userReports = Object.values(allReports).filter(report => report.user_id === uid);

                  // حفظ البيانات
                  const payload = {
                        email: userData.email,
                        uid,
                        UserData: userData,
                        Reports: userReports,
                  };

                  localStorage.setItem('user', JSON.stringify(payload));

                  alert("تم تسجيل الدخول بنجاح");
                  navigate("/", { replace: true });

            } catch (error) {
                  console.error("Login error:", error);
                  alert("فشل في تسجيل الدخول: " + error.message);
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
                                    <Form.Group as={Col} md="12" controlId="email" className='p-2'>
                                          <Form.Label>البريد الإلكتروني أو رقم الهاتف</Form.Label>
                                          <Form.Control required type="text" placeholder="أدخل البريد أو رقم الهاتف" />
                                          <Form.Control.Feedback type="invalid">
                                                برجاء إدخال البريد الإلكتروني أو رقم الهاتف
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

