import Head from 'next/head'

const features = [
  {
    title: 'Voice Notes',
    description:
      'Speak your thoughts while you read. Bookmarkr listens, transcribes, and tags your notes to the exact page number.',
    accent: 'text-sky-600 bg-sky-100',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
        <path d="M12 4a3 3 0 0 0-3 3v5a3 3 0 0 0 6 0V7a3 3 0 0 0-3-3Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M7 11.5a5 5 0 0 0 10 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M12 16.5v3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M9 20h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    )
  },
  {
    title: 'Contextual AI',
    description:
      'Forgot a character? Confused by a theme? Just ask. Bookmarkr uses AI to answer questions about your specific book.',
    accent: 'text-violet-600 bg-violet-100',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
        <path d="M12 3.5c-3.6 0-6.5 2.9-6.5 6.5 0 1.9.8 3.6 2.1 4.8v2.7c0 .6.4 1 1 1h6.8c.6 0 1-.4 1-1v-2.7a6.5 6.5 0 0 0 2.1-4.8c0-3.6-2.9-6.5-6.5-6.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9.5 21h5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M10 10.3c.4-.8 1.1-1.3 2-1.3 1.1 0 2 .9 2 2 0 1.2-1.1 1.7-1.7 2.1-.4.3-.8.6-.8 1.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="12" cy="16.2" r=".9" fill="currentColor" />
      </svg>
    )
  },
  {
    title: 'Smart Sync',
    description:
      'Your physical reading progress is instantly synced to your digital library. Never lose your page again.',
    accent: 'text-amber-600 bg-amber-100',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
        <path d="M6.5 4.5h10a2 2 0 0 1 2 2v12.5l-2.3-1.6a2 2 0 0 0-2.3 0L11.6 19l-2.3-1.6a2 2 0 0 0-2.3 0L4.5 19V6.5a2 2 0 0 1 2-2Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  }
]

export default function Home() {
  return (
    <>
      <Head>
        <title>Bookmarkr | Your Ultimate Reading Companion</title>
        <meta
          name="description"
          content="Bookmarkr transforms any physical book into a smart, interactive experience."
        />
      </Head>

      <main className="min-h-screen bg-[#fdfbf7] font-['Inter'] text-[#2d2a26]">
        <div className="mx-auto max-w-7xl px-6 py-6 md:px-10">
          <nav className="flex items-center justify-between gap-6">
            <div className="flex items-center gap-2 text-lg font-semibold">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#8c5e3c]/15 text-[#8c5e3c]">
                <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
                  <path d="M5.5 4.5h10a2 2 0 0 1 2 2v12.5l-2.3-1.6a2 2 0 0 0-2.3 0L10.6 19l-2.3-1.6a2 2 0 0 0-2.3 0L3.5 19V6.5a2 2 0 0 1 2-2Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <span className="font-['Libre_Baskerville']">Bookmarkr</span>
            </div>

            <div className="hidden items-center gap-8 text-sm font-medium md:flex">
              <a href="#features" className="hover:text-[#8c5e3c]">Features</a>
              <a href="#how" className="hover:text-[#8c5e3c]">How it Works</a>
              <a href="#pricing" className="hover:text-[#8c5e3c]">Pricing</a>
            </div>

            <button className="rounded-full bg-[#2d2a26] px-5 py-2.5 text-sm font-semibold text-white transition duration-200 hover:-translate-y-0.5 hover:bg-black/85">
              Pre-Order Now
            </button>
          </nav>

          <section className="grid items-center gap-12 py-14 md:grid-cols-2 md:py-20">
            <div>
              <span className="inline-flex rounded-full bg-orange-100 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-orange-700">
                New: Advanced AI Integration
              </span>
              <h1 className="mt-5 font-['Libre_Baskerville'] text-4xl leading-tight md:text-6xl">
                Your Ultimate Reading Companion
              </h1>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-[#4d4944] md:text-lg">
                Bookmarkr transforms any physical book into a smart, interactive experience. Clip it on, speak your thoughts, and track your reading journey instantly.
              </p>
              <button className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#8c5e3c] px-6 py-3 text-sm font-semibold text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-[#774f33] hover:shadow-md">
                Pre-order Device ($49)
                <span aria-hidden="true">→</span>
              </button>
            </div>

            <div>
              <img
                src="https://i.ibb.co/G4FVbWQG/Gemini-Generated-Image-wa5dm2wa5dm2wa5d.png"
                alt="Bookmarkr device clipped onto an open book"
                className="w-full rounded-xl border border-[#d9d2c8] shadow-[0_25px_60px_rgba(45,42,38,0.18)]"
              />
            </div>
          </section>

          <section id="features" className="pb-16" aria-label="Bookmarkr features">
            <div className="grid gap-6 md:grid-cols-3">
              {features.map((feature) => (
                <article key={feature.title} className="rounded-2xl border border-[#e7dfd4] bg-white p-6 shadow-sm">
                  <div className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${feature.accent}`}>
                    {feature.icon}
                  </div>
                  <h3 className="mt-4 font-['Libre_Baskerville'] text-2xl">{feature.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#5a544d]">{feature.description}</p>
                </article>
              ))}
            </div>
          </section>

          <section id="how" className="pb-14 text-center">
            <h2 className="font-['Libre_Baskerville'] text-3xl">How it Works</h2>
            <p className="mx-auto mt-4 max-w-3xl text-[#5a544d]">Clip Bookmarkr onto your page, speak naturally as you read, and instantly revisit every note and insight in your companion app.</p>
          </section>

          <section id="pricing" className="pb-20 text-center">
            <h2 className="font-['Libre_Baskerville'] text-3xl">Pricing</h2>
            <p className="mt-4 text-lg text-[#5a544d]">One-time pre-order price: <span className="font-semibold text-[#8c5e3c]">$49</span></p>
          </section>
        </div>

        <footer className="border-t border-[#e7dfd4] py-8 text-center text-sm text-[#5a544d]">
          © 2024 Bookmarkr Labs. All rights reserved.
        </footer>
      </main>
    </>
  )
}
