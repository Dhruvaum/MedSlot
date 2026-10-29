import { Link } from 'react-router-dom'
import Container from '../../../components/Container'
import Reveal from '../../../components/Reveal'

const CtaSection = () => {
  return (
    <div className="bg-brand py-20">
      <Container>
        <Reveal>
          <div className="flex flex-col items-center gap-6 text-center">
            <h2 className="text-3xl font-bold text-white md:text-4xl">
              Ready to book your doctor?
            </h2>
            <p className="max-w-xl text-white/90">
              Join MedSlot today and find a verified doctor in minutes.
            </p>
            <Link
              to="/signUp"
              className="rounded-full bg-white px-8 py-3 font-semibold text-brand shadow-md transition hover:opacity-90"
            >
              Get Started
            </Link>
          </div>
        </Reveal>
      </Container>
    </div>
  )
}

export default CtaSection
