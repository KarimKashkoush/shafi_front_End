import { CiPlay1 } from "react-icons/ci";
import Lottie from "lottie-react";
import heroAnimation from '../../assets/animation/animation.json'
import 'react-lazy-load-image-component/src/effects/blur.css';
import SearchUser from "../../components/SearchUser/SearchUser";
export default function Hero() {
      return (
            <>
                  <section className="hero">
                        <section className="row align-items-center ">
                              <section className="content col-xl-6">
                                    <h1>نحن نهتم بصحتك</h1>
                                    <p>نُنشئ لك ملفًا رقميًا متكاملًا يُسهّل عليك متابعة حالتك الصحية في أي وقت ومن أي مكان. هذا الملف يضم جميع تقاريرك الطبية، وصور الأشعة الخاصة بك، ونتائج التحاليل المعملية، بالإضافة إلى قائمة الأدوية التي تم وصفها لك من قبل الأطباء. هدفنا هو توفير تجربة طبية موحدة ومتكاملة تحفظ تاريخك الصحي وتُسهّل مشاركته مع الأطباء والمراكز الطبية عند الحاجة.</p>
                                    <SearchUser />
                              </section>

                              <section className="animation col-xl-6">
                                    <Lottie animationData={heroAnimation} className="animation" />
                              </section>

                        </section>
                  </section>
            </>
      )
}
