import Head from 'next/head'
import {
  Activity,
  ArrowRight,
  CalendarDays,
  Camera,
  CheckCircle2,
  ClipboardCheck,
  Dna,
  Pill,
  ShieldAlert,
  Sparkles,
  Stethoscope,
} from 'lucide-react'

const stats = [
  { label: 'Global market size', value: '$8.2B' },
  { label: 'Hair loss unnoticed', value: '25-50%' },
  { label: 'Weekly check-ins', value: '5 min' },
]

const steps = [
  {
    title: 'Capture standardized photos',
    description:
      'Guided scans of your hairline and crown keep every shot consistent for reliable tracking.',
    icon: Camera,
  },
  {
    title: 'AI density analysis',
    description:
      'Computer vision maps density, recession, and thinning patterns with clinical precision.',
    icon: Activity,
  },
  {
    title: 'Personalized prevention plan',
    description:
      'Actionable recommendations across treatments, lifestyle shifts, and product matchups.',
    icon: Sparkles,
  },
]

const features = [
  {
    title: 'Early detection alerts',
    description:
      'Spot meaningful changes months before they are visible in the mirror.',
    icon: CheckCircle2,
  },
  {
    title: 'Optional DNA upload',
    description:
      'Connect genetic insights to tailor interventions and risk predictions.',
    icon: Dna,
  },
  {
    title: 'Specialist booking',
    description:
      'Instantly schedule a telehealth consult when the app flags rapid loss.',
    icon: Stethoscope,
  },
  {
    title: 'Weekly momentum',
    description:
      'Five-minute check-ins keep you on track without disrupting your routine.',
    icon: CalendarDays,
  },
]

const timeline = [
  {
    title: 'Week 1',
    detail: 'Baseline scan creates your scalp map and establishes your density score.',
  },
  {
    title: 'Month 2',
    detail: 'AI detects subtle recession patterns and suggests preventative changes.',
  },
  {
    title: 'Month 4',
    detail: 'Improvement tracking highlights where regrowth is strongest.',
  },
]

const businessModel = [
  'Freemium core with premium analytics and advanced recommendations.',
  'Revenue share with partner clinics when users book consultations.',
  'Affiliate commissions on recommended topical treatments and devices.',
]

const recommendationTracks = [
  {
    title: 'Medical track',
    description: 'Evidence-based options like topical and oral protocols reviewed with a clinician.',
    icon: Pill,
  },
  {
    title: 'Lifestyle track',
    description: 'Sleep, stress, nutrition, and routine adjustments that support scalp and follicle health.',
    icon: Sparkles,
  },
  {
    title: 'Escalation track',
    description: 'Fast alerts plus specialist handoff when progression crosses your risk threshold.',
    icon: ShieldAlert,
  },
]

export default function HairLoss() {
  return (
    <div className="bg-slate-950 text-white">
      <Head>
        <title>Manetain — Hair Loss Prevention App</title>
        <meta
          name="description"
          content="AI-powered hair loss tracking, prevention recommendations, and specialist booking."
        />
      </Head>

      <main>
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(94,234,212,0.2),_transparent_45%)]" />
          <div className="relative mx-auto flex max-w-6xl flex-col gap-10 px-6 pb-16 pt-20 sm:pb-24 lg:flex-row lg:items-center">
            <div className="flex-1 space-y-6">
              <p className="text-sm uppercase tracking-[0.3em] text-emerald-300">
                Manetain.co
              </p>
              <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
                Hair today, gone tomorrow.
              </h1>
              <p className="text-lg text-slate-200">
                Manetain is an AI-powered prevention companion that tracks hair density with weekly
                scans, detects early changes, and recommends the right intervention before it is
                visible to the naked eye.
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="rounded-full bg-emerald-400 px-6 py-3 text-sm font-semibold text-slate-950">
                  Join the beta
                </button>
                <button className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white">
                  See how it works
                </button>
              </div>
              <div className="grid gap-6 rounded-3xl border border-white/10 bg-white/5 p-6 sm:grid-cols-3">
                {stats.map((stat) => (
                  <div key={stat.label}>
                    <p className="text-2xl font-semibold text-white">{stat.value}</p>
                    <p className="text-sm text-slate-300">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex-1">
              <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-500/20 p-8">
                <div className="space-y-6">
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Weekly scan</p>
                    <h2 className="text-2xl font-semibold">Your scalp, quantified.</h2>
                  </div>
                  <div className="space-y-4">
                    {steps.map((step) => (
                      <div key={step.title} className="flex gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                        <step.icon className="h-6 w-6 text-emerald-300" />
                        <div>
                          <h3 className="text-base font-semibold">{step.title}</h3>
                          <p className="text-sm text-slate-300">{step.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-6xl gap-10 px-6 py-16 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-[0.3em] text-emerald-300">The problem</p>
            <h2 className="text-3xl font-semibold">Hair loss is gradual, and our brains adapt.</h2>
            <p className="text-slate-300">
              By the time most people notice thinning, they have already lost up to half of their
              hair density. Mirrors cannot offer objective change tracking, so prevention starts too
              late. Manetain creates a measurable record of your scalp so you can act early.
            </p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <h3 className="text-xl font-semibold">A smarter timeline</h3>
            <p className="mt-2 text-sm text-slate-300">
              Track progression like a health metric, not a surprise.
            </p>
            <div className="mt-6 space-y-4">
              {timeline.map((item) => (
                <div key={item.title} className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
                  <p className="text-sm uppercase tracking-[0.2em] text-emerald-300">{item.title}</p>
                  <p className="text-sm text-slate-200">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 pb-16">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-emerald-300">The solution</p>
                <h2 className="text-3xl font-semibold">AI-guided prevention, personalized for you.</h2>
                <p className="mt-3 max-w-2xl text-slate-300">
                  Manetain analyzes hair density, hairline recession, and crown thinning patterns to
                  surface risk trends early. The app adapts to your genetics, lifestyle, and progress
                  to keep you ahead of loss.
                </p>
              </div>
              <button className="rounded-full border border-emerald-400/40 bg-emerald-400/10 px-6 py-3 text-sm font-semibold text-emerald-100">
                Download the deck
              </button>
            </div>
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              {features.map((feature) => (
                <div key={feature.title} className="flex gap-4 rounded-2xl border border-white/10 bg-slate-900/60 p-5">
                  <feature.icon className="h-6 w-6 text-emerald-300" />
                  <div>
                    <h3 className="text-base font-semibold">{feature.title}</h3>
                    <p className="text-sm text-slate-300">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-6xl gap-10 px-6 pb-20 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <h3 className="text-2xl font-semibold">Business model</h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-300">
              {businessModel.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-emerald-300" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-emerald-500/10 via-slate-900 to-slate-950 p-8">
            <h3 className="text-2xl font-semibold">End goal</h3>
            <p className="mt-3 text-sm text-slate-300">
              Build the most trusted prevention layer in hair health, then partner with (or be
              acquired by) platforms like Hims to deliver new customers who are already engaged and
              informed.
            </p>
            <div className="mt-6 rounded-2xl border border-emerald-400/30 bg-slate-950/70 p-5">
              <p className="text-sm uppercase tracking-[0.3em] text-emerald-300">Available domain</p>
              <p className="mt-2 text-xl font-semibold">Manetain.co</p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 pb-12">
          <div className="grid gap-6 rounded-3xl border border-white/10 bg-white/5 p-8 md:grid-cols-3">
            {recommendationTracks.map((track) => (
              <article key={track.title} className="rounded-2xl border border-white/10 bg-slate-900/70 p-5">
                <track.icon className="h-6 w-6 text-emerald-300" />
                <h3 className="mt-4 text-lg font-semibold">{track.title}</h3>
                <p className="mt-2 text-sm text-slate-300">{track.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 pb-24">
          <div className="rounded-3xl border border-emerald-300/30 bg-gradient-to-r from-emerald-500/20 via-emerald-500/10 to-transparent p-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-emerald-200">Launch waitlist</p>
                <h2 className="mt-2 text-3xl font-semibold">Know when your hair risk changes — not after.</h2>
                <p className="mt-2 max-w-2xl text-sm text-slate-200">
                  Join early access to get weekly AI scalp scans, progress alerts, and a personalized
                  prevention plan before visible thinning sets in.
                </p>
              </div>
              <button className="inline-flex items-center gap-2 self-start rounded-full bg-emerald-300 px-6 py-3 text-sm font-semibold text-slate-950 md:self-auto">
                Reserve your spot
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
