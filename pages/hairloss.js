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

const pitchHighlights = [
  {
    title: 'The problem',
    description:
      'Hair loss is sneaky. Most people only notice after substantial thinning, which is often when treatment becomes less effective.',
  },
  {
    title: 'The solution',
    description:
      'AI-powered weekly scalp tracking catches subtle shifts early and translates them into practical prevention steps.',
  },
  {
    title: 'The business model',
    description:
      'Freemium product with clinic referral revenue share and affiliate commissions on evidence-based products.',
  },
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

const productPillars = [
  {
    title: 'Weekly standardized scalp photos',
    description:
      'Guided angles and lighting checks keep every image clinically comparable so progress is objective.',
    icon: Camera,
  },
  {
    title: 'Pattern detection before visible loss',
    description:
      'AI tracks density shifts, hairline recession, and crown thinning months before most people notice.',
    icon: ClipboardCheck,
  },
  {
    title: 'Personalized interventions',
    description:
      'Recommendations adapt using your pattern, lifestyle data, and optional DNA upload for higher precision.',
    icon: Dna,
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

const goToMarket = [
  {
    title: 'Content-led acquisition',
    detail:
      'Educational hair health reports and before/after trend stories attract men researching early thinning.',
  },
  {
    title: 'Clinic partnerships',
    detail:
      'Dermatology and hair restoration clinics receive qualified referrals with objective progression data.',
  },
  {
    title: 'Retention loops',
    detail:
      'Weekly scan streaks, progress snapshots, and intervention reminders keep users active over the long term.',
  },
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

const interventions = [
  {
    stage: 'Early prevention',
    focus: 'Protect existing density',
    actions: 'Scalp care routine, nutrition prompts, and sleep/stress optimization plans.',
  },
  {
    stage: 'Active thinning',
    focus: 'Slow progression',
    actions: 'Topical treatment guidance, adherence tracking, and monthly response scoring.',
  },
  {
    stage: 'Accelerated loss',
    focus: 'Escalate with specialist care',
    actions: 'Priority consult booking, treatment discussion prep, and progress handoff reports.',
  },
]

const carePathway = [
  {
    stage: 'Detect',
    detail: 'AI flags a meaningful density shift and opens a concise change report.',
  },
  {
    stage: 'Recommend',
    detail: 'Users get a personalized prevention stack based on pattern, habits, and optional DNA.',
  },
  {
    stage: 'Escalate',
    detail: 'When thresholds are crossed, users can instantly book a specialist consult in-app.',
  },
]

const faqs = [
  {
    question: 'How often should I scan my scalp?',
    answer:
      'Weekly scans are enough for trend accuracy while keeping the routine lightweight and sustainable.',
  },
  {
    question: 'Do I need to share DNA data?',
    answer:
      'No. DNA upload is optional. The core tracking and recommendations work with photos and questionnaire data alone.',
  },
  {
    question: 'Is this a medical diagnosis tool?',
    answer:
      'No. Manetain is a prevention and tracking product that helps users decide when to consult a licensed specialist.',
  },
]

const riskSignals = [
  'Hairline recession velocity',
  'Crown density drop-off',
  'Shedding acceleration trend',
  'Treatment adherence quality',
]

const appCapabilities = [
  {
    label: 'Hairline recession map',
    value:
      'Guided front-facing photos quantify temple movement and asymmetry so changes are measured, not guessed.',
  },
  {
    label: 'Crown thinning score',
    value:
      'Top-down scans track density loss over time and alert users when the crown begins to weaken.',
  },
  {
    label: 'Density trendline',
    value:
      'A longitudinal score compares every week against baseline, highlighting momentum before it becomes visually obvious.',
  },
  {
    label: 'Intervention readiness',
    value:
      'Treatment recommendations escalate from lifestyle coaching to specialist consults when your risk profile changes.',
  },
]


const dashboardSignals = [
  { label: 'Density score', value: '82 / 100', delta: '+2.4% vs baseline' },
  { label: 'Hairline drift', value: 'Low', delta: 'No significant temple recession' },
  { label: 'Crown trend', value: 'Stable', delta: '0.3% week-over-week change' },
]

const weeklyChecklist = [
  'Capture front hairline, top-down crown, and left/right temple photos.',
  'Complete the 60-second lifestyle check-in (sleep, stress, nutrition, adherence).',
  'Review your updated risk score and recommended prevention actions.',
  'Book a specialist consult if your progression threshold is crossed.',
]

const pricing = [
  {
    tier: 'Free',
    price: '$0',
    summary: 'Core weekly scans and basic trend tracking to build prevention habits early.',
    perks: ['Weekly scan reminders', 'Baseline + monthly trend snapshots', 'Basic prevention tips'],
  },
  {
    tier: 'Pro',
    price: '$19/mo',
    summary: 'Advanced AI analytics, proactive alerts, and personalized intervention planning.',
    perks: ['Hairline + crown risk scoring', 'Personalized treatment tracks', 'Priority alerting when risk increases'],
  },
  {
    tier: 'Clinic+',
    price: 'Revenue share',
    summary: 'Specialist referral channel with structured progression data for higher-intent consults.',
    perks: ['In-app consult booking', 'Longitudinal handoff reports', 'Partner clinic referral workflow'],
  },
]
const acquisitionFit = [
  {
    title: 'Earlier customer intent',
    description:
      'Manetain captures users while they are still researching prevention, well before they actively shop for treatment.',
  },
  {
    title: 'Better referral quality',
    description:
      'Clinic and telehealth partners receive users with objective progression data, risk context, and higher purchase intent.',
  },
  {
    title: 'Sticky retention loop',
    description:
      'Weekly scans, alerts, and progress snapshots create recurring engagement that compounds into strong lifetime value.',
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
                <a
                  href="https://www.godaddy.com/en/domainsearch/find?domainToCheck=Manetain.co"
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-emerald-300/40 bg-emerald-400/10 px-6 py-3 text-sm font-semibold text-emerald-100"
                >
                  View domain
                </a>
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
          <div className="mb-8 rounded-3xl border border-emerald-300/20 bg-emerald-400/5 p-6">
            <p className="text-sm uppercase tracking-[0.3em] text-emerald-300">Investor snapshot</p>
            <h2 className="mt-3 text-2xl font-semibold">Hair today, gone tomorrow — unless prevention starts early.</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {pitchHighlights.map((highlight) => (
                <article key={highlight.title} className="rounded-2xl border border-white/10 bg-slate-900/60 p-5">
                  <h3 className="text-sm uppercase tracking-[0.2em] text-emerald-200">{highlight.title}</h3>
                  <p className="mt-2 text-sm text-slate-300">{highlight.description}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="grid gap-6 rounded-3xl border border-white/10 bg-white/5 p-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-emerald-300">In a line</p>
              <h2 className="mt-3 text-3xl font-semibold">
                AI-powered hair loss tracking with prevention recommendations before it&apos;s too late.
              </h2>
              <p className="mt-4 text-sm text-slate-300">
                The app turns slow, hard-to-see changes into clear weekly signals so treatment can start when it
                works best.
              </p>
            </div>

            <div className="grid gap-4">
              {productPillars.map((pillar) => (
                <article key={pillar.title} className="rounded-2xl border border-white/10 bg-slate-900/60 p-5">
                  <div className="flex items-start gap-3">
                    <pillar.icon className="mt-0.5 h-5 w-5 text-emerald-300" />
                    <div>
                      <h3 className="text-base font-semibold">{pillar.title}</h3>
                      <p className="mt-1 text-sm text-slate-300">{pillar.description}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 pb-16">
          <div className="grid gap-6 rounded-3xl border border-white/10 bg-white/5 p-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-emerald-300">Risk intelligence</p>
              <h2 className="mt-2 text-3xl font-semibold">Detect invisible decline before it compounds.</h2>
              <p className="mt-3 max-w-2xl text-sm text-slate-300">
                Most users cannot spot gradual hair changes in real life. Manetain tracks every weekly
                scan against baseline to identify early warning signs and trigger intervention at the
                highest-leverage moment.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {riskSignals.map((signal) => (
                  <div key={signal} className="rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-slate-200">
                    {signal}
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-emerald-300/30 bg-emerald-400/10 p-5">
              <p className="text-xs uppercase tracking-[0.3em] text-emerald-200">Acquisition outcome</p>
              <h3 className="mt-2 text-xl font-semibold">Built to become Hims&apos; growth engine</h3>
              <p className="mt-3 text-sm text-slate-200">
                Manetain can become the earliest-intent hair prevention funnel in the market, sending
                treatment-ready users to telehealth and clinic partners with rich longitudinal data.
              </p>
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

        <section className="mx-auto max-w-6xl px-6 pb-16">
          <div className="grid gap-6 rounded-3xl border border-white/10 bg-white/5 p-8 lg:grid-cols-[1fr_1fr]">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-emerald-300">What the app measures</p>
              <h3 className="mt-2 text-2xl font-semibold">Clinical-level tracking made consumer-simple</h3>
              <p className="mt-3 text-sm text-slate-300">
                Every weekly check-in follows the same camera guidance, framing, and lighting checks.
                This turns subjective mirror moments into objective trend data users can trust.
              </p>
            </div>
            <div className="space-y-4">
              {appCapabilities.map((item) => (
                <div key={item.label} className="rounded-2xl border border-white/10 bg-slate-900/60 p-5">
                  <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">{item.label}</p>
                  <p className="mt-2 text-sm text-slate-200">{item.value}</p>
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

        <section className="mx-auto max-w-6xl px-6 pb-20">
          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-8">
            <p className="text-sm uppercase tracking-[0.3em] text-emerald-300">Go-to-market</p>
            <h3 className="mt-2 text-3xl font-semibold">How Manetain scales efficiently</h3>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {goToMarket.map((item) => (
                <article key={item.title} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <h4 className="text-base font-semibold">{item.title}</h4>
                  <p className="mt-2 text-sm text-slate-300">{item.detail}</p>
                </article>
              ))}
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

        <section className="mx-auto max-w-6xl px-6 pb-24">
          <div className="grid gap-8 rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-950 p-8 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-emerald-300">Prototype dashboard</p>
              <h3 className="mt-2 text-2xl font-semibold">See risk signals before they become visible</h3>
              <p className="mt-3 text-sm text-slate-300">
                A single weekly check-in translates scalp scans and lifestyle inputs into objective
                risk scores. Users can understand if they are stable, drifting, or accelerating — and
                what to do next.
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                {dashboardSignals.map((signal) => (
                  <div key={signal.label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-[0.15em] text-slate-400">{signal.label}</p>
                    <p className="mt-2 text-xl font-semibold">{signal.value}</p>
                    <p className="mt-1 text-xs text-emerald-200">{signal.delta}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-emerald-300/20 bg-emerald-400/5 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-emerald-200">Weekly workflow</p>
              <ul className="mt-4 space-y-3">
                {weeklyChecklist.map((item) => (
                  <li key={item} className="flex gap-3 text-sm text-slate-200">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-300" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <button className="mt-6 w-full rounded-full bg-emerald-300 px-4 py-3 text-sm font-semibold text-slate-950">
                Start weekly check-in
              </button>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 pb-24">
          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-500/10 p-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-emerald-300">Intervention engine</p>
                <h3 className="mt-2 text-2xl font-semibold">Know what to do at every stage</h3>
                <p className="mt-3 max-w-2xl text-sm text-slate-300">
                  Manetain converts weekly scan data into a clear action plan so users can respond
                  early with confidence instead of waiting until loss is obvious.
                </p>
              </div>
              <button className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white">
                Book specialist intro
              </button>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {interventions.map((item) => (
                <div key={item.stage} className="rounded-2xl border border-white/10 bg-slate-950/60 p-5">
                  <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">{item.stage}</p>
                  <p className="mt-2 text-base font-semibold">{item.focus}</p>
                  <p className="mt-2 text-sm text-slate-300">{item.actions}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 pb-24">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <p className="text-sm uppercase tracking-[0.3em] text-emerald-300">Care pathway</p>
            <h3 className="mt-2 text-2xl font-semibold">From signal to specialist in minutes</h3>
            <p className="mt-3 max-w-2xl text-sm text-slate-300">
              Manetain isn&apos;t just a tracker. It bridges early detection to real interventions so users
              can act before hair loss becomes emotionally or clinically difficult to reverse.
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {carePathway.map((item) => (
                <article key={item.stage} className="rounded-2xl border border-white/10 bg-slate-900/70 p-5">
                  <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">{item.stage}</p>
                  <p className="mt-2 text-sm text-slate-300">{item.detail}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 pb-24">
          <div className="grid gap-8 rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-950 p-8 lg:grid-cols-[1fr_1fr]">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-emerald-300">FAQ</p>
              <h3 className="mt-2 text-2xl font-semibold">Built for prevention, not panic</h3>
              <p className="mt-3 text-sm text-slate-300">
                Hair loss is emotional. The product experience focuses on objective measurements,
                clear next steps, and supportive guidance.
              </p>
              <button className="mt-6 rounded-full bg-emerald-400 px-6 py-3 text-sm font-semibold text-slate-950">
                Book specialist consult
              </button>
            </div>
            <div className="space-y-4">
              {faqs.map((faq) => (
                <div key={faq.question} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <h4 className="text-base font-semibold">{faq.question}</h4>
                  <p className="mt-2 text-sm text-slate-300">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 pb-24">
          <div className="rounded-3xl border border-emerald-300/30 bg-gradient-to-br from-emerald-500/15 via-slate-900 to-slate-950 p-8">
            <p className="text-sm uppercase tracking-[0.3em] text-emerald-200">Acquisition fit</p>
            <h3 className="mt-2 text-2xl font-semibold">Built to plug into a Hims-style growth engine</h3>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {acquisitionFit.map((item) => (
                <article key={item.title} className="rounded-2xl border border-white/10 bg-slate-950/60 p-5">
                  <h4 className="text-base font-semibold">{item.title}</h4>
                  <p className="mt-2 text-sm text-slate-300">{item.description}</p>
                </article>
              ))}
            </div>
            <div className="mt-6 rounded-2xl border border-emerald-300/30 bg-slate-950/70 p-5">
              <p className="text-xs uppercase tracking-[0.25em] text-emerald-200">End goal</p>
              <p className="mt-2 text-sm text-slate-300">
                Become the earliest signal layer for men&apos;s hair health and a high-intent acquisition channel for telehealth brands.
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 pb-24">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <p className="text-sm uppercase tracking-[0.3em] text-emerald-300">Business model</p>
            <h3 className="mt-2 text-2xl font-semibold">Freemium wedge with clinic and affiliate upside</h3>
            <p className="mt-3 max-w-3xl text-sm text-slate-300">
              Start with habit-building weekly scans, then monetize on premium prevention tools,
              specialist referrals, and trusted treatment recommendations.
            </p>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {pricing.map((plan) => (
                <article key={plan.tier} className="rounded-2xl border border-white/10 bg-slate-900/60 p-5">
                  <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">{plan.tier}</p>
                  <p className="mt-2 text-2xl font-semibold">{plan.price}</p>
                  <p className="mt-2 text-sm text-slate-300">{plan.summary}</p>
                  <ul className="mt-4 space-y-2 text-sm text-slate-200">
                    {plan.perks.map((perk) => (
                      <li key={perk} className="flex items-start gap-2">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />
                        <span>{perk}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
