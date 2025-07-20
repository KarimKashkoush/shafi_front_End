import aboutImage from '../../assets/images/about.png';
import aboutServices from '../../assets/images/about-services.png';
import aboutGoal from '../../assets/images/about-goal.png';
import aboutusers from '../../assets/images/about-team.png';

import { FaCheck } from "react-icons/fa6";
export default function About() {
      return (
            <section className="about">
                  <section className="section-header">
                        <h2 className="section-title"><span> عــن </span>شَـــافِي </h2>
                        <p className="section-subtitle">نحن نقدم خدمات حفظ التقارير الطبية</p>
                  </section>

                  <section className="content">
                        <section className='box'>
                              <section className="title">
                                    <img src={aboutImage} alt="About Shafi" loading='lazy' />
                                    <h2>عن نظام شافي لحفظ وإدارة البيانات الطبية</h2>
                              </section>
                              <p>نظام <span>شافي</span> هو منصة رقمية ذكية صُممت خصيصًا لتسهيل إدارة البيانات الطبية للمريض بشكل مركزي وآمن، ويعمل كحل متكامل لحفظ وتتبع التاريخ الطبي لكل مريض، مع تمكين الأطراف المعنية (الأطباء، المعامل، مراكز الأشعة، والصيدليات) من التعاون وتبادل البيانات بسهولة وسرعة.
                                    <br />
                                    في ظل التطور السريع في التكنولوجيا الطبية، أصبح من الضروري وجود نظام يربط بين مختلف مزودي الخدمة الصحية، ويُمكن المرضى من الوصول إلى بياناتهم الطبية في أي وقت ومن أي مكان. وهنا يأتي دور شافي ليكون الأداة المثالية لتحقيق هذا الهدف.
                              </p>
                        </section>

                        <section className='box'>
                              <section className="title">
                                    <img src={aboutServices} alt="About Shafi" loading='lazy' />
                                    <h2>ما الذي يقدمه لك نظام شافي؟</h2>
                              </section>

                              <section>
                                    <section className="sub-title">
                                          <FaCheck />
                                          <h4>التقارير الطبية</h4>
                                    </section>
                                    <p>يتيح النظام حفظ ومتابعة كل ما يتعلق بالتقارير الطبية، بدايةً من تشخيص الطبيب، مرورًا بتقارير الدخول والخروج، وانتهاءً بملاحظات المتابعة في العيادات المختلفة. كل تقرير يتم أرشفته وربطه بملف المريض تلقائيًا.</p>
                              </section>

                              <section>
                                    <section className="sub-title">
                                          <FaCheck />
                                          <h4>الأشعة</h4>
                                    </section>
                                    <p>تكامل "شافي" مع أنظمة الأشعة المختلفة (X-ray, CT, MRI... إلخ) لحفظ صور الأشعة الرقمية داخل النظام مباشرة، مع إمكانية عرضها للطبيب من أي جهاز متصل بالإنترنت، دون الحاجة إلى أقراص أو نسخ ورقية.</p>
                              </section>

                              <section>
                                    <section className="sub-title">
                                          <FaCheck />
                                          <h4>التحاليل الطبية</h4>
                                    </section>
                                    <p>يمكن لمعامل التحاليل ربط نتائج المرضى مباشرة بملفهم على النظام، مما يقلل من فرص ضياع النتائج، ويُمكّن الطبيب من الرجوع إليها في أي وقت للمقارنة أو المتابعة.</p>
                              </section>

                              <section>
                                    <section className="sub-title">
                                          <FaCheck />
                                          <h4>الأدوية</h4>
                                    </section>
                                    <p>يتم تسجيل الأدوية التي تم وصفها للمريض في كل زيارة، مع تحديد الجرعات، وفترة الاستخدام، مما يساعد على متابعة خطة العلاج بدقة، وتفادي تكرار أو تعارض الأدوية.</p>
                              </section>

                              <section>
                                    <section className="sub-title">
                                          <FaCheck />
                                          <h4>إدارة الملفات الطبية</h4>
                                    </section>
                                    <p>يُنشئ النظام ملفًا طبيًا رقميًا شاملًا لكل مريض، يحتوي على جميع البيانات منذ أول زيارة وحتى اللحظة، ويمكن تحديثه بشكل تلقائي عند إدخال أي بيانات جديدة، سواء من الطبيب أو من المعمل أو من مركز الأشعة.</p>
                              </section>
                        </section>

                        <section className="box">
                              <section className="title">
                                    <img src={aboutGoal} alt="About Shafi" loading='lazy' />
                                    <h2>أهداف نظام شافي</h2>
                              </section>

                              <section>
                                    <section className="sub-title">
                                          <FaCheck />
                                          <h4>رقمنة الإدارة الطبية</h4>
                                    </section>
                                    <p>تحويل جميع التعاملات الورقية داخل المنشآت الطبية إلى تعاملات إلكترونية ذكية لتقليل الوقت والجهد وتحسين جودة الخدمة.</p>
                              </section>

                              <section>
                                    <section className="sub-title">
                                          <FaCheck />
                                          <h4>بناء سجل طبي متكامل للمريض</h4>
                                    </section>
                                    <p>من خلال تسجيل كل البيانات المرتبطة بالحالة الصحية للمريض، ليكون الطبيب على اطلاع شامل بتاريخه الطبي.</p>
                              </section>

                              <section>
                                    <section className="sub-title">
                                          <FaCheck />
                                          <h4>تسهيل التكامل بين مقدمي الرعاية الصحية</h4>
                                    </section>
                                    <p>حيث يمكن للمعامل، مراكز الأشعة، والصيدليات العمل ضمن نفس النظام لتبادل البيانات فورًا دون وسيط.</p>
                              </section>

                              <section>
                                    <section className="sub-title">
                                          <FaCheck />
                                          <h4>تحقيق المتابعة المستمرة</h4>
                                    </section>
                                    <p>يُمكّن الأطباء من متابعة المرضى حتى خارج المنشأة الطبية، سواء من العيادة الخاصة أو من المنزل.</p>
                              </section>

                              <section>
                                    <section className="sub-title">
                                          <FaCheck />
                                          <h4>تحليل البيانات الطبية والإدارية</h4>
                                    </section>
                                    <p>للحصول على إحصائيات دقيقة تساعد في تحسين الخدمات الصحية، دعم اتخاذ القرار، والمساهمة في الأبحاث الطبية.</p>
                              </section>
                        </section>

                        <section className="box">
                              <section className="title">
                                    <img src={aboutusers} alt="About Shafi" loading='lazy' />
                                    <h2>لمن صُمم نظام شافي؟</h2>
                              </section>

                              <section>
                                    <p>العيادات الخاصة والمراكز الطبية المتوسطة</p>
                              </section>

                              <section>
                                    <p>المستشفيات العامة والخاصة</p>
                              </section>

                              <section>
                                    <p>معامل التحاليل</p>
                              </section>

                              <section>
                                    <p>مراكز الأشعة</p>
                              </section>

                              <section>
                                    <p>الجهات الحكومية والمؤسسات التعليمية في المجال الطبي</p>
                              </section>
                        </section>
                  </section>
            </section>
      )
}
