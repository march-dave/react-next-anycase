import { useMemo, useState } from 'react'
import {
  Activity,
  Bot,
  ChevronRight,
  Code2,
  LayoutGrid,
  Menu,
  MessageCircle,
  Network,
  ShieldCheck,
  Sparkles,
  Terminal,
  Users,
  X,
} from 'lucide-react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

const navItems = [
  { id: 'overview', label: 'Overview', icon: LayoutGrid },
  { id: 'comms', label: 'Comms', icon: MessageCircle },
  { id: 'orchestration', label: 'Orchestration', icon: Network },
  { id: 'fleet', label: 'Agent Fleet', icon: Users },
]

const features = [
  {
    title: 'Semantic Bus',
    description: 'Low-latency message routing with intent awareness and adaptive prioritization.',
    icon: Sparkles,
  },
  {
    title: 'Consensus Engine',
    description: 'Weighted voting, quorum thresholds, and rapid convergence for complex decisions.',
    icon: CheckCircle2,
  },
  {
    title: 'Guardian Rails',
    description: 'Policy-driven controls that keep agents aligned, secure, and compliant.',
    icon: ShieldCheck,
  },
]

const stats = [
  { label: 'Active Agents', value: '128', delta: '+12%' },
  { label: 'Messages / min', value: '9.4k', delta: '+8%' },
  { label: 'Consensus Rate', value: '96.8%', delta: '+1.2%' },
  { label: 'Token Usage', value: '1.2M', delta: '-4%' },
]

const chartData = [
  { time: '01:00', load: 52, tokens: 38 },
  { time: '04:00', load: 61, tokens: 45 },
  { time: '08:00', load: 72, tokens: 54 },
  { time: '12:00', load: 68, tokens: 62 },
  { time: '16:00', load: 74, tokens: 58 },
  { time: '20:00', load: 66, tokens: 70 },
  { time: '24:00', load: 58, tokens: 64 },
]

const logs = [
  '[INFO] Agent-2 connected to semantic bus.',
  '[INFO] Consensus vote initiated for task #1421.',
  '[WARN] High latency detected on shard-us-west-2.',
  '[INFO] Guardian Rail applied to migration-api-v2.',
  '[INFO] Agent-7 rebalanced token budget to 18.6M.',
]

const channels = ['#migration-api-v2', '#security-audit', '#swarm-alerts', '#routing-sync']

const initialMessages = [
  {
    id: 1,
    author: 'Atlas-Orchestrator',
    type: 'standard',
    content: 'We need consensus on the migration plan. Any objections from safety checks? ',
  },
  {
    id: 2,
    author: 'Sentry-Sec',
    type: 'alert',
    content: 'Potential API scope escalation detected in migration-api-v2.',
  },
  {
    id: 3,
    author: 'Codex-Dev',
    type: 'code',
    content: `// patch applied to reduce privilege scope\nupdatePolicy('migration-api-v2', {\n  scopes: ['read:events', 'write:events'],\n})`,
  },
]

const simulateMessages = [
  {
    author: 'Pulse-Analyst',
    type: 'standard',
    content: 'Latency normalized after rerouting through shard-us-east-1.',
  },
  {
    author: 'Atlas-Orchestrator',
    type: 'standard',
    content: 'Consensus tracking now at 2/3 votes. Awaiting final signal.',
  },
  {
    author: 'Guardian-Rail',
    type: 'alert',
    content: 'Guardian Rail enforced: blocked unsafe deletion sequence.',
  },
]

const taskStates = ['Pending', 'In Progress', 'Needs Consensus', 'Completed']

const tasks = [
  {
    title: 'Deploy migration-api-v2',
    agent: 'Atlas-Orchestrator',
    state: 'Needs Consensus',
    votes: 2,
    totalVotes: 3,
  },
  {
    title: 'Audit auth scopes',
    agent: 'Sentry-Sec',
    state: 'In Progress',
  },
  {
    title: 'Optimize event routing',
    agent: 'Pulse-Analyst',
    state: 'Pending',
  },
  {
    title: 'Release swarm patch 2.4.1',
    agent: 'Codex-Dev',
    state: 'Completed',
  },
]

const agents = [
  {
    name: 'Atlas-Orchestrator',
    role: 'Coordinator',
    specialization: 'Workflow Routing',
    uptime: '14d 06h',
    status: 'idle',
  },
  {
    name: 'Codex-Dev',
    role: 'Compiler',
    specialization: 'TypeScript & APIs',
    uptime: '9d 02h',
    status: 'busy',
  },
  {
    name: 'Sentry-Sec',
    role: 'Security',
    specialization: 'Threat Modeling',
    uptime: '21d 18h',
    status: 'idle',
  },
  {
    name: 'Nova-Observer',
    role: 'Telemetry',
    specialization: 'Tracing & Metrics',
    uptime: '5d 11h',
    status: 'busy',
  },
  {
    name: 'Pulse-Mediator',
    role: 'Consensus',
    specialization: 'Voting Logic',
    uptime: '12d 04h',
    status: 'error',
  },
  {
    name: 'Nimbus-Comms',
    role: 'Comms Coordinator',
    specialization: 'Channel orchestration',
    uptime: '6h 11m',
    status: 'busy',
  },
  {
    name: 'Nova-Observer',
    role: 'Consensus Observer',
    specialization: 'Vote integrity',
    uptime: '14h 28m',
    status: 'idle',
  },
]

export default function Consendus() {
  const [view, setView] = useState('landing')
  const [activeTab, setActiveTab] = useState('overview')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [messages, setMessages] = useState(initialMessages)
  const [isSimulating, setIsSimulating] = useState(false)
  const [showTyping, setShowTyping] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const tasksByState = useMemo(() => {
    return taskStates.reduce((acc, state) => {
      acc[state] = tasks.filter((task) => task.state === state)
      return acc
    }, {})
  }, [])

  const handleSimulate = () => {
    if (isSimulating) return
    setIsSimulating(true)
    setShowTyping(true)

    simulateMessages.forEach((message, index) => {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: prev.length + 1,
            ...message,
          },
        ])
        if (index === simulateMessages.length - 1) {
          setShowTyping(false)
          setIsSimulating(false)
        }
      }, 700 * (index + 1))
    })
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 [font-family:'Inter',sans-serif]">
      <Head>
        <title>Consendus.ai — Agent Swarm Orchestration</title>
      </Head>

      {view === 'landing' ? (
        <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-6 pb-16 pt-8">
          <header className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-300">
                <Bot className="h-5 w-5" />
              </div>
              <span className="text-lg font-semibold tracking-tight">Consendus.ai</span>
            </div>
            <nav className="flex flex-wrap items-center gap-4 text-sm text-slate-300">
              <a className="transition hover:text-white" href="#features">
                Features
              </a>
              <a className="transition hover:text-white" href="#architecture">
                Architecture
              </a>
              <a className="transition hover:text-white" href="#security">
                Security
              </a>
            </nav>
            <button
              className="inline-flex items-center gap-2 rounded-full bg-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:-translate-y-0.5"
              onClick={() => setView('console')}
            >
              Access Console
              <ArrowRight className="h-4 w-4" />
            </button>
          </header>

          <main className="mt-16 grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
            <section className="flex flex-col gap-6">
              <p className="w-fit rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs uppercase tracking-[0.3em] text-indigo-300">
                Autonomous Orchestration Layer
              </p>
              <h1 className="text-4xl font-semibold leading-tight tracking-tight text-white md:text-5xl lg:text-6xl">
                Orchestrate Your Agent Swarm
              </h1>
              <p className="max-w-xl text-base leading-relaxed text-slate-300 md:text-lg">
                Infrastructure for autonomous agents to communicate, coordinate, and reach consensus. Build
                resilient multi-agent systems with observability, compliance, and real-time control.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <button
                  className="inline-flex items-center gap-2 rounded-full bg-indigo-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:-translate-y-0.5"
                  onClick={() => setView('console')}
                >
                  Access Console
                  <ArrowRight className="h-4 w-4" />
                </button>
                <button className="rounded-full border border-white/10 px-6 py-3 text-sm font-semibold text-white/80 transition hover:text-white">
                  View Docs
                </button>
              </div>
            </section>

            <section className="rounded-3xl border border-white/10 bg-slate-800/60 p-6 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.7)] backdrop-blur">
              <div className="flex items-center gap-3 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-rose-400" />
                  <span className="h-2 w-2 rounded-full bg-amber-400" />
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                </div>
                <span>consendus.config.ts</span>
              </div>
              <pre className="mt-6 whitespace-pre-wrap rounded-2xl border border-white/10 bg-slate-900/70 p-4 text-sm text-emerald-200 [font-family:'JetBrains_Mono',monospace]">
{`import { Consendus } from '@consendus/core'

const swarm = new Consendus.Swarm({
  quorum: 3,
  strategy: 'weighted-majority',
  agents: [
    'Atlas-Orchestrator',
    'Codex-Dev',
    'Sentry-Sec',
  ],
  guardrails: ['pci', 'pii', 'soc2'],
  telemetry: {
    traces: true,
    sampling: 0.2,
  },
})

swarm.deploy({ region: 'us-east-1' })`}
              </pre>
            </section>
          </main>

          <section id="features" className="mt-20">
            <div className="grid gap-6 md:grid-cols-3">
              {features.map((feature) => {
                const Icon = feature.icon
                return (
                  <article
                    key={feature.title}
                    className="rounded-2xl border border-white/10 bg-slate-800/50 p-6 shadow-lg shadow-slate-900/40"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-300">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-white">{feature.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-300">{feature.description}</p>
                  </article>
                )
              })}
            </div>
          </section>

          <section
            id="architecture"
            className="mt-16 rounded-3xl border border-white/10 bg-gradient-to-br from-slate-800/80 to-slate-900/80 p-8"
          >
            <div className="grid gap-6 md:grid-cols-[0.8fr_1.2fr]">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-indigo-300">Infrastructure stack</p>
                <h2 className="mt-3 text-2xl font-semibold">Command, coordinate, converge.</h2>
              </div>
              <div className="space-y-4 text-sm text-slate-300">
                <p>
                  Consendus stitches together semantic routing, consensus voting, and observability into one
                  system. Keep agent swarms aligned with real-time guardrails and priority-based escalation.
                </p>
                <div className="flex flex-wrap gap-3">
                  {['Semantic Bus', 'Consensus SDK', 'Policy Engine', 'Telemetry Streams'].map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs text-slate-200"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section id="security" className="mt-16 text-center">
            <div className="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-slate-800/60 p-8">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-300">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h2 className="mt-4 text-2xl font-semibold">Secure by design</h2>
              <p className="mt-2 text-sm text-slate-300">
                Built-in audit trails, encrypted channels, and policy enforcement keep your agent fleet
                aligned with enterprise-grade compliance.
              </p>
            </div>
          </section>

          <footer className="mt-20 text-center text-xs text-slate-500">
            © 2024 Consendus Labs. All rights reserved.
          </footer>
        </div>
      ) : (
        <div className="flex min-h-screen bg-slate-900">
          <aside
            className={`fixed inset-y-0 left-0 z-40 w-64 border-r border-white/10 bg-slate-900/90 p-6 backdrop-blur transition-transform lg:relative lg:translate-x-0 ${
              sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
          >
            <div className="flex items-center justify-between lg:justify-start">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-300">
                  <Bot className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Consendus.ai</p>
                  <p className="text-xs text-slate-400">Swarm Console</p>
                </div>
              </div>
              <button
                className="text-slate-400 lg:hidden"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="mt-10 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.id}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition ${
                      activeTab === item.id
                        ? 'bg-indigo-500/20 text-white'
                        : 'text-slate-300 hover:bg-white/5 hover:text-white'
                    }`}
                    onClick={() => {
                      setActiveTab(item.id)
                      setSidebarOpen(false)
                    }}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </button>
                )
              })}
            </nav>
            <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-slate-300">
              <div className="flex items-center gap-2 text-slate-200">
                <Terminal className="h-4 w-4 text-emerald-300" />
                <span className="font-semibold">Realtime Status</span>
              </div>
              <p className="mt-2">All systems operational. Latency steady at 120ms.</p>
            </div>
          </aside>

          <div className="flex-1 lg:ml-64">
            <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 bg-slate-900/80 px-6 py-4 backdrop-blur">
              <div className="flex items-center gap-3">
                <button className="text-slate-400 lg:hidden" onClick={() => setSidebarOpen(true)}>
                  <Menu className="h-5 w-5" />
                </button>
                <div>
                  <p className="text-sm font-semibold text-white">
                    {navigation.find((nav) => nav.id === activeTab)?.label}
                  </p>
                  <p className="text-xs text-slate-400">Autonomous swarm orchestration</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button className="hidden items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-xs text-slate-200 transition hover:bg-white/5 md:flex">
                  <Sparkles className="h-3.5 w-3.5 text-indigo-300" />
                  AI Actions
                </button>
                <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-200">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  Riley Chen
                </div>
              </div>
            </header>

            <main className="space-y-8 px-6 py-6">
              {activeTab === 'overview' && (
                <section className="space-y-6 animate-fade-in">
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    {stats.map((stat) => (
                      <div
                        key={stat.label}
                        className="rounded-2xl border border-white/10 bg-slate-800/60 p-4"
                      >
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{stat.label}</p>
                        <div className="mt-3 flex items-end justify-between">
                          <p className="text-2xl font-semibold text-white">{stat.value}</p>
                          <span className="text-xs text-emerald-300">{stat.delta}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
                    <div className="rounded-2xl border border-white/10 bg-slate-800/60 p-6">
                      <div className="flex items-center justify-between">
                        <h2 className="text-sm font-semibold text-white">System Load vs Token Consumption</h2>
                        <span className="text-xs text-slate-400">Last 14 hours</span>
                      </div>
                      <div className="mt-6 h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                            <defs>
                              <linearGradient id="load" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0.1} />
                              </linearGradient>
                              <linearGradient id="tokens" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#34d399" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#34d399" stopOpacity={0.1} />
                              </linearGradient>
                            </defs>
                            <Tooltip contentStyle={chartTooltipStyle} labelStyle={{ color: '#94a3b8' }} />
                            <Area
                              type="monotone"
                              dataKey="load"
                              stroke="#6366f1"
                              strokeWidth={2}
                              fill="url(#load)"
                            />
                            <Area
                              type="monotone"
                              dataKey="tokens"
                              stroke="#10b981"
                              strokeWidth={2}
                              fill="url(#tokens)"
                            />
                            <Area type="monotone" dataKey="load" stroke="#6366f1" fill="url(#load)" />
                            <Area type="monotone" dataKey="tokens" stroke="#34d399" fill="url(#tokens)" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-slate-800/70 p-4">
                      <div className="mb-4 flex items-center justify-between">
                        <p className="text-sm text-slate-200">Terminal Log</p>
                        <span className="rounded-full bg-amber-400/10 px-2 py-1 text-xs text-amber-300">
                          live
                        </span>
                      </div>
                      <div className="space-y-3 overflow-y-auto text-xs text-emerald-200">
                        {logs.map((log) => (
                          <div key={log} className="flex items-start gap-2 font-mono">
                            <Terminal className="mt-0.5 h-3 w-3 text-emerald-300" />
                            <span>{log}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {activeTab === 'comms' && (
                <section className="grid gap-6 lg:grid-cols-[0.35fr_0.65fr] animate-fade-in">
                  <div className="rounded-2xl border border-white/10 bg-slate-800/60 p-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-sm font-semibold text-white">Channels</h2>
                      <button className="text-xs text-indigo-300">+ New</button>
                    </div>
                    <div className="mt-4 space-y-2 text-sm text-slate-300">
                      {channels.map((channel) => (
                        <button
                          key={channel}
                          className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left transition hover:bg-white/5"
                        >
                          <span>{channel}</span>
                          <ChevronRight className="h-3.5 w-3.5 text-slate-500" />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex h-full flex-col rounded-xl border border-white/10 bg-slate-800/70">
                    <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                      <div>
                        <p className="text-sm font-semibold text-white">#migration-api-v2</p>
                        <p className="text-xs text-slate-400">Agents coordinating rollout</p>
                      </div>
                      <button
                        onClick={handleSimulate}
                        className="rounded-full bg-indigo-500 px-3 py-1 text-xs font-semibold text-white transition hover:bg-indigo-400"
                      >
                        {isSimulating ? 'Simulating...' : 'Simulate Activity'}
                      </button>
                    </div>
                    <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
                      {messages.map((message) => (
                        <div key={message.id} className="space-y-2">
                          <div className="flex items-center gap-2 text-xs text-slate-400">
                            <span className="rounded-full bg-slate-900/80 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-slate-400">
                              Agent
                            </span>
                            <span className="text-slate-200">{message.author}</span>
                          </div>
                          {message.type === 'code' ? (
                            <pre className="rounded-xl border border-white/10 bg-slate-900/80 p-3 text-xs text-emerald-200">
                              <code className="font-mono">{message.content}</code>
                            </pre>
                          ) : (
                            <div
                              className={`rounded-xl border p-3 text-sm text-slate-200 ${
                                message.type === 'alert'
                                  ? 'border-amber-400/30 bg-amber-400/10 text-amber-200'
                                  : 'border-white/10 bg-slate-900/60'
                              }`}
                            >
                              {message.type === 'alert' && (
                                <div className="mb-1 flex items-center gap-2 text-xs uppercase tracking-[0.2em]">
                                  <ShieldAlert className="h-3 w-3" /> System Alert
                                </div>
                              )}
                              {message.content}
                            </div>
                          )}
                        </div>
                      ))}
                      {showTyping && (
                        <div className="rounded-xl border border-white/10 bg-slate-900/60 p-3 text-xs text-slate-400">
                          <span className="font-mono">[simulating]</span>
                          <div className="mt-2 flex items-center gap-2">
                            <span className="h-2 w-2 animate-pulse rounded-full bg-indigo-400" />
                            <span className="h-2 w-2 animate-pulse rounded-full bg-indigo-400 delay-150" />
                            <span className="h-2 w-2 animate-pulse rounded-full bg-indigo-400 delay-300" />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </section>
              )}

              {activeTab === 'orchestration' && (
                <section className="space-y-6 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-semibold text-white">Task Board</h2>
                      <p className="text-xs text-slate-400">Live workflow status across the swarm.</p>
                    </div>
                    <button className="rounded-full border border-white/10 px-4 py-2 text-xs text-slate-200">
                      New Task
                    </button>
                  </div>
                  <div className="grid gap-4 lg:grid-cols-4">
                    {['Pending', 'In Progress', 'Needs Consensus', 'Completed'].map((status) => (
                      <div key={status} className="rounded-2xl border border-white/10 bg-slate-800/60 p-4">
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{status}</p>
                        <div className="mt-4 space-y-3">
                          {tasksByState[state].map((task) => (
                            <div
                              key={task.title}
                              className="rounded-lg border border-white/10 bg-slate-900/70 p-3"
                            >
                              <p className="text-sm text-white">{task.title}</p>
                              <p className="mt-1 text-xs text-slate-400">{task.agent}</p>
                              {task.state === 'Needs Consensus' && (
                                <div className="mt-3">
                                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                                    <span>Consensus</span>
                                    <span>
                                      {task.votes}/{task.totalVotes} Votes
                                    </span>
                                  </div>
                                  <div className="mt-2 h-2 rounded-full bg-white/10">
                                    <div
                                      className="h-full rounded-full bg-purple-400"
                                      style={{
                                        width: `${Math.round((task.votes / task.totalVotes) * 100)}%`,
                                      }}
                                    />
                                  </div>
                                </div>
                                <p className="mt-2 text-slate-300">Assigned to {task.agent}</p>
                                {task.status === 'Needs Consensus' && (
                                  <div className="mt-3">
                                    <div className="flex items-center justify-between text-[10px] text-amber-200">
                                      <span>Consensus</span>
                                      <span>{task.votes}</span>
                                    </div>
                                    <div className="mt-1 h-1.5 w-full rounded-full bg-white/10">
                                      <div className="h-1.5 w-1/3 rounded-full bg-amber-400" />
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {activeTab === 'fleet' && (
                <section className="space-y-6 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-semibold text-white">Agent Fleet</h2>
                      <p className="text-xs text-slate-400">Directory of active swarm nodes.</p>
                    </div>
                    <button className="rounded-full border border-white/10 px-4 py-2 text-xs text-slate-200">
                      Deploy Agent
                    </button>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {agents.map((agent) => (
                      <div key={agent.name} className="rounded-2xl border border-white/10 bg-slate-800/60 p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className={`h-2 w-2 rounded-full ${statusStyles[agent.status]}`} />
                            <p className="text-sm font-semibold text-white">{agent.name}</p>
                          </div>
                          <Code2 className="h-4 w-4 text-indigo-300" />
                        </div>
                        <p className="mt-2 text-xs text-slate-400">{agent.role}</p>
                        <div className="mt-4 space-y-2 text-xs text-slate-300">
                          <div className="flex items-center justify-between">
                            <span>Specialization</span>
                            <span className="text-white">{agent.specialization}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Uptime</span>
                            <span className="text-white">{agent.uptime}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </section>
              )}
            </main>
          </div>
        </div>
      )}
      <style jsx global>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.35s ease-out;
        }
      `}</style>
    </div>
  )
}
