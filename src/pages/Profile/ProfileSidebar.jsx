import { NavLink } from "react-router";
import Logo from "../../components/common/Logo/Logo";
import MedicalDataImg from "../../assets/images/medical-data.png";
import ProfileImg from "../../assets/images/profile.png";
import LogOutImg from "../../assets/images/logout.png";
import { getAuth, signOut } from "firebase/auth";
const user = JSON.parse(localStorage.getItem("user"));

export default function ProfileSidebar() {
      const uid = user ? user.uid : null;
      const handleLogout = () => {
            const auth = getAuth();
            signOut(auth)
                  .then(() => {
                        localStorage.removeItem("user");
                        window.location.reload();
                  })
                  .catch((error) => {
                        console.error("خطأ أثناء تسجيل الخروج:", error.message);
                  });
      };

      return (
            <section className="profile-sidebar">
                  <Logo />
                  <ul>
                        <li>
                              <NavLink to={`/profile/${uid}`} end>
                                    <img src={MedicalDataImg} alt={MedicalDataImg} loading="lazy" />
                                    <span>
                                          البيانات الطبية
                                    </span>
                              </NavLink>
                        </li>
                        <li>
                              <NavLink to={`userData`} end>
                                    <img src={ProfileImg} alt={ProfileImg} loading="lazy" />
                                    <span>
                                          بيانات الحساب
                                    </span>
                              </NavLink>
                        </li>
                        <li>
                              <NavLink to="/" onClick={handleLogout} end>
                                    <img src={LogOutImg} alt="Log out" loading="lazy" />
                                    <span>تسجيل الخروج</span>
                              </NavLink>
                        </li>
                  </ul>
            </section>
      )
}
