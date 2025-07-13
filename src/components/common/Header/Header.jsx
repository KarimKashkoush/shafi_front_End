import { useEffect, useState, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
// import Avatar from '@mui/material/Avatar';

import './style.css';

export default function Header() {
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
                        <NavLink to="/" className='navbar-brand'><span>شَـــــ</span>افِي</NavLink>

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
                                          <Button>تسجيل الدخول</Button>
                                          <Button>انشاء حساب</Button>
                                    </section>
                              </Nav>
                        </Navbar.Collapse>
                  </Navbar>
            </header>
      );
}
