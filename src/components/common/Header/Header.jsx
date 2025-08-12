import { useEffect, useState, useRef, useContext } from 'react';
import { NavLink } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Avatar from '@mui/material/Avatar';
import './style.css';
import Logo from '../Logo/Logo';
import { AuthContext } from '../../../context/Auth.Context';

export default function Header() {
      const { user } = useContext(AuthContext)
      const navRef = useRef();
      const [expanded, setExpanded] = useState(false);


      useEffect(() => {
            function handleClickOutside(event) {
                  if (navRef.current && !navRef.current.contains(event.target)) {
                        setExpanded(false);
                  }
            }

            document.addEventListener("mousedown", handleClickOutside);
            return () => {
                  document.removeEventListener("mousedown", handleClickOutside);
            };
      }, []);

      return (
            <header className="header mt-3 mb-3" ref={navRef}>
                  <Navbar expand="lg" expanded={expanded} className="align-items-center">
                        <Logo />

                        <Navbar.Toggle
                              aria-controls="basic-navbar-nav"
                              onClick={() => setExpanded(prev => !prev)}
                        >
                              {expanded ? <span>&#10005;</span> : <span>&#9776;</span>}
                        </Navbar.Toggle>

                        <Navbar.Collapse id="basic-navbar-nav">
                              <Nav className="me-auto">
                                    <NavLink to="/" className="nav-link" onClick={() => setExpanded(false)}>الرئيسية</NavLink>
                                    <NavLink to="/services" className="nav-link" onClick={() => setExpanded(false)}>خدماتنا</NavLink>
                                    <NavLink to="/about" className="nav-link" onClick={() => setExpanded(false)}>عن شَافِي</NavLink>

                                    <section className="auth-user d-flex gap-1">
                                          {user ? (
                                                <NavLink to={`/profile/${user.id}`} className="auth-img">                  <Avatar
                                                      loading="lazy"
                                                >
                                                      {user.firstName?.charAt(0)}
                                                </Avatar>
                                                </NavLink>

                                          ) : (
                                                <>
                                                      <NavLink to='/login'>تسجيل الدخول</NavLink>
                                                      <NavLink to={`/register`}>انشاء حساب</NavLink>
                                                </>
                                          )}
                                    </section>
                              </Nav>
                        </Navbar.Collapse>
                  </Navbar>
            </header>
      );
}
