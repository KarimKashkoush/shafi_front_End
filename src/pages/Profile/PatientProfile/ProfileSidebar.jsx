import { NavLink } from "react-router";
import Logo from "../../../components/common/Logo/Logo";
import MedicalDataImg from "../../../assets/images/medical-data.png";
import ProfileImg from "../../../assets/images/profile.png";
import LogOutImg from "../../../assets/images/logout.png";

export default function ProfileSidebar() {
      return (
            <section className="profile-sidebar">
                  <Logo />

                  <ul>
                        <li>
                              <NavLink to='/profile'>
                              <img src={MedicalDataImg} alt={MedicalDataImg} loading="lazy"/>
                              <span>
                                    البيانات الطبية
                              </span>
                              </NavLink>
                        </li>
                        <li>
                              <NavLink to='/dashboard'>
                              <img src={ProfileImg} alt={ProfileImg} loading="lazy"/>
                                    <span>
                                          بيانات الحساب
                                    </span>
                              </NavLink>
                        </li>
                        <li>
                              <NavLink to='/dashboard'>
                              <img src={LogOutImg} alt={LogOutImg} loading="lazy"/>
                                    <span>تسجيل الخروج</span>
                              </NavLink>
                        </li>
                  </ul>
            </section>
      )
}
