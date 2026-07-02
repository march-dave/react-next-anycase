import Head from 'next/head'
import {
  BadgeDollarSign,
  Bot,
  Building2,
  CalendarClock,
  CheckCircle2,
  ClipboardList,
  FileText,
  Megaphone,
  Newspaper,
  RadioTower,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react'

const stats = [
  { value: '55M', label: 'Americans with limited or no local news access' },
  { value: '200+', label: 'US counties with no local news source' },
  { value: '$171B', label: 'US local advertising market in 2025' },
  { value: '$60–90K', label: 'Modeled ARR per town masthead' },
]

const sources = [
  'Council agendas and minutes',
  'Planning applications',
  'Public notices',
  'Police and court logs',
  'School calendars',
  'Road closures and fixtures',
]

const workflow = [
  {
    title: 'Watch the public record',
    description:
      'Continuously ingest the unglamorous civic feeds that used to be a reporter’s full-time beat.',
    icon: RadioTower,
  },
  {
    title: 'Draft the daily town brief',
    description:
      'AI turns raw records into plain-English stories, summaries, and a morning newsletter queue.',
    icon: Bot,
  },
  {
    title: 'Editor signs the masthead',
    description:
      'A named local human verifies facts, adds judgment, and keeps the product out of content-slop territory.',
    icon: ShieldCheck,
  },
  {
    title: 'Replicate town by town',
    description:
      'The site, newsletter, ingestion pipes, and ad packages are templated so each new launch is configuration.',
    icon: Newspaper,
  },
]

const revenue = [
  {
    title: 'Local sponsorships',
    detail:
      'Daily newsletter and site placements for restaurants, real estate agents, gyms, trades, retailers, and civic employers.',
    icon: Megaphone,
  },
  {
    title: 'Self-serve ads and listings',
    detail:
      'Low-touch event listings, launch announcements, hiring posts, and neighborhood offers for smaller businesses.',
    icon: BadgeDollarSign,
  },
  {
    title: 'Paid civic tier',
    detail:
      'A free daily reaches the whole town while subscribers pay for deeper explainers, alerts, archives, and meeting digests.',
    icon: Users,
  },
]

const launchPlan = [
  'Pick one true news desert or one-paper county and win it completely.',
  'Recruit a credible editor residents already recognize and trust.',
  'Make council decisions the hook: what changed, who voted, what it means.',
  'Sell the first sponsors door to door before automating the long tail.',
  'Expand in adjacent clusters where one editor and shared advertisers can cover nearby towns.',
]

const risks = [
  'Hallucinated civic facts or defamatory phrasing can destroy trust quickly.',
  'Aggregation-only coverage is thin, legally risky, and not defensible.',
  'Local ad sales still requires relationships even when content production scales.',
  'Readers need visible sourcing and human accountability before trusting AI-assisted hard news.',
]

export default function LocalNewsBureau() {
  return (
    <>
      <Head>
        <title>AI-Native Local News Bureau</title>
        <meta
          name="description"
          content="A human-fronted, AI-native local news network that launches credible town mastheads from public-record ingestion, newsletters, and local ads."
        />
      </Head>

      <main className="min-h-screen bg-[#08111f] text-slate-100">
        <section className="relative overflow-hidden px-6 py-8 sm:px-10 lg:px-16">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.24),_transparent_34%),radial-gradient(circle_at_80%_20%,_rgba(251,191,36,0.18),_transparent_28%),linear-gradient(135deg,_rgba(15,23,42,0.2),_rgba(15,23,42,0.95))]" />
          <div className="relative mx-auto max-w-7xl">
            <nav className="mb-16 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl border border-cyan-300/30 bg-cyan-300/10 p-3 text-cyan-200">
                  <Newspaper size={26} />
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.45em] text-cyan-200/80">TownSignal</p>
                  <p className="text-xs text-slate-400">AI-native local news bureau</p>
                </div>
              </div>
              <a href="#launch" className="hidden rounded-full bg-cyan-300 px-5 py-2 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-500/20 sm:inline-flex">
                Launch one town
              </a>
            </nav>

            <div className="grid items-center gap-12 lg:grid-cols-[1.02fr_0.98fr]">
              <div>
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-amber-300/10 px-4 py-2 text-sm text-amber-100">
                  <Sparkles size={16} /> Stop the presses, start the prompts.
                </div>
                <h1 className="max-w-4xl text-5xl font-black leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
                  Rebuild the town paper as an AI-native local news network.
                </h1>
                <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
                  Launch credible mastheads one town at a time: public-record ingestion, AI-assisted drafts, a daily newsletter, and a named editor who puts real accountability back into local news.
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <a href="#model" className="rounded-full bg-cyan-300 px-7 py-3 text-center font-bold text-slate-950 shadow-xl shadow-cyan-500/20">
                    See the model
                  </a>
                  <a href="#risks" className="rounded-full border border-white/15 px-7 py-3 text-center font-semibold text-slate-100 hover:bg-white/10">
                    Trust controls
                  </a>
                </div>
              </div>

              <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-5 shadow-2xl shadow-slate-950/40 backdrop-blur">
                <div className="rounded-[1.5rem] bg-slate-950/80 p-5">
                  <div className="mb-5 flex items-center justify-between border-b border-white/10 pb-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.35em] text-cyan-200">Daily brief</p>
                      <h2 className="mt-1 text-2xl font-black">Maple Junction Ledger</h2>
                    </div>
                    <CalendarClock className="text-amber-200" />
                  </div>
                  <div className="space-y-4">
                    {['Council approves Main Street rezoning, 4–2', 'School board posts agenda for budget hearing', 'Coffee shop opening seeks weekend staff'].map((headline, index) => (
                      <article key={headline} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                        <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                          <FileText size={14} /> story {index + 1}
                        </div>
                        <h3 className="font-bold text-slate-100">{headline}</h3>
                        <p className="mt-2 text-sm leading-6 text-slate-400">
                          Drafted from primary records, source-linked, and held for editor verification before send.
                        </p>
                      </article>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-3xl border border-white/10 bg-white/[0.06] p-5">
                  <p className="text-3xl font-black text-cyan-200">{stat.value}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="model" className="mx-auto max-w-7xl px-6 py-20 sm:px-10 lg:px-16">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.35em] text-cyan-300">Operating system</p>
              <h2 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">The newsroom is a workflow, not a payroll.</h2>
              <p className="mt-5 text-lg leading-8 text-slate-300">
                The expensive part of local coverage becomes a shared engine. Each town adds audience, ads, and paid subscriptions without adding a proportional newsroom cost.
              </p>
              <div className="mt-8 grid gap-3">
                {sources.map((source) => (
                  <div key={source} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-slate-200">
                    <CheckCircle2 className="text-emerald-300" size={18} /> {source}
                  </div>
                ))}
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {workflow.map((item) => {
                const Icon = item.icon
                return (
                  <div key={item.title} className="rounded-3xl border border-white/10 bg-slate-900/70 p-6">
                    <Icon className="mb-5 text-cyan-200" size={30} />
                    <h3 className="text-xl font-black">{item.title}</h3>
                    <p className="mt-3 leading-7 text-slate-400">{item.description}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        <section className="bg-slate-950/70 px-6 py-20 sm:px-10 lg:px-16">
          <div className="mx-auto max-w-7xl">
            <p className="text-sm font-bold uppercase tracking-[0.35em] text-amber-200">Revenue</p>
            <h2 className="mt-4 max-w-3xl text-4xl font-black tracking-tight sm:text-5xl">Own one town’s attention, then monetize locally.</h2>
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {revenue.map((item) => {
                const Icon = item.icon
                return (
                  <div key={item.title} className="rounded-3xl border border-white/10 bg-white/[0.05] p-7">
                    <Icon className="mb-5 text-amber-200" size={32} />
                    <h3 className="text-2xl font-black">{item.title}</h3>
                    <p className="mt-4 leading-7 text-slate-400">{item.detail}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        <section id="launch" className="mx-auto grid max-w-7xl gap-8 px-6 py-20 sm:px-10 lg:grid-cols-2 lg:px-16">
          <div className="rounded-[2rem] border border-cyan-300/20 bg-cyan-300/10 p-8">
            <Building2 className="mb-6 text-cyan-200" size={38} />
            <h2 className="text-4xl font-black tracking-tight">Start with one town, not a network.</h2>
            <p className="mt-5 text-lg leading-8 text-slate-300">
              The wedge is deliberately narrow: become the trusted source of record in a single under-covered town, prove the audience and advertiser pull, then stamp out the playbook.
            </p>
          </div>
          <div className="space-y-4">
            {launchPlan.map((step, index) => (
              <div key={step} className="flex gap-4 rounded-3xl border border-white/10 bg-white/[0.04] p-5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cyan-300 font-black text-slate-950">{index + 1}</div>
                <p className="pt-2 leading-7 text-slate-300">{step}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="risks" className="px-6 pb-24 sm:px-10 lg:px-16">
          <div className="mx-auto max-w-7xl rounded-[2rem] border border-amber-300/20 bg-gradient-to-br from-amber-300/10 to-cyan-300/10 p-8">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-2xl">
                <p className="text-sm font-bold uppercase tracking-[0.35em] text-amber-200">Trust moat</p>
                <h2 className="mt-4 text-4xl font-black tracking-tight">Human accountability is the product.</h2>
                <p className="mt-5 text-lg leading-8 text-slate-300">
                  The opportunity is not AI slop at local scale. It is primary-source coverage, visible citations, and an editor residents can hold responsible.
                </p>
              </div>
              <ClipboardList className="text-amber-200" size={52} />
            </div>
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {risks.map((risk) => (
                <div key={risk} className="rounded-2xl border border-white/10 bg-slate-950/50 p-5 text-slate-300">
                  {risk}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
