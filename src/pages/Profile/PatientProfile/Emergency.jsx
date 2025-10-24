import blodImage from '../../../assets/images/red-blood-cells.png'
import growth from "../../../assets/images/growth.png"
import folders from "../../../assets/images/folder.png"
import call from "../../../assets/images/emergency-call.png"


function calculateAge(birthDateString) {
      const today = new Date();
      const birthDate = new Date(birthDateString);
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();

      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
      }

      return age;
}

export default function Emergency({ userData, reportsCount }) {
      const age = userData?.birthDate ? calculateAge(userData.birthDate) : null;
      age !== null && (age < 0 || isNaN(age)) ? "غير معروف" : age;
      const blood = userData ? userData.blood : "غير معروف";
      const emergencyNumber = userData ? userData.emergencyNumber : "غير معروف";
      const displayAge = age === null || age < 0 || isNaN(age) ? "غير معروف" : age;
      return (
            <section className="emergency col-12">
                  <section className="boxs row g-3">
                        <section className="col-6 col-md-3 px-2">
                              <section className="box box-bg">
                                    <img src={growth} alt="growth" />
                                    <p>العمر</p>
                                    <span dir='ltr'>{displayAge}</span>
                              </section>
                        </section>

                        <section className="col-6 col-md-3 px-2">
                              <section className="box box-bg">
                                    <img src={blodImage} alt="blodImage" />
                                    <p>فصيلة الدم</p>
                                    <span dir='ltr'>{!blood ? "غير معروف" : blood}</span>
                              </section>
                        </section>

                        <section className="col-6 col-md-3 px-2">
                              <section className="box box-bg">
                                    <img src={call} alt="call" />
                                    <p>أرقام الطوارئ</p>
                                    <span dir='ltr'>{!emergencyNumber ? "غير معروف" : emergencyNumber}</span>                              </section>
                        </section>

                        <section className="col-6 col-md-3 px-2">
                              <section className="box box-bg">
                                    <img src={folders} alt="folders" />
                                    <p>عدد التقارير</p>
                                    <span dir='ltr'>{reportsCount}</span>
                              </section>
                        </section>
                  </section>
            </section>
      )
}

