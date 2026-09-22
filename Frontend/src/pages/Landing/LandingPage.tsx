import Page from '../../components/Page'
import HeroSection from './components/HeroSection'
import HowItWorksSection from './components/HowItWorksSection'
import FeaturesSection from './components/FeaturesSection'
import CtaSection from './components/CtaSection'

const LandingPage = () => {
  return (
    <Page title="MedSlot - Book & Manage Appointments">

      {/* Section 1 */}
      <section>
        <HeroSection/>
      </section>

      {/* Section 2 */}
      <section id='how-it-works'>
        <HowItWorksSection/>
      </section>

      {/* Section 3 */}
      <section id='features'>
        <FeaturesSection/>
      </section>

      {/* Section 4 */}
      <section>
        <CtaSection/>
      </section>

    </Page>
  )
}

export default LandingPage