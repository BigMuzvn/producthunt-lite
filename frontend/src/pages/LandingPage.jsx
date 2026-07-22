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