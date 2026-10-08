import Head from 'next/head'
import { ArrowRight, Book, Brain, Mic } from 'lucide-react'

export default function Consendus() {
  return (
    <>
      <Head>
        <title>Bookmarkr — Your Ultimate Reading Companion</title>
      </Head>
      <div
        className="min-h-screen bg-[#fdfbf7] text-[#2d2a26]"
        style={{ fontFamily: '"Inter", system-ui, sans-serif' }}
      >
        <header className="px-6 pt-8 md:px-12">
          <nav className="mx-auto flex max-w-6xl items-center justify-between gap-6">
            <div className="flex items-center gap-2 text-lg font-semibold">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#8c5e3c] text-white">
                <Book className="h-5 w-5" />
              </span>
              <span style={{ fontFamily: '"Libre Baskerville", serif' }}>Bookmarkr</span>
            </div>
            <div className="hidden items-center gap-8 text-sm font-medium md:flex">
              <a className="transition hover:text-[#8c5e3c]" href="#features">
                Features
              </a>
              <a className="transition hover:text-[#8c5e3c]" href="#how-it-works">
                How it Works
              </a>
              <a className="transition hover:text-[#8c5e3c]" href="#pricing">
                Pricing
              </a>
            </div>
            <button className="rounded-full bg-[#2d2a26] px-5 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#1f1d1a]">
              Pre-Order Now
            </button>
          </nav>
        </header>

        <main className="px-6 pb-16 pt-12 md:px-12">
          <section className="mx-auto flex max-w-6xl flex-col items-center gap-12 md:flex-row md:items-start">
            <div className="flex-1">
              <span className="inline-flex items-center rounded-full bg-[#f3e1cc] px-4 py-1 text-xs font-semibold uppercase tracking-wide text-[#8c5e3c]">
                New: Advanced AI Integration
              </span>
              <h1
                className="mt-6 text-4xl font-semibold leading-tight md:text-5xl"
                style={{ fontFamily: '"Libre Baskerville", serif' }}
              >
                Your Ultimate Reading Companion
              </h1>
              <p className="mt-4 max-w-xl text-base text-[#3b372f] md:text-lg">
                Bookmarkr transforms any physical book into a smart, interactive experience. Clip it
                on, speak your thoughts, and track your reading journey instantly.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <button className="inline-flex items-center gap-3 rounded-full bg-[#8c5e3c] px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#7a4f32]">
                  Pre-order Device ($49)
                  <ArrowRight className="h-4 w-4" />
                </button>
                <div className="text-sm text-[#6b6257]">
                  Ships worldwide • Limited early batch
                </div>
              </div>
            </div>
            <div className="flex-1 md:flex md:justify-end">
              <img
                src="https://i.ibb.co/G4FVbWQG/Gemini-Generated-Image-wa5dm2wa5dm2wa5d.png"
                alt="Bookmarkr device on a book"
                className="w-full max-w-md rounded-3xl border border-[#e6ded3] shadow-[0_30px_80px_-50px_rgba(45,42,38,0.6)]"
              />
            </div>
          </section>

          <section id="features" className="mx-auto mt-16 max-w-6xl">
            <div className="grid gap-6 md:grid-cols-3">
              {[
                {
                  title: 'Voice Notes',
                  copy: 'Speak your thoughts while you read. Bookmarkr listens, transcribes, and tags your notes to the exact page number.',
                  icon: Mic,
                  color: 'text-blue-600',
                },
                {
                  title: 'Contextual AI',
                  copy: 'Forgot a character? Confused by a theme? Just ask. Bookmarkr uses AI to answer questions about your specific book.',
                  icon: Brain,
                  color: 'text-purple-600',
                },
                {
                  title: 'Smart Sync',
                  copy: 'Your physical reading progress is instantly synced to your digital library. Never lose your page again.',
                  icon: Book,
                  color: 'text-amber-600',
                },
              ].map((feature) => {
                const Icon = feature.icon
                return (
                  <div
                    key={feature.title}
                    className="rounded-2xl border border-[#e6ded3] bg-white p-6 shadow-sm"
                  >
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-full bg-[#fdfbf7] ${feature.color}`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3
                      className="mt-4 text-lg font-semibold"
                      style={{ fontFamily: '"Libre Baskerville", serif' }}
                    >
                      {feature.title}
                    </h3>
                    <p className="mt-3 text-sm text-[#5b544c]">{feature.copy}</p>
                  </div>
                )
              })}
            </div>
          </section>

          <section
            id="how-it-works"
            className="mx-auto mt-16 flex max-w-6xl flex-col gap-6 rounded-3xl border border-[#e6ded3] bg-white/60 p-8 md:flex-row md:items-center md:justify-between"
          >
            <div>
              <h2
                className="text-2xl font-semibold"
                style={{ fontFamily: '"Libre Baskerville", serif' }}
              >
                Designed for every chapter of your journey
              </h2>
              <p className="mt-3 max-w-xl text-sm text-[#5b544c]">
                Attach Bookmarkr to any book, tap to capture notes, and let the companion app sync
                your progress instantly. The more you read, the smarter it becomes.
              </p>
            </div>
            <button className="inline-flex items-center gap-2 rounded-full border border-[#8c5e3c] px-5 py-2 text-sm font-semibold text-[#8c5e3c] transition hover:-translate-y-0.5 hover:bg-[#f3e1cc]">
              Explore the Experience
              <ArrowRight className="h-4 w-4" />
            </button>
          </section>

          <section id="pricing" className="mx-auto mt-16 max-w-6xl text-center">
            <h2
              className="text-3xl font-semibold"
              style={{ fontFamily: '"Libre Baskerville", serif' }}
            >
              Early access pricing
            </h2>
            <p className="mt-3 text-sm text-[#5b544c]">
              Reserve your Bookmarkr today. The first run ships with exclusive leather wrapping.
            </p>
            <div className="mt-6 inline-flex flex-col items-center gap-4 rounded-3xl border border-[#e6ded3] bg-white px-8 py-6">
              <div className="text-4xl font-semibold">$49</div>
              <button className="inline-flex items-center gap-2 rounded-full bg-[#8c5e3c] px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#7a4f32]">
                Pre-Order Now
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </section>
        </main>

        <footer className="border-t border-[#e6ded3] py-8 text-center text-xs text-[#6b6257]">
          © 2024 Bookmarkr Labs. All rights reserved.
        </footer>
      </div>
    </>
  )
}
