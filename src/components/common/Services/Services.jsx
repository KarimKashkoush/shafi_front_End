import medicalFiles from "../../../assets/images/medical_files.png";
import medicalReport from "../../../assets/images/Medical_report.png";
import medicalTest from "../../../assets/images/Medical_tests.png";
import pharmaceutical from "../../../assets/images/pharmaceutical.png";
import radiology from "../../../assets/images/radiology.png";
import "./style.css"

export default function Services() {
      return (
            <section className='services'>
                  <section className="section-header">
                        <h2 className="section-title"><span>خــــ</span>دماتنا</h2>
                        <p className="section-subtitle">نقدم مجموعة متنوعة من الخدمات التي تلبي احتياجاتك</p>
                  </section>

                  <section className="boxs row justify-content-center">
                        <section className="box col-5 col-md-3 col-xl-2 p-3">
                              <img src={medicalReport} alt="" />
                              <p>التقــارير الطبية</p>
                              <span>تخزين كافة التقارير الطبية الخاصة بالمريض</span>
                        </section>
                        <section className="box col-5 col-md-3 col-xl-2 p-3">
                              <img src={radiology} alt="" />
                              <p>الأشـعـة</p>
                              <span>حفظ صور الأشعة لسهولة الرجوع إليها</span>
                        </section>
                        <section className="box col-5 col-md-3 col-xl-2 p-3">
                              <img src={medicalTest} alt="" />
                              <p>التحــاليل الطبية</p>
                              <span>تجميع كافة نتائج التحاليل الطبية في مكان واحد</span>
                        </section>
                        <section className="box col-5 col-md-3 col-xl-2 p-3">
                              <img src={pharmaceutical} alt="" />
                              <p>الأدويــة</p>
                              <span>متابعة الأدوية الموصوفة من قبل الطبيب</span>
                        </section>
                        <section className="box col-5 col-md-3 col-xl-2 p-3">
                              <img src={medicalFiles} alt="" />
                              <p>الملفــات الطبية</p>
                              <span>إدارة وتنظيم الملفات الطبية لكل مريض بشكل آمن</span>
                        </section>
                  </section>

            </section>
      )
}
