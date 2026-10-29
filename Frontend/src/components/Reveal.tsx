import { useEffect, useRef, useState, type ReactNode } from 'react'

type Direction = 'up' | 'left' | 'right'

interface RevealProps {
  children: ReactNode
  className?: string
  delay?: number
  direction?: Direction
}

const hiddenOffset: Record<Direction, string> = {
  up: 'translate-y-10',
  left: '-translate-x-10',
  right: 'translate-x-10',
}

const Reveal = ({ children, className = '', delay = 0, direction = 'up' }: RevealProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out ${
        isVisible ? 'translate-x-0 translate-y-0 opacity-100' : `opacity-0 ${hiddenOffset[direction]}`
      } ${className}`}
    >
      {children}
    </div>
  )
}

export default Reveal
