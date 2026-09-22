import Container from '../../../components/Container'

const features = [
  {
    title: 'Verified Doctors',
    description: 'Every doctor is verified before they can accept appointments on MedSlot.',
  },
  {
    title: 'No Double-Booking',
    description: 'Concurrency-safe booking means your slot is truly reserved for you, guaranteed.',
  },
  {
    title: 'Secure Payments',
    description: 'Your payment is held safely and only released once your appointment is confirmed complete.',
  },
  {
    title: 'Fast Search',
    description: 'Filter by specialty and availability to find the right doctor in seconds.',
  },
]

const FeaturesSection = () => {
  return (
    <div className="py-20 bg-brand/10">
      <Container>
        <h2 className="text-center text-3xl font-bold text-slate-800 md:text-4xl">
          Why MedSlot
        </h2>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm"
            >
              <div className="h-1 w-10 rounded-full bg-brand" />
              <h3 className="mt-4 text-lg font-semibold text-slate-800">{feature.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </Container>
    </div>
  )
}

export default FeaturesSection