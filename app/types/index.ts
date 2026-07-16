export interface NavLink {
  label: string
  to: string
}

export interface Service {
  icon: string
  title: string
  description: string
}

export interface PricingTier {
  name: string
  tagline: string
  price: string
  priceNote: string
  features: string[]
  highlighted?: boolean
  ctaLabel: string
}

export interface Testimonial {
  name: string
  role: string
  quote: string
  location: string
}

export interface FaqItem {
  question: string
  answer: string
}

export interface Step {
  number: string
  title: string
  description: string
}

export interface Benefit {
  icon: string
  title: string
  description: string
}

export interface StatItem {
  value: string
  label: string
}

export interface ArticleSummary {
  path: string
  title: string
  description: string
  date: string
  category: string
  tags: string[]
  image: string
}
