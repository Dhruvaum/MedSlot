const BackgroundDecoration = () => {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -left-20 h-[20rem] w-[28rem] rounded-full bg-brand/100 blur-3xl" />
        <div className="absolute top-1/3 -right-40 h-[10rem] w-[20rem] rounded-full bg-brand/100 blur-3xl" />
        <div className="absolute -bottom-40 left-1/4 h-[20rem] w-[20rem] rounded-full bg-brand/60 blur-3xl" />
    </div>
  )
}

export default BackgroundDecoration