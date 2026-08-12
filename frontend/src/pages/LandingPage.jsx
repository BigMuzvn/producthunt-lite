import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Header from '../components/Header'
import Hero from '../components/Hero'
import DashboardShowcase from '../components/DashboardShowcase'
import TrustBanner from '../components/TrustBanner'
import StatsSection from '../components/StatsSection'
import TopProducts from '../components/TopProducts'
import Categories from '../components/Categories'
import Testimonials from '../components/Testimonials'
import HowItWorks from '../components/HowItWorks'
import FAQ from '../components/FAQ'
import FinalCTA from '../components/FinalCTA'
import Footer from '../components/Footer'

function LandingPage() {
  const location = useLocation()

  useEffect(() => {
    document.title = 'ProductHunt Lite — Découvrez et partagez les meilleurs produits tech'
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
      <DashboardShowcase />
      <TrustBanner />
      <StatsSection />
      <TopProducts />
      <Categories />
      <Testimonials />
      <HowItWorks />
      <FAQ />
      <FinalCTA />
      <Footer />
    </div>
  )
}

export default LandingPage