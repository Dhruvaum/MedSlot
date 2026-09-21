import React from 'react'
import Page from '../../components/Page'
import Container from '../../components/Container'
import HeroSection from './components/HeroSection'

const LandingPage = () => {
  return (
    <Page title="MedSlot - Book & Manage Appointments">

      {/* Section 1 */}
      <section className='bg-brand/10'>
        <Container>
          <HeroSection/>
        </Container>
      </section>

      {/* Section 2 */}
      <section>
        
      </section>

    </Page>
  )
}

export default LandingPage