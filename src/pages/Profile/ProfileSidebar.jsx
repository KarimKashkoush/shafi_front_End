import { NavLink } from "react-router";
import Logo from "../../components/common/Logo/Logo";
import LogOutImg from "../../assets/images/logout.png";
import { useContext } from "react";
import { AuthContext } from "../../context/Auth.Context";
import { useNavigate } from "react-router-dom";
export default function ProfileSidebar({ links }) {
      const { user, setUser, setToken } = useContext(AuthContext);
      const id = user ? user.id : null;
      const navigate = useNavigate();
      const handleLogout = () => {
            // مسح البيانات من localStorage
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            localStorage.removeItem("theme");

            // تحديث الـ context فورًا
            setUser(null);
            setToken(null);

            // التحويل لصفحة تسجيل الدخول
            navigate("/");
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

