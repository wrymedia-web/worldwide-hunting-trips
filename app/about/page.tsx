import Link from 'next/link'
import { ArrowRight, DollarSign, MessageSquare, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-wht-paper">
      {/* Hero */}
      <div className="bg-wht-forest py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-heritage text-white tracking-tight mb-4">About Worldwide Hunting Trips</h1>
          <p className="text-wht-bone font-body text-lg leading-relaxed">
            Built out of firsthand experience — and frustration — on both sides of the booking table.
          </p>
        </div>
      </div>

      {/* Story */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl border border-wht-bone-2 shadow-sm p-8 sm:p-10">
            <h2 className="text-2xl font-heritage text-wht-ink mb-6">My name is Terrance Maier.</h2>
            <div className="space-y-4 text-wht-stone font-body leading-relaxed">
              <p>
                Worldwide Hunting Trips was created out of firsthand experience and frustration — both as an outfitter and an international hunter. I saw a clear need for a transparent hunt listing platform that truly benefits both sides.
              </p>
              <p>
                As a <span className="text-wht-ink font-semibold">hunter</span>, it was exhausting to navigate agents and brokers who were often focused on commissions rather than the right match for me. Many listings lacked critical details, forcing countless emails to outfitters — only to discover that most did not offer what I was actually looking for.
              </p>
              <p>
                As an <span className="text-wht-ink font-semibold">outfitter</span>, the problem was just as clear. High commissions on every booking and expensive annual subscription fees made it difficult to offer hunters the best possible price — while also cutting into the resources that could be reinvested into the hunter&apos;s experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* A Better Way */}
      <section className="py-10 px-4 bg-wht-ink">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-heritage text-white tracking-tight mb-3">A Better Way</h2>
          <p className="text-wht-bone font-body text-base leading-relaxed max-w-2xl mx-auto">
            Worldwide Hunting Trips gives outfitters a simple, affordable way to list all of their hunts in one place — packages, cancellations, last-minute deals, and show specials — for one low annual fee. In fact, the cost is less than what most outfitters pay in commission for a single booked hunt.
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: <DollarSign className="h-7 w-7 text-wht-blaze" />,
              title: 'One Low Annual Fee',
              body: 'Less than the commission on a single booked hunt. Outfitters keep every dollar from every booking.',
            },
            {
              icon: <Search className="h-7 w-7 text-wht-blaze" />,
              title: 'Free for Hunters',
              body: 'Completely free to use. Save hunts to your profile, compare options, and contact outfitters directly — no middlemen.',
            },
            {
              icon: <MessageSquare className="h-7 w-7 text-wht-blaze" />,
              title: 'No Hidden Agendas',
              body: 'Each listing includes a detailed Q&A section. Get the information you need and contact outfitters directly.',
            },
          ].map((item, i) => (
            <div key={i} className="bg-wht-ink-2 rounded-xl border border-wht-forest p-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-wht-blaze/15 border border-wht-blaze/30 mb-4">
                {item.icon}
              </div>
              <h3 className="font-heritage text-white mb-2">{item.title}</h3>
              <p className="text-sm text-wht-fog font-body leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Hunt Customizer callout */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-wht-bone-2 shadow-sm p-8 sm:p-10">
          <h2 className="text-2xl font-heritage text-wht-ink mb-4">Customize Your Hunt</h2>
          <p className="text-wht-stone font-body leading-relaxed mb-4">
            Not finding exactly what you&apos;re looking for? Our <span className="text-wht-forest font-semibold">Hunt Customizer</span> makes it easy. Fill out the form with your preferences — species, location, style, group size, and more — and it goes directly to outfitters who operate in the area you choose and offer the species you select. The outfitters respond with a custom quote for the hunt you designed.
          </p>
          <p className="text-wht-stone font-body leading-relaxed mb-6">
            <span className="text-wht-ink font-semibold">Everyone wins.</span> When more of your money stays with the outfitter, they can reinvest it into what matters most — your experience.
          </p>
          <Link href="/hunt-customizer">
            <Button variant="default" size="lg" className="gap-2">
              Try the Hunt Customizer <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
