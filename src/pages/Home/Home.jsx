import Services from '../../components/common/Services/Services'
import About from './About'
import Hero from './Hero'
import './style.css'

export default function Home() {
      return (
            <>
                  <section className="home">
                        <Hero />
                        <Services />
                        <About />
                  </section>
            </>
      )
}
