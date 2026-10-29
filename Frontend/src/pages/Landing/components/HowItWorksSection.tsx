import Container from '../../../components/Container'
import Reveal from '../../../components/Reveal'

const steps = [
  {
    number: '01',
    title: 'Search Your Way',
    description: 'Find verified doctors by specialty, qualification, and fee.',
  },
  {
    number: '02',
    title: 'Pick a Doctor',
    description: 'Compare verified doctors and choose the right fit.',
  },
  {
    number: '03',
    title: 'Book & Pay Securely',
    description: 'Confirm your slot and pay safely — funds held until your visit is done.',
  },
  {
    number: '04',
    title: 'Stay on Top of It',
    description: 'Manage appointments, cancellations, and refunds from one dashboard.',
  },
]

const HowItWorksSection = () => {
  return (
    <div className="py-20">
      <Container>
        <Reveal>
          <h2 className="text-center text-3xl font-bold text-slate-800 md:text-4xl">
            How It Works
          </h2>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <Reveal key={step.number} delay={index * 120}>
              <div className="flex flex-col items-center text-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand/10 text-lg font-bold text-brand">
                  {step.number}
                </span>
                <h3 className="mt-4 text-lg font-semibold text-slate-800">{step.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{step.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </div>
  )
}

export default HowItWorksSection
