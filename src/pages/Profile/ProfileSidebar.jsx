import { NavLink } from "react-router";
import Logo from "../../components/common/Logo/Logo";
import MedicalDataImg from "../../assets/images/medical-data.png";
import ProfileImg from "../../assets/images/profile.png";
import LogOutImg from "../../assets/images/logout.png";
import { useContext } from "react";
import { AuthContext } from "../../context/Auth.Context";

export default function ProfileSidebar({ links }) {
      const { user } = useContext(AuthContext);
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
                        {links.map((link, idx) => (
                              <li key={idx}>
                                    <NavLink to={link.to.replace(":id", id)} end>

                                          <img src={link.icon} alt={link.alt || ""} loading="lazy" />
                                          <span>{link.label}</span>
                                    </NavLink>
                              </li>
                        ))}
                        <li>
                              <NavLink to="/" onClick={handleLogout}>
                                    <img src={LogOutImg} alt="Logout" loading="lazy" />
                                    <span>تسجيل الخروج</span>
                              </NavLink>
                        </li>
                  </ul>
            </section>
      );
}

