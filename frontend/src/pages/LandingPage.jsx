import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Header from '../components/Header'
import Hero from '../components/Hero'
import TrustBanner from '../components/TrustBanner'
import StoreRatings from '../components/StoreRatings'
import StatsSection from '../components/StatsSection'
import TopProducts from '../components/TopProducts'
import Categories from '../components/Categories'
import Testimonials from '../components/Testimonials'
import HowItWorks from '../components/HowItWorks'
import FAQ from '../components/FAQ'
import ExploreCTA from '../components/ExploreCTA'
import Newsletter from '../components/Newsletter'
import Footer from '../components/Footer'

function LandingPage() {
  const location = useLocation()

  useEffect(() => {
    if (location.hash) {
      const el = document.querySelector(location.hash)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
      }
    } else {
      window.scrollTo(0, 0)
    }
  }, [location])

  return (
    <div className="app-shell">
      <Header />
      <Hero />
      <TrustBanner />
      <StoreRatings />
      <StatsSection />
      <TopProducts />
      <Categories />
      <Testimonials />
      <HowItWorks />
      <FAQ />
      <ExploreCTA />
      <Newsletter />
      <Footer />
    </div>
  )
}

export default LandingPage