import Head from 'next/head'
import { ArrowRight, BookOpen, BrainCircuit, Mic, Sparkles } from 'lucide-react'

const features = [
  {
    title: 'Voice Notes',
    description:
      'Speak your thoughts while you read. Bookmarkr listens, transcribes, and tags your notes to the exact page number.',
    accent: 'bg-sky-50 text-sky-600 ring-sky-100',
    icon: Mic,
  },
  {
    title: 'Contextual AI',
    description:
      'Forgot a character? Confused by a theme? Just ask. Bookmarkr uses AI to answer questions about your specific book.',
    accent: 'bg-violet-50 text-violet-600 ring-violet-100',
    icon: BrainCircuit,
  },
  {
    title: 'Smart Sync',
    description:
      'Your physical reading progress is instantly synced to your digital library. Never lose your page again.',
    accent: 'bg-amber-50 text-amber-600 ring-amber-100',
    icon: BookOpen,
  },
]

export default function Home() {
  return (
    <>
      <Head>
        <title>Bookmarkr | Your Ultimate Reading Companion</title>
        <meta
          name="description"
          content="Bookmarkr transforms any physical book into a smart, interactive reading companion with voice notes, contextual AI, and automatic reading progress sync."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className="min-h-screen overflow-hidden bg-[#fdfbf7] font-sans text-[#2d2a26]">
        <div className="pointer-events-none fixed inset-0 opacity-[0.18] [background-image:radial-gradient(#8c5e3c_0.7px,transparent_0.7px)] [background-size:18px_18px]" />
        <div className="pointer-events-none fixed -right-28 top-20 h-72 w-72 rounded-full bg-[#8c5e3c]/10 blur-3xl" />
        <div className="pointer-events-none fixed -left-28 bottom-20 h-72 w-72 rounded-full bg-orange-200/30 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-5 py-5 sm:px-6 md:px-10">
          <nav className="flex items-center justify-between gap-4 rounded-full border border-[#e7dfd4]/80 bg-[#fdfbf7]/85 px-4 py-3 shadow-sm backdrop-blur md:px-5">
            <a href="#" className="flex items-center gap-2.5 text-base font-semibold md:text-lg" aria-label="Bookmarkr home">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#8c5e3c]/15 text-[#8c5e3c] ring-1 ring-[#8c5e3c]/15">
                <BookOpen className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="font-serif">Bookmarkr</span>
            </a>

            <div className="hidden items-center gap-8 text-sm font-medium text-[#4d4944] md:flex">
              <a href="#features" className="hover:text-[#8c5e3c]">Features</a>
              <a href="#how" className="hover:text-[#8c5e3c]">How it Works</a>
              <a href="#pricing" className="hover:text-[#8c5e3c]">Pricing</a>
            </div>

            <a
              href="#pricing"
              className="rounded-full bg-[#2d2a26] px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-black hover:shadow-md sm:px-5 sm:text-sm"
            >
              Pre-Order Now
            </a>
          </nav>

          <section className="grid items-center gap-12 py-14 md:grid-cols-[0.95fr_1.05fr] md:py-20 lg:gap-16 lg:py-24">
            <div className="text-center md:text-left">
              <span className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-100/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-orange-800 shadow-sm">
                <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                New: Advanced AI Integration
              </span>
              <h1 className="mt-6 font-serif text-4xl font-bold leading-[1.08] tracking-[-0.03em] sm:text-5xl md:text-6xl lg:text-7xl">
                Your Ultimate Reading Companion
              </h1>
              <p className="mx-auto mt-6 max-w-xl text-base leading-8 text-[#4d4944] md:mx-0 md:text-lg">
                Bookmarkr transforms any physical book into a smart, interactive experience. Clip it on, speak your thoughts, and track your reading journey instantly.
              </p>
              <div className="mt-9 flex flex-col items-center gap-4 sm:flex-row md:justify-start">
                <a
                  href="#pricing"
                  className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#8c5e3c] px-7 py-3.5 text-sm font-bold text-white shadow-[0_14px_30px_rgba(140,94,60,0.25)] transition duration-200 hover:-translate-y-1 hover:bg-[#774f33] hover:shadow-[0_18px_38px_rgba(140,94,60,0.32)] sm:w-auto"
                >
                  Pre-order Device ($49)
                  <ArrowRight className="h-4 w-4 transition duration-200 group-hover:translate-x-0.5" aria-hidden="true" />
                </a>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-xl md:max-w-none">
              <div className="absolute -inset-5 rounded-[2rem] bg-gradient-to-br from-[#8c5e3c]/16 via-orange-100/60 to-transparent blur-2xl" />
              <img
                src="https://i.ibb.co/G4FVbWQG/Gemini-Generated-Image-wa5dm2wa5dm2wa5d.png"
                alt="Bookmarkr device clipped onto an open book"
                className="relative aspect-[4/3] w-full rounded-3xl border border-[#d9d2c8] bg-white object-cover shadow-[0_28px_80px_rgba(45,42,38,0.22)]"
              />
            </div>
          </section>

          <section id="features" className="pb-16 md:pb-20" aria-label="Bookmarkr features">
            <div className="mx-auto mb-8 max-w-2xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#8c5e3c]">Designed for deep readers</p>
              <h2 className="mt-3 font-serif text-3xl font-bold sm:text-4xl">A smarter way to stay immersed</h2>
            </div>
            <div className="grid gap-5 md:grid-cols-3 lg:gap-6">
              {features.map((feature) => {
                const Icon = feature.icon
                return (
                  <article key={feature.title} className="rounded-3xl border border-[#e7dfd4] bg-white/88 p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(45,42,38,0.08)]">
                    <div className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl ring-1 ${feature.accent}`}>
                      <Icon className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <h3 className="mt-5 font-serif text-2xl font-bold">{feature.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-[#5a544d]">{feature.description}</p>
                  </article>
                )
              })}
            </div>
          </section>

          <section id="how" className="pb-14 text-center">
            <h2 className="font-serif text-3xl font-bold">How it Works</h2>
            <p className="mx-auto mt-4 max-w-3xl text-[#5a544d]">
              Clip Bookmarkr onto your page, speak naturally as you read, and instantly revisit every note and insight in your companion app.
            </p>
          </section>

          <section id="pricing" className="pb-20 text-center">
            <div className="mx-auto max-w-2xl rounded-3xl border border-[#e7dfd4] bg-white/80 px-6 py-8 shadow-sm">
              <h2 className="font-serif text-3xl font-bold">Pricing</h2>
              <p className="mt-4 text-lg text-[#5a544d]">
                One-time pre-order price: <span className="font-bold text-[#8c5e3c]">$49</span>
              </p>
            </div>
          </section>
        </div>

        <footer className="relative border-t border-[#e7dfd4] py-8 text-center text-sm text-[#5a544d]">
          © 2024 Bookmarkr Labs. All rights reserved.
        </footer>
      </main>
    </>
  )
}
