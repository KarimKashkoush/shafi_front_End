import About from './About'
import Hero from './Hero'
import Services from './Services'
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
