import Head from 'next/head'
import { ArrowRight, BookOpen, Brain, Mic } from 'lucide-react'

export default function Consendus() {
  return (
    <div className="min-h-screen bg-[#fdfbf7] text-[#2d2a26]">
      <Head>
        <title>Bookmarkr — Your Ultimate Reading Companion</title>
      </Head>

      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-6 pb-16 pt-6">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#8c5e3c]/10 text-[#8c5e3c]">
              <BookOpen className="h-5 w-5" />
            </span>
            <span className="text-lg font-semibold tracking-tight">Bookmarkr</span>
          </div>

          <nav className="order-3 flex w-full flex-col items-center gap-4 text-sm font-medium text-[#2d2a26]/70 sm:order-none sm:w-auto sm:flex-row">
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

          <button className="rounded-full bg-[#2d2a26] px-5 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#1f1d1a]">
            Pre-Order Now
          </button>
        </header>

        <main className="mt-16 flex flex-1 flex-col gap-12 md:flex-row md:items-center">
          <section className="flex flex-1 flex-col gap-6">
            <span className="w-fit rounded-full bg-[#f3d6b8] px-4 py-1 text-xs font-semibold uppercase tracking-wide text-[#8c5e3c]">
              New: Advanced AI Integration
            </span>
            <h1 className="text-4xl font-bold leading-tight tracking-tight md:text-5xl lg:text-6xl [font-family:'Libre_Baskerville',serif]">
              Your Ultimate Reading Companion
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-[#2d2a26]/80 md:text-lg [font-family:'Inter',sans-serif]">
              Bookmarkr transforms any physical book into a smart, interactive experience. Clip it on, speak
              your thoughts, and track your reading journey instantly.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <button className="inline-flex items-center gap-2 rounded-full bg-[#8c5e3c] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#8c5e3c]/20 transition hover:-translate-y-0.5 hover:bg-[#754b2f]">
                Pre-order Device ($49)
                <ArrowRight className="h-4 w-4" />
              </button>
              <span className="text-sm text-[#2d2a26]/60">Ships in 4-6 weeks</span>
            </div>
          </section>

          <section className="flex flex-1 items-center justify-center">
            <div className="rounded-3xl border border-[#e6dfd2] bg-white p-4 shadow-[0_25px_60px_-35px_rgba(45,42,38,0.6)]">
              <img
                src="https://i.ibb.co/G4FVbWQG/Gemini-Generated-Image-wa5dm2wa5dm2wa5d.png"
                alt="Bookmarkr device clipped onto a book"
                className="h-auto w-full max-w-md rounded-2xl object-cover"
              />
            </div>
          </section>
        </main>

        <section id="features" className="mt-20">
          <div className="grid gap-6 md:grid-cols-3">
            <article className="rounded-2xl border border-[#e6dfd2] bg-white p-6 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                <Mic className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-lg font-semibold [font-family:'Libre_Baskerville',serif]">
                Voice Notes
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#2d2a26]/70">
                Speak your thoughts while you read. Bookmarkr listens, transcribes, and tags your notes to
                the exact page number.
              </p>
            </article>

            <article className="rounded-2xl border border-[#e6dfd2] bg-white p-6 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 text-purple-600">
                <Brain className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-lg font-semibold [font-family:'Libre_Baskerville',serif]">
                Contextual AI
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#2d2a26]/70">
                Forgot a character? Confused by a theme? Just ask. Bookmarkr uses AI to answer questions
                about your specific book.
              </p>
            </article>

            <article className="rounded-2xl border border-[#e6dfd2] bg-white p-6 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                <BookOpen className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-lg font-semibold [font-family:'Libre_Baskerville',serif]">
                Smart Sync
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#2d2a26]/70">
                Your physical reading progress is instantly synced to your digital library. Never lose your
                page again.
              </p>
            </article>
          </div>
        </section>

        <section id="how-it-works" className="mt-16 rounded-3xl border border-[#e6dfd2] bg-white/80 p-8">
          <div className="grid gap-6 md:grid-cols-3">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[#8c5e3c]">How it works</p>
              <h2 className="mt-3 text-2xl font-semibold [font-family:'Libre_Baskerville',serif]">
                Clip. Speak. Remember.
              </h2>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm leading-relaxed text-[#2d2a26]/70">
                Bookmarkr pairs seamlessly with your phone, capturing insights and reading context the moment
                inspiration strikes. Its tactile dial lets you mark passages, while the companion app builds a
                lasting library of your reflections.
              </p>
            </div>
          </div>
        </section>

        <section id="pricing" className="mt-16 flex flex-col items-center text-center">
          <h2 className="text-2xl font-semibold [font-family:'Libre_Baskerville',serif]">Pricing</h2>
          <p className="mt-2 max-w-md text-sm text-[#2d2a26]/70">
            Early readers get exclusive access to the first production run and a lifetime of AI updates.
          </p>
          <div className="mt-6 rounded-3xl border border-[#e6dfd2] bg-white px-10 py-6 shadow-sm">
            <p className="text-sm uppercase tracking-[0.3em] text-[#8c5e3c]">Founders Edition</p>
            <p className="mt-3 text-4xl font-semibold">$49</p>
            <button className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#8c5e3c] px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#754b2f]">
              Pre-order now
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </section>

        <footer className="mt-20 text-center text-xs text-[#2d2a26]/60">
          © 2024 Bookmarkr Labs. All rights reserved.
        </footer>
      </div>
    </div>
  )
}
