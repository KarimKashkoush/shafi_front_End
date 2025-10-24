
import React from 'react'
import { Container } from 'react-bootstrap'
import Header from '../components/common/Header/Header'
import { Outlet } from 'react-router'
import ContactUs from '../components/common/ContactUs/ContactUs'
import CopyRight from '../components/common/CopyRight/CopyRight'
import "./layout.css"

export default function MainLayout() {
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
