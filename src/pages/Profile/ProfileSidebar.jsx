import { NavLink } from "react-router";
import Logo from "../../components/common/Logo/Logo";
import MedicalDataImg from "../../assets/images/medical-data.png";
import ProfileImg from "../../assets/images/profile.png";
import LogOutImg from "../../assets/images/logout.png";
import { useContext } from "react";
import { AuthContext } from "../../context/Auth.Context";


export default function ProfileSidebar() {
      const { user } = useContext(AuthContext)
      const id = user ? user.id : null;
      const handleLogout = () => {
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            localStorage.removeItem("theme");
      };

      return (
            <section className="profile-sidebar">
                  <Logo />
                  <ul>
                        <li>
                              <NavLink to={`/profile/${id}`} end>
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
