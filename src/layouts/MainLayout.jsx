
import React, { useEffect, useState } from 'react'
import { Container } from 'react-bootstrap'
import Header from '../components/common/Header/Header'
import { Outlet } from 'react-router'
import ContactUs from '../components/common/ContactUs/ContactUs'
import CopyRight from '../components/common/CopyRight/CopyRight'
import "./layout.css"
import Loading from '../pages/Loading/Loading'

export default function MainLayout() {
            const [loading, setLoading] = useState(true);
            
                  useEffect(() => {
                        const minLoadingTime = new Promise((resolve) => setTimeout(resolve, 2000));
            
                        const fetchData = new Promise((resolve) => {
                              setTimeout(resolve, 500); // لو البيانات خلصت بسرعة
                        });
            
                        Promise.all([minLoadingTime, fetchData]).then(() => setLoading(false));
                  }, []);
            
                  if (loading) return <Loading />;
      return (
            <>
                  <Container>
                        <Header />

                        <div id="content">
                              <Outlet />
                        </div>

                        <ContactUs />
                  </Container>
                  <CopyRight />
            </>
      )
}
