import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Page from '../../components/Page'
import HeroSection from './components/HeroSection'
import HowItWorksSection from './components/HowItWorksSection'
import FeaturesSection from './components/FeaturesSection'
import SpecsSection from './components/SpecsSection'
import CtaSection from './components/CtaSection'

const LandingPage = () => {
  const { hash, key } = useLocation()

  // Keyed on location.key too, so clicking the same section link again re-scrolls
  useEffect(() => {
    if (!hash) return
    document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth' })
  }, [hash, key])

  return (
    <Page title="MedSlot - Book & Manage Appointments">

      {/* Section 1 */}
      <section>
        <HeroSection/>
      </section>

      {/* Section 2 */}
      <section id='how-it-works' className='scroll-mt-16'>
        <HowItWorksSection/>
      </section>

      {/* Section 3 */}
      <section id='features' className='scroll-mt-16'>
        <FeaturesSection/>
      </section>

      {/* Section 4 */}
      <section id='specs' className='scroll-mt-16'>
        <SpecsSection/>
      </section>

      {/* Section 5 */}
      <section>
        <CtaSection/>
      </section>

    </Page>
  )
}

export default LandingPage
