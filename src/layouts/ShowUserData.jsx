import { useContext, useEffect, useState } from 'react'
import { Outlet } from 'react-router'
import Header from '../components/common/Header/Header'
import AddReport from '../components/AddReport/AddReport'
import { AuthContext } from '../context/Auth.Context'
import { Container } from 'react-bootstrap'
import Loading from '../pages/Loading/Loading'

export default function ShowUserData() {
      const { user } = useContext(AuthContext)
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
            <Container className=''>
                  <Header />
                  {user?.UserData?.userType != "patient" && <AddReport />}
                  <section className="content pt-3">
                        <Outlet />
                  </section>
            </Container>
      )
}
