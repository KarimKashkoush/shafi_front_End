import { useContext } from 'react'
import { Outlet } from 'react-router'
import Header from '../components/common/Header/Header'
import AddReport from '../components/AddReport/AddReport'
import { AuthContext } from '../context/Auth.Context'
import { Container } from 'react-bootstrap'

export default function ShowUserData() {
      const {user} = useContext(AuthContext)
      return (
            <Container className=''>
                  <Header />
                  {user?.UserData?.userType != "patient" && <AddReport />}
                  <section className="content pt-3">
                        <Outlet />
                  </section>
            </Container>
      )
}
