import { Navbar } from '@/components/navbar'
import { Hero } from '@/components/hero'
import { EventsSection } from '@/components/events-section'
import { FAQSection } from '@/components/faq-section'
import { Footer } from '@/components/footer'

export default function Page() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <EventsSection />
      <FAQSection />
      <Footer />
    </main>
  )
}
