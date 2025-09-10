import { Hero } from '@/components/hero'
import { Features } from '@/components/features'
import { Retreats } from '@/components/retreats'
import { Testimonials } from '@/components/testimonials'
import { CTA } from '@/components/cta'
import { Footer } from '@/components/footer'

export default function Home() {
  return (
    <>
      <Hero />
      <Features />
      <Retreats />
      <Testimonials />
      <CTA />
      <Footer />
    </>
  )
}
