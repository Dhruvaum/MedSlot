import Container from '../../../components/Container'
import Reveal from '../../../components/Reveal'
import SpecRow from '../../../components/SpecRow'
import {
  SlotLockVisual,
  HoldTimerVisual,
  SignatureVisual,
  RefundVisual,
  VerifiedDoctorVisual,
  FilterVisual,
  LedgerVisual,
} from './SpecVisuals'

const specs = [
  {
    eyebrow: 'Booking',
    title: 'Double-booking is impossible',
    description:
      "Two patients can't take the same slot — not even if they click at the exact same instant. Every slot is locked at the database level, and it's proven by an automated concurrency stress test.",
    points: [
      'Concurrency-safe slot locking on every booking',
      "If someone beats you to a slot, you're told instantly — never silently",
    ],
    visual: <SlotLockVisual />,
  },
  {
    eyebrow: 'Checkout',
    title: 'Your slot is held while you pay',
    description:
      "The moment you start checkout, the slot is reserved for you. Finish paying within the hold window and it's yours — walk away, and it's released automatically for the next patient.",
    points: [
      'Unpaid holds released automatically in the background',
      'Left mid-checkout? Resume payment from My Appointments',
    ],
    visual: <HoldTimerVisual />,
  },
  {
    eyebrow: 'Payments',
    title: 'Verified payments, never assumed',
    description:
      "Every payment is confirmed by cryptographically verifying Razorpay's signature on our servers. A payment never counts on the browser's word alone.",
    points: ['Secure Razorpay checkout', 'Every payment attempt recorded with its gateway reference'],
    visual: <SignatureVisual />,
  },
  {
    eyebrow: 'Refunds',
    title: 'Fair, automatic refunds',
    description:
      'Plans change. Cancel more than 2 hours before your appointment for a full refund — within 2 hours, a small ₹50 penalty applies. You see exactly which one applies before you confirm.',
    points: ['Refunds issued through the real payment gateway', 'Settlement confirmed in the background, not assumed'],
    visual: <RefundVisual />,
  },
  {
    eyebrow: 'Trust',
    title: 'Only verified doctors',
    description:
      'Every doctor is manually reviewed by our Support team before they appear in search. Unverified profiles never reach patients.',
    points: ['Registration number and council reviewed', 'Unverified doctors stay invisible in search'],
    visual: <VerifiedDoctorVisual />,
  },
  {
    eyebrow: 'Search',
    title: 'Find the right doctor, fast',
    description:
      "Search by name, then narrow down by specialty, qualification, and what you're willing to pay — with booking right beside your results.",
    points: ['Filters for specialty, qualification and consultation fee', 'Book without leaving the results page'],
    visual: <FilterVisual />,
  },
  {
    eyebrow: 'Transparency',
    title: 'Every rupee accounted for',
    description:
      'Payments and refunds live together in one ledger, with gateway reference numbers — filterable by status and date.',
    points: ['Payments and refunds in a single timeline', 'Clear amounts and dates on every entry'],
    visual: <LedgerVisual />,
  },
]

const SpecsSection = () => {
  return (
    <div className="py-24">
      <Container>
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand">Under the hood</p>
          <h2 className="mt-3 text-3xl font-bold text-slate-800 md:text-4xl">
            Built to be trusted, down to the last rupee
          </h2>
          <p className="mt-4 text-slate-600">Here's what actually happens behind every booking.</p>
        </Reveal>

        <div className="mt-20 flex flex-col gap-24 md:gap-32">
          {specs.map((spec, index) => (
            <SpecRow key={spec.title} {...spec} reverse={index % 2 === 1} />
          ))}
        </div>
      </Container>
    </div>
  )
}

export default SpecsSection
