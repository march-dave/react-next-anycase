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

const navigation = [
  { id: 'overview', label: 'Overview', icon: LayoutGrid },
  { id: 'comms', label: 'Comms', icon: MessageSquare },
  { id: 'orchestration', label: 'Orchestration', icon: Command },
  { id: 'fleet', label: 'Agent Fleet', icon: Users },
]

const features = [
  {
    title: 'Semantic Bus',
    copy: 'Real-time routing layer for agent-to-agent messaging.',
    icon: Activity,
  },
  {
    title: 'Consensus Engine',
    copy: 'Multi-agent voting with quorum enforcement and audit trails.',
    icon: ShieldCheck,
  },
  {
    title: 'Guardian Rails',
    copy: 'Policy guardrails that intercept unsafe actions automatically.',
    icon: Wand2,
  },
]

const stats = [
  { label: 'Active Agents', value: '128', trend: '+12%' },
  { label: 'Messages/min', value: '4.2k', trend: '+8%' },
  { label: 'Consensus Rate', value: '96.4%', trend: '+2.1%' },
  { label: 'Token Usage', value: '1.8M', trend: '+4.5%' },
]

const chartData = [
  { time: '00:00', load: 28, tokens: 35 },
  { time: '03:00', load: 38, tokens: 42 },
  { time: '06:00', load: 45, tokens: 58 },
  { time: '09:00', load: 60, tokens: 75 },
  { time: '12:00', load: 74, tokens: 88 },
  { time: '15:00', load: 68, tokens: 92 },
  { time: '18:00', load: 82, tokens: 110 },
  { time: '21:00', load: 72, tokens: 98 },
]

const terminalLogs = [
  '[INFO] Agent-2 connected via semantic bus.',
  '[INFO] Consensus engine resolved action: deploy hotfix-42.',
  '[WARN] High latency detected in region us-east-2.',
  '[INFO] Guardian rail blocked unsafe API mutation.',
  '[INFO] Agent-7 escalated incident to human review.',
  '[SUCCESS] Swarm quorum achieved for rollout v2.8.1.',
]

const channels = ['#migration-api-v2', '#security-audit', '#edge-latency', '#agent-governance']

const initialMessages = [
  {
    id: 1,
    author: 'Atlas-Orchestrator',
    time: '09:41',
    content: 'Routing migration tasks to Codex and Sentry. Prioritize consensus on failover steps.',
    type: 'action',
  },
  {
    id: 2,
    author: 'Codex-Dev',
    time: '09:42',
    content: `const migrationPlan = await swarm.compose({\n  strategy: 'zero-downtime',\n  fallback: 'blue-green',\n})`,
    type: 'default',
    format: 'code',
  },
  {
    id: 3,
    author: 'Sentry-Sec',
    time: '09:43',
    content: 'Guardian rail flagged elevated privilege request. Re-check IAM policy on shard-3.',
    type: 'system',
  },
]

const simulatedMessages = [
  {
    author: 'Atlas-Orchestrator',
    time: '09:44',
    content: 'Consensus check: 2/3 agents approved phase-2 rollout. Awaiting final vote.',
    type: 'action',
  },
  {
    author: 'Codex-Dev',
    time: '09:45',
    content: `swarm.vote({\n  proposal: 'phase-2 rollout',\n  verdict: 'approve',\n  notes: 'latency within tolerance'\n})`,
    type: 'default',
    format: 'code',
  },
  {
    author: 'Sentry-Sec',
    time: '09:45',
    content: 'Approved. Monitoring anomaly score across edge gateways.',
    type: 'default',
  },
  {
    author: 'Guardian-Rail',
    time: '09:46',
    content: 'Automated safeguard deployed: rate-limit policy tightened to 120r/s.',
    type: 'system',
  },
]

const taskStates = ['Pending', 'In Progress', 'Needs Consensus', 'Completed']

const tasks = [
  { title: 'Map migration dependencies', agent: 'Atlas-Orchestrator', state: 'Pending' },
  { title: 'Rehearse blue-green failover', agent: 'Codex-Dev', state: 'In Progress' },
  {
    title: 'Approve zero-downtime cutover',
    agent: 'Consensus Engine',
    state: 'Needs Consensus',
    votes: 1,
    totalVotes: 3,
  },
  { title: 'Rotate service tokens', agent: 'Sentry-Sec', state: 'Completed' },
  { title: 'Update incident playbook', agent: 'Helios-OPS', state: 'Pending' },
  { title: 'Latency stress test', agent: 'Nova-Perf', state: 'In Progress' },
  {
    title: 'Authorize cross-region data sync',
    agent: 'Quorum Council',
    state: 'Needs Consensus',
    votes: 2,
    totalVotes: 3,
  },
  { title: 'Deploy guardian rail patch', agent: 'Guardian-Rail', state: 'Completed' },
]

const agents = [
  {
    name: 'Atlas-Orchestrator',
    role: 'Swarm Coordinator',
    specialization: 'Planning & Sequencing',
    uptime: '21d 4h',
    status: 'busy',
  },
  {
    name: 'Codex-Dev',
    role: 'Implementation Agent',
    specialization: 'Infrastructure Code',
    uptime: '14d 9h',
    status: 'idle',
  },
  {
    name: 'Sentry-Sec',
    role: 'Security & Policy',
    specialization: 'Threat Modeling',
    uptime: '9d 3h',
    status: 'busy',
  },
  {
    name: 'Helios-OPS',
    role: 'Reliability',
    specialization: 'Incident Response',
    uptime: '31d 18h',
    status: 'idle',
  },
  {
    name: 'Nova-Perf',
    role: 'Performance',
    specialization: 'Latency Profiling',
    uptime: '5d 12h',
    status: 'error',
  },
  {
    name: 'Guardian-Rail',
    role: 'Safety Agent',
    specialization: 'Policy Enforcement',
    uptime: '26d 2h',
    status: 'idle',
  },
]
