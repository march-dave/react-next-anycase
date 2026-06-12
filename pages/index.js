import Head from 'next/head'
import { ArrowRight, BookOpen, Brain, Mic, BookMarked } from 'lucide-react'

const features = [
  {
    icon: Mic,
    accent: 'bg-blue-50 text-blue-600 ring-blue-100',
    title: 'Voice Notes',
    text: 'Speak your thoughts while you read. Bookmarkr listens, transcribes, and tags your notes to the exact page number.',
  },
  {
    icon: Brain,
    accent: 'bg-purple-50 text-purple-600 ring-purple-100',
    title: 'Contextual AI',
    text: 'Forgot a character? Confused by a theme? Just ask. Bookmarkr uses AI to answer questions about your specific book.',
  },
  {
    icon: BookOpen,
    accent: 'bg-amber-50 text-amber-600 ring-amber-100',
    title: 'Smart Sync',
    text: 'Your physical reading progress is instantly synced to your digital library. Never lose your page again.',
  },
]

export default function BookmarkrLanding() {
  return (
    <>
      <Head>
        <title>Bookmarkr | Your Ultimate Reading Companion</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Libre+Baskerville:wght@400;700&display=swap"
          rel="stylesheet"
        />
        <meta
          name="description"
          content="Bookmarkr transforms any physical book into a smart, interactive reading experience with voice notes, contextual AI, and reading progress sync."
        />
      </Head>

      <main className="relative min-h-screen overflow-hidden bg-[#fdfbf7] font-sans text-[#2d2a26]">
        <div className="pointer-events-none absolute inset-0 z-0 opacity-60 [background-image:radial-gradient(#8c5e3c_0.55px,transparent_0.55px)] [background-size:22px_22px]" />
        <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col px-5 sm:px-6 lg:px-8">
          <header className="flex items-center justify-between gap-4 py-6">
            <a href="#" className="group flex items-center gap-3" aria-label="Bookmarkr home">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#2d2a26] text-[#fdfbf7] shadow-lg shadow-[#2d2a26]/10 transition-transform duration-300 group-hover:-translate-y-0.5">
                <BookMarked className="h-5 w-5" strokeWidth={1.8} />
              </span>
              <span className="font-serif text-xl font-bold tracking-tight text-[#2d2a26]">Bookmarkr</span>
            </a>

            <nav className="hidden items-center gap-10 text-sm font-medium text-[#2d2a26]/70 md:flex">
              <a className="hover:text-[#8c5e3c]" href="#features">Features</a>
              <a className="hover:text-[#8c5e3c]" href="#how-it-works">How it Works</a>
              <a className="hover:text-[#8c5e3c]" href="#pricing">Pricing</a>
            </nav>

            <a
              href="#pricing"
              className="shrink-0 rounded-full bg-[#2d2a26] px-4 py-3 text-sm font-semibold text-white shadow-xl shadow-[#2d2a26]/10 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#171512] hover:shadow-2xl hover:shadow-[#2d2a26]/15 sm:px-5"
            >
              Pre-Order Now
            </a>
          </header>

          <section id="how-it-works" className="grid flex-1 items-center gap-14 py-12 sm:py-16 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20 lg:py-20">
            <div className="mx-auto max-w-2xl text-center lg:mx-0 lg:text-left">
              <div className="mb-7 inline-flex items-center rounded-full border border-[#8c5e3c]/15 bg-[#f7dec0]/70 px-4 py-2 text-sm font-semibold text-[#8c5e3c] shadow-sm shadow-[#8c5e3c]/5">
                New: Advanced AI Integration
              </div>

              <h1 className="font-serif text-5xl font-bold leading-[1.08] tracking-[-0.045em] text-[#2d2a26] sm:text-6xl lg:text-7xl">
                Your Ultimate Reading Companion
              </h1>

              <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-[#2d2a26]/72 sm:text-xl lg:mx-0">
                Bookmarkr transforms any physical book into a smart, interactive experience. Clip it on,
                speak your thoughts, and track your reading journey instantly.
              </p>

              <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start">
                <a
                  href="#pricing"
                  className="group inline-flex w-full items-center justify-center gap-3 rounded-full bg-[#8c5e3c] px-7 py-4 text-base font-bold text-white shadow-2xl shadow-[#8c5e3c]/25 transition-all duration-300 hover:-translate-y-1 hover:bg-[#70492e] hover:shadow-[#8c5e3c]/35 sm:w-auto"
                >
                  Pre-order Device ($49)
                  <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </a>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-2xl lg:max-w-none">
              <div className="absolute -left-8 top-12 h-44 w-44 rounded-full bg-[#8c5e3c]/15 blur-3xl" />
              <div className="absolute -bottom-10 right-6 h-56 w-56 rounded-full bg-amber-300/20 blur-3xl" />
              <div className="relative rounded-2xl border border-[#2d2a26]/10 bg-white/50 p-3 shadow-[0_36px_90px_rgba(45,42,38,0.20)] backdrop-blur">
                <img
                  src="https://i.ibb.co/G4FVbWQG/Gemini-Generated-Image-wa5dm2wa5dm2wa5d.png"
                  alt="Bookmarkr smart reading companion clipped to a physical book"
                  className="aspect-[4/3] w-full rounded-xl border border-[#2d2a26]/10 object-cover shadow-2xl shadow-[#2d2a26]/20"
                />
              </div>
            </div>
          </section>

          <section id="features" className="pb-16 pt-4 sm:pb-24 lg:pb-28">
            <div className="mb-10 text-center">
              <p className="text-sm font-bold uppercase tracking-[0.28em] text-[#8c5e3c]">Features</p>
              <h2 className="mt-3 font-serif text-3xl font-bold tracking-tight text-[#2d2a26] sm:text-4xl">
                Everything your bookshelf has been missing.
              </h2>
            </div>

            <div className="grid gap-5 md:grid-cols-3 lg:gap-7">
              {features.map((feature) => {
                const Icon = feature.icon
                return (
                  <article
                    key={feature.title}
                    className="group rounded-[1.75rem] border border-[#2d2a26]/10 bg-white/85 p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#8c5e3c]/25 hover:shadow-2xl hover:shadow-[#2d2a26]/10"
                  >
                    <div className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl ring-1 ${feature.accent}`}>
                      <Icon className="h-6 w-6" strokeWidth={1.9} />
                    </div>
                    <h3 className="font-serif text-2xl font-bold tracking-tight text-[#2d2a26]">{feature.title}</h3>
                    <p className="mt-4 leading-7 text-[#2d2a26]/68">{feature.text}</p>
                  </article>
                )
              })}
            </div>
          </section>
        </div>
      </main>

      <footer id="pricing" className="border-t border-[#2d2a26]/10 bg-[#fdfbf7] px-5 py-8 text-center text-sm text-[#2d2a26]/60">
        © 2024 Bookmarkr Labs. All rights reserved.
      </footer>
    </>
  )
}
