import { Link } from 'react-router-dom'
import Container from '../../../components/Container'
import Reveal from '../../../components/Reveal'

const HeroSection = () => {
  return (
    <div className="bg-brand/25">
      <Container>
        <Reveal className="flex flex-col items-center gap-6 py-20 text-center md:py-32">
          <h1 className="text-4xl font-bold text-slate-800 md:text-6xl">
            Get Your Doctor. <span className="text-brand">Fast.</span>
          </h1>

          <p className="max-w-xl text-lg text-slate-600">
            Search verified doctors by specialty, book an appointment instantly, and pay securely —
            no phone calls, no waiting rooms.
          </p>

          <div className="mt-4 flex flex-col gap-4 sm:flex-row">
            <Link
              to="/signUp"
              className="rounded-full bg-brand px-8 py-3 font-semibold text-white shadow-md transition hover:opacity-90"
            >
              Book a Doctor
            </Link>

            <a
              href="#how-it-works"
              className="rounded-full border border-brand px-8 py-3 font-semibold text-brand transition hover:bg-brand/10"
            >
              How It Works
            </a>
          </div>
        </Reveal>
      </Container>
    </div>
  )
}

export default HeroSection
