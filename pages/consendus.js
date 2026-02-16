import { ArrowRight, Book, BookOpen, Brain, Mic } from 'lucide-react'

const features = [
  {
    title: 'Voice Notes',
    description:
      'Speak your thoughts while you read. Bookmarkr listens, transcribes, and tags your notes to the exact page number.',
    icon: Mic,
    color: 'text-blue-600',
    bg: 'bg-blue-100/70',
  },
  {
    title: 'Contextual AI',
    description:
      'Forgot a character? Confused by a theme? Just ask. Bookmarkr uses AI to answer questions about your specific book.',
    icon: Brain,
    color: 'text-purple-600',
    bg: 'bg-purple-100/70',
  },
  {
    title: 'Smart Sync',
    description:
      'Your physical reading progress is instantly synced to your digital library. Never lose your page again.',
    icon: Book,
    color: 'text-amber-600',
    bg: 'bg-amber-100/70',
  },
]

export default function Consendus() {
  return (
    <div className="min-h-screen bg-[#fdfbf7] text-[#2d2a26]">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#8c5e3c]/10 text-[#8c5e3c]">
            <BookOpen className="h-5 w-5" />
          </span>
          <span
            className="text-lg font-semibold"
            style={{ fontFamily: "'Libre Baskerville', serif" }}
          >
            Bookmarkr
          </span>
        </div>
        <nav className="hidden items-center gap-10 text-sm font-medium text-[#2d2a26]/70 md:flex">
          <a className="transition hover:text-[#2d2a26]" href="#features">
            Features
          </a>
          <a className="transition hover:text-[#2d2a26]" href="#how-it-works">
            How it Works
          </a>
          <a className="transition hover:text-[#2d2a26]" href="#pricing">
            Pricing
          </a>
        </nav>
        <button className="hidden rounded-full bg-[#2d2a26] px-5 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-black md:inline-flex">
          Pre-Order Now
        </button>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-6 pb-16">
        <section className="grid items-center gap-12 pt-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <span className="inline-flex w-fit items-center rounded-full bg-[#f6e1c8] px-4 py-1 text-xs font-semibold text-[#8c5e3c]">
              New: Advanced AI Integration
            </span>
            <h1
              className="text-4xl font-semibold leading-tight sm:text-5xl"
              style={{ fontFamily: "'Libre Baskerville', serif" }}
            >
              Your Ultimate Reading Companion
            </h1>
            <p className="text-base text-[#2d2a26]/70 sm:text-lg">
              Bookmarkr transforms any physical book into a smart, interactive experience. Clip it on, speak your
              thoughts, and track your reading journey instantly.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <button className="inline-flex items-center gap-2 rounded-full bg-[#8c5e3c] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#8c5e3c]/30 transition hover:-translate-y-0.5 hover:bg-[#7a5234]">
                Pre-order Device ($49)
                <ArrowRight className="h-4 w-4" />
              </button>
              <span className="text-xs uppercase tracking-[0.2em] text-[#2d2a26]/50">Ships Fall 2024</span>
            </div>
          </div>
          <div className="flex justify-center lg:justify-end">
            <img
              src="https://i.ibb.co/G4FVbWQG/Gemini-Generated-Image-wa5dm2wa5dm2wa5d.png"
              alt="Bookmarkr device on a book"
              className="w-full max-w-md rounded-3xl border border-[#e6dfd4] shadow-2xl shadow-[#2d2a26]/10"
            />
          </div>
        </section>

        <section id="features" className="mt-16 space-y-8">
          <div className="flex flex-col gap-2">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8c5e3c]">Features</p>
            <h2
              className="text-3xl font-semibold"
              style={{ fontFamily: "'Libre Baskerville', serif" }}
            >
              Designed for thoughtful readers
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-[#e6dfd4] bg-white p-6 shadow-sm transition hover:-translate-y-1"
              >
                <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-full ${feature.bg}`}>
                  <feature.icon className={`h-5 w-5 ${feature.color}`} />
                </div>
                <h3
                  className="text-lg font-semibold"
                  style={{ fontFamily: "'Libre Baskerville', serif" }}
                >
                  {feature.title}
                </h3>
                <p className="mt-3 text-sm text-[#2d2a26]/70">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="how-it-works" className="mt-16 rounded-3xl border border-[#e6dfd4] bg-white/60 px-6 py-10">
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                step: '01',
                title: 'Clip it on',
                text: 'Attach Bookmarkr to any hardcover or paperback in seconds.',
              },
              {
                step: '02',
                title: 'Speak freely',
                text: 'Capture voice notes and questions as you read—hands free.',
              },
              {
                step: '03',
                title: 'Sync and remember',
                text: 'Your highlights, notes, and progress appear in your library.',
              },
            ].map((item) => (
              <div key={item.step} className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#8c5e3c]">
                  {item.step}
                </p>
                <h3
                  className="text-xl font-semibold"
                  style={{ fontFamily: "'Libre Baskerville', serif" }}
                >
                  {item.title}
                </h3>
                <p className="text-sm text-[#2d2a26]/70">{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section
          id="pricing"
          className="mt-16 flex flex-col items-center gap-6 rounded-3xl border border-[#e6dfd4] bg-white px-6 py-10 text-center"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8c5e3c]">Pricing</p>
          <h2
            className="text-3xl font-semibold"
            style={{ fontFamily: "'Libre Baskerville', serif" }}
          >
            Reserve your Bookmarkr
          </h2>
          <p className="max-w-2xl text-sm text-[#2d2a26]/70">
            Early supporters receive the device, charging sleeve, and lifetime access to core AI features.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <span className="text-4xl font-semibold text-[#2d2a26]">$49</span>
            <span className="text-sm text-[#2d2a26]/60">One-time pre-order</span>
          </div>
          <button className="inline-flex items-center gap-2 rounded-full bg-[#8c5e3c] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#8c5e3c]/30 transition hover:-translate-y-0.5 hover:bg-[#7a5234]">
            Pre-Order Now
            <ArrowRight className="h-4 w-4" />
          </button>
        </section>
      </main>

      <footer className="border-t border-[#e6dfd4] py-6 text-center text-xs text-[#2d2a26]/60">
        © 2024 Bookmarkr Labs. All rights reserved.
      </footer>
    </div>
  )
}
