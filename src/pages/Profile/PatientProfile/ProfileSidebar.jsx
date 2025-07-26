import { NavLink } from "react-router";
import Logo from "../../../components/common/Logo/Logo";
import MedicalDataImg from "../../../assets/images/medical-data.png";
import ProfileImg from "../../../assets/images/profile.png";
import LogOutImg from "../../../assets/images/logout.png";
import { getAuth, signOut } from "firebase/auth";

export default function ProfileSidebar() {
      const handleLogout = () => {
            const auth = getAuth();
            signOut(auth)
                  .then(() => {
                        localStorage.removeItem("user");
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
                              <NavLink to={`/profile/${4}`}>
                                    <img src={MedicalDataImg} alt={MedicalDataImg} loading="lazy" />
                                    <span>
                                          البيانات الطبية
                                    </span>
                              </NavLink>
                        </li>
                        <li>
                              <NavLink to='/dashboard'>
                                    <img src={ProfileImg} alt={ProfileImg} loading="lazy" />
                                    <span>
                                          بيانات الحساب
                                    </span>
                              </NavLink>
                        </li>
                        <li>
                              <NavLink to="/" onClick={handleLogout}>
                                    <img src={LogOutImg} alt="Log out" loading="lazy" />
                                    <span>تسجيل الخروج</span>
                              </NavLink>
                        </li>
                  </ul>
            </section>
      )
}
