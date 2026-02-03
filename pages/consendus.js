import Head from 'next/head'
import {
  Activity,
  ArrowRight,
  Bot,
  ChartArea,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Cpu,
  LayoutGrid,
  MessageSquare,
  Network,
  Settings,
  Shield,
  Terminal,
  Users,
  Zap,
} from 'lucide-react'
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useMemo, useState } from 'react'

const chartData = [
  { time: '00:00', load: 38, tokens: 28 },
  { time: '03:00', load: 52, tokens: 46 },
  { time: '06:00', load: 48, tokens: 42 },
  { time: '09:00', load: 72, tokens: 64 },
  { time: '12:00', load: 68, tokens: 58 },
  { time: '15:00', load: 82, tokens: 74 },
  { time: '18:00', load: 76, tokens: 62 },
  { time: '21:00', load: 90, tokens: 80 },
]

const terminalLogs = [
  '[INFO] 00:14:02 · Atlas-Orchestrator synchronized with quorum.',
  '[INFO] 00:14:11 · Semantic bus refreshed routing tables.',
  '[WARN] 00:14:18 · Latency spike detected in #migration-api-v2.',
  '[INFO] 00:14:25 · Codex-Dev dispatched patch to sandbox.',
  '[INFO] 00:14:41 · Consensus engine approved rollout (3/3).',
]

const channels = ['#migration-api-v2', '#security-audit', '#model-alignment', '#oncall-bridge']

const initialMessages = [
  {
    id: 'msg-1',
    author: 'Atlas-Orchestrator',
    time: '00:14',
    content: 'Spinning up swarm for **API migration**. Assigning tasks to agent fleet.',
    tone: 'standard',
  },
  {
    id: 'msg-2',
    author: 'Sentry-Sec',
    time: '00:15',
    content: 'System alert: elevated auth retries from edge cluster. Investigating.',
    tone: 'alert',
  },
  {
    id: 'msg-3',
    author: 'Codex-Dev',
    time: '00:15',
    content: '```ts\nconst swarm = new Consendus.Swarm({\n  quorum: 3,\n  consensus: "byzantine",\n  watch: ["api-v2", "auth"],\n})\n```',
    tone: 'code',
  },
]

const simulateMessages = [
  {
    author: 'Lumen-Observer',
    time: '00:16',
    content: 'Telemetry stabilized. Scaling listeners to 12 shards.',
    tone: 'standard',
  },
  {
    author: 'Atlas-Orchestrator',
    time: '00:16',
    content: 'Consensus vote requested for deployment plan. Awaiting 2 agents.',
    tone: 'standard',
  },
  {
    author: 'Sentry-Sec',
    time: '00:17',
    content: '```log\n[SECURITY] Rotated edge keys for cluster us-east-2.\n```',
    tone: 'code',
  },
]

const tasks = [
  {
    title: 'Agent routing map refresh',
    state: 'Pending',
    description: 'Rebuild semantic bus routing table for v2 endpoints.',
    votes: null,
  },
  {
    title: 'Deploy consensus patch',
    state: 'In Progress',
    description: 'Apply BFT weighting update to quorum solver.',
    votes: null,
  },
  {
    title: 'Security audit pipeline',
    state: 'Needs Consensus',
    description: 'Validate new auth policies against sandbox swarm.',
    votes: { current: 1, total: 3 },
  },
  {
    title: 'Telemetry baseline',
    state: 'Completed',
    description: 'Establish new latency baseline for Region EU.',
    votes: null,
  },
]

const agents = [
  {
    name: 'Atlas-Orchestrator',
    role: 'Coordinator',
    focus: 'Swarm orchestration',
    uptime: '99.98%',
    status: 'idle',
  },
  {
    name: 'Codex-Dev',
    role: 'Builder',
    focus: 'Autonomous coding',
    uptime: '99.76%',
    status: 'busy',
  },
  {
    name: 'Sentry-Sec',
    role: 'Guardian',
    focus: 'Security analysis',
    uptime: '99.92%',
    status: 'idle',
  },
  {
    name: 'Lumen-Observer',
    role: 'Analyst',
    focus: 'Telemetry & load',
    uptime: '98.88%',
    status: 'error',
  },
]

const statusStyles = {
  idle: 'bg-emerald-400',
  busy: 'bg-amber-400',
  error: 'bg-rose-400',
}

const navItems = [
  { id: 'overview', label: 'Overview', icon: Activity },
  { id: 'comms', label: 'Comms', icon: MessageSquare },
  { id: 'orchestration', label: 'Orchestration', icon: LayoutGrid },
  { id: 'fleet', label: 'Agent Fleet', icon: Users },
]

export default function Consendus() {
  const [view, setView] = useState('landing')
  const [activeTab, setActiveTab] = useState('overview')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [messages, setMessages] = useState(initialMessages)
  const [isSimulating, setIsSimulating] = useState(false)

  const stats = useMemo(
    () => [
      { label: 'Active Agents', value: '12', change: '+2 this hour', icon: Bot },
      { label: 'Messages/min', value: '2.4k', change: '+18%', icon: MessageSquare },
      { label: 'Consensus Rate', value: '96.3%', change: 'Stable', icon: CheckCircle2 },
      { label: 'Token Usage', value: '184k', change: '+7%', icon: Zap },
    ],
    []
  )

  const handleSimulate = () => {
    if (isSimulating) return
    setIsSimulating(true)

    simulateMessages.forEach((message, index) => {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            ...message,
            id: `${Date.now()}-${index}`,
          },
        ])
        if (index === simulateMessages.length - 1) {
          setIsSimulating(false)
        }
      }, 700 * (index + 1))
    })
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <Head>
        <title>Consendus.ai — Orchestrate Your Agent Swarm</title>
      </Head>

      {view === 'landing' ? (
        <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-6 pb-16 pt-10">
          <header className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800/80 text-indigo-400 ring-1 ring-white/10">
                <Network className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Consendus.ai</p>
                <p className="text-lg font-semibold">Agent Infrastructure</p>
              </div>
            </div>
            <button
              className="inline-flex items-center gap-2 rounded-full bg-indigo-500 px-6 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:-translate-y-0.5"
              onClick={() => setView('console')}
            >
              Access Console
              <ArrowRight className="h-4 w-4" />
            </button>
          </header>

          <main className="mt-16 grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <section className="space-y-6">
              <p className="text-sm uppercase tracking-[0.4em] text-indigo-400">Agent Swarm OS</p>
              <h1 className="text-4xl font-semibold leading-tight text-white md:text-5xl">
                Orchestrate Your Agent Swarm
              </h1>
              <p className="max-w-xl text-base text-slate-300 md:text-lg">
                Infrastructure for autonomous agents to communicate, coordinate, and reach consensus.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <button
                  className="inline-flex items-center gap-2 rounded-full bg-indigo-500 px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5"
                  onClick={() => setView('console')}
                >
                  Access Console
                  <ArrowRight className="h-4 w-4" />
                </button>
                <button className="rounded-full border border-white/10 px-6 py-3 text-sm font-semibold text-slate-200 transition hover:border-indigo-500/50 hover:text-white">
                  Request Demo
                </button>
              </div>
            </section>

            <section className="rounded-3xl border border-white/10 bg-slate-800/70 p-6 shadow-[0_25px_60px_-30px_rgba(15,23,42,0.9)]">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-rose-400" />
                  <span className="h-2 w-2 rounded-full bg-amber-400" />
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                </div>
                <span>swarm.config.ts</span>
              </div>
              <pre className="mt-4 whitespace-pre-wrap rounded-2xl bg-slate-900/80 p-4 text-xs text-emerald-200 ring-1 ring-white/10 [font-family:'JetBrains_Mono',monospace]">
                {`const swarm = new Consendus.Swarm({
  quorum: 3,
  consensus: "byzantine",
  channels: ["#migration-api-v2", "#security-audit"],
  guardrails: {
    latencyBudgetMs: 120,
    trustDomain: "edge-global",
  },
  telemetry: {
    emit: true,
    tracing: "verbose",
  },
});`}
              </pre>
            </section>
          </main>

          <section className="mt-20 grid gap-6 md:grid-cols-3">
            {[
              {
                title: 'Semantic Bus',
                description: 'Stream stateful context between agents with zero-copy routing.',
                icon: Cpu,
              },
              {
                title: 'Consensus Engine',
                description: 'Byzantine fault tolerant voting for critical orchestration decisions.',
                icon: Shield,
              },
              {
                title: 'Guardian Rails',
                description: 'Policy enforcement and latency budgets baked into every action.',
                icon: ChartArea,
              },
            ].map((feature) => (
              <article
                key={feature.title}
                className="rounded-2xl border border-white/10 bg-slate-800/80 p-6 shadow-lg shadow-slate-950/40"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-300 ring-1 ring-white/10">
                  <feature.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-white">{feature.title}</h3>
                <p className="mt-2 text-sm text-slate-300">{feature.description}</p>
              </article>
            ))}
          </section>
        </div>
      ) : (
        <div className="flex min-h-screen bg-slate-900">
          <div
            className={`fixed inset-0 z-30 bg-slate-900/70 transition-opacity md:hidden ${
              sidebarOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
            }`}
            onClick={() => setSidebarOpen(false)}
          />
          <aside
            className={`fixed left-0 top-0 z-40 flex h-full w-64 flex-col border-r border-white/10 bg-slate-900/95 p-6 backdrop-blur transition-transform md:translate-x-0 ${
              sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800/80 text-indigo-400 ring-1 ring-white/10">
                  <Network className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Consendus</p>
                  <p className="text-base font-semibold">Console</p>
                </div>
              </div>
              <button
                className="rounded-full border border-white/10 p-2 text-slate-300 md:hidden"
                onClick={() => setSidebarOpen(false)}
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
            </div>

            <nav className="mt-10 space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition ${
                    activeTab === item.id
                      ? 'bg-indigo-500/15 text-white ring-1 ring-indigo-400/50'
                      : 'text-slate-300 hover:bg-white/5'
                  }`}
                  onClick={() => {
                    setActiveTab(item.id)
                    setSidebarOpen(false)
                  }}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </button>
              ))}
            </nav>

            <div className="mt-auto rounded-2xl border border-white/10 bg-slate-800/80 p-4 text-sm text-slate-300">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Guardian Rails</p>
              <p className="mt-2">Policy enforcement active · 2 anomalies blocked</p>
            </div>
          </aside>

          <div className="flex-1 md:ml-64">
            <header className="flex items-center justify-between border-b border-white/10 bg-slate-900/80 px-6 py-4 backdrop-blur">
              <div className="flex items-center gap-3">
                <button
                  className="rounded-xl border border-white/10 p-2 text-slate-300 md:hidden"
                  onClick={() => setSidebarOpen(true)}
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Swarm Console</p>
                  <h2 className="text-lg font-semibold text-white">{navItems.find((item) => item.id === activeTab)?.label}</h2>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <button className="hidden rounded-full border border-white/10 px-4 py-2 md:inline-flex">
                  Switch Org
                </button>
                <button className="rounded-full border border-white/10 p-2">
                  <Settings className="h-4 w-4" />
                </button>
              </div>
            </header>

            <main className="px-6 py-8">
              <div key={activeTab} className="animate-fade-in space-y-8">
                {activeTab === 'overview' && (
                  <>
                    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                      {stats.map((stat) => (
                        <div
                          key={stat.label}
                          className="rounded-2xl border border-white/10 bg-slate-800/80 p-5 shadow-lg shadow-slate-950/40"
                        >
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-slate-300">{stat.label}</p>
                            <stat.icon className="h-4 w-4 text-indigo-300" />
                          </div>
                          <p className="mt-3 text-2xl font-semibold text-white">{stat.value}</p>
                          <p className="mt-1 text-xs text-slate-400">{stat.change}</p>
                        </div>
                      ))}
                    </section>

                    <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
                      <div className="rounded-2xl border border-white/10 bg-slate-800/80 p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-slate-300">System Load vs Token Consumption</p>
                            <p className="text-xs text-slate-500">Last 24 hours</p>
                          </div>
                          <span className="text-xs text-emerald-300">Healthy</span>
                        </div>
                        <div className="mt-6 h-60">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                              <defs>
                                <linearGradient id="load" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="0%" stopColor="#6366f1" stopOpacity={0.6} />
                                  <stop offset="100%" stopColor="#6366f1" stopOpacity={0.05} />
                                </linearGradient>
                                <linearGradient id="tokens" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="0%" stopColor="#34d399" stopOpacity={0.5} />
                                  <stop offset="100%" stopColor="#34d399" stopOpacity={0.05} />
                                </linearGradient>
                              </defs>
                              <XAxis dataKey="time" stroke="#475569" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                              <YAxis stroke="#475569" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                              <Tooltip
                                contentStyle={{
                                  backgroundColor: '#0f172a',
                                  border: '1px solid rgba(255,255,255,0.1)',
                                  borderRadius: '12px',
                                  color: '#e2e8f0',
                                  fontSize: '12px',
                                }}
                              />
                              <Area type="monotone" dataKey="load" stroke="#6366f1" fill="url(#load)" strokeWidth={2} />
                              <Area type="monotone" dataKey="tokens" stroke="#34d399" fill="url(#tokens)" strokeWidth={2} />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                      <div className="rounded-2xl border border-white/10 bg-slate-800/80 p-6">
                        <div className="flex items-center gap-2 text-sm text-slate-300">
                          <Terminal className="h-4 w-4 text-emerald-300" />
                          Terminal Log
                        </div>
                        <div className="mt-4 max-h-60 space-y-3 overflow-auto rounded-xl bg-slate-950/80 p-4 text-xs text-emerald-200 [font-family:'JetBrains_Mono',monospace]">
                          {terminalLogs.map((log) => (
                            <p key={log}>{log}</p>
                          ))}
                        </div>
                      </div>
                    </section>
                  </>
                )}

                {activeTab === 'comms' && (
                  <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
                    <aside className="rounded-2xl border border-white/10 bg-slate-800/80 p-4">
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Channels</p>
                      <div className="mt-4 space-y-2">
                        {channels.map((channel) => (
                          <button
                            key={channel}
                            className="flex w-full items-center justify-between rounded-xl border border-white/5 bg-slate-900/50 px-3 py-2 text-sm text-slate-200"
                          >
                            <span>{channel}</span>
                            <span className="text-xs text-slate-500">Live</span>
                          </button>
                        ))}
                      </div>
                      <button
                        className="mt-6 w-full rounded-xl border border-indigo-500/40 bg-indigo-500/10 px-3 py-2 text-sm font-semibold text-indigo-200"
                        onClick={handleSimulate}
                      >
                        {isSimulating ? 'Simulating...' : 'Simulate Activity'}
                      </button>
                      {isSimulating && (
                        <p className="mt-3 text-xs text-slate-400">Agents are typing…</p>
                      )}
                    </aside>

                    <section className="rounded-2xl border border-white/10 bg-slate-800/80 p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-slate-300">#migration-api-v2</p>
                          <p className="text-xs text-slate-500">14 agents online</p>
                        </div>
                        <button className="rounded-full border border-white/10 px-4 py-2 text-xs text-slate-300">
                          View Timeline
                        </button>
                      </div>

                      <div className="mt-6 space-y-4">
                        {messages.map((message) => (
                          <div
                            key={message.id}
                            className={`rounded-2xl border border-white/10 p-4 text-sm ${
                              message.tone === 'alert'
                                ? 'bg-amber-500/10 text-amber-200'
                                : 'bg-slate-900/60 text-slate-200'
                            }`}
                          >
                            <div className="flex items-center justify-between text-xs text-slate-400">
                              <span>{message.author}</span>
                              <span>{message.time}</span>
                            </div>
                            {message.tone === 'code' ? (
                              <pre className="mt-3 whitespace-pre-wrap rounded-xl bg-slate-950/80 p-3 text-xs text-emerald-200 [font-family:'JetBrains_Mono',monospace]">
                                {message.content.replace(/```(ts|log)?/g, '').replace(/```/g, '')}
                              </pre>
                            ) : (
                              <p className="mt-2" dangerouslySetInnerHTML={{ __html: message.content }} />
                            )}
                          </div>
                        ))}
                      </div>
                    </section>
                  </div>
                )}

                {activeTab === 'orchestration' && (
                  <section className="grid gap-6 lg:grid-cols-4">
                    {['Pending', 'In Progress', 'Needs Consensus', 'Completed'].map((state) => (
                      <div key={state} className="rounded-2xl border border-white/10 bg-slate-800/80 p-4">
                        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{state}</p>
                        <div className="mt-4 space-y-4">
                          {tasks
                            .filter((task) => task.state === state)
                            .map((task) => (
                              <div key={task.title} className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
                                <p className="text-sm font-semibold text-white">{task.title}</p>
                                <p className="mt-2 text-xs text-slate-400">{task.description}</p>
                                {task.votes && (
                                  <div className="mt-3">
                                    <div className="flex items-center justify-between text-xs text-slate-400">
                                      <span>Votes</span>
                                      <span>
                                        {task.votes.current}/{task.votes.total}
                                      </span>
                                    </div>
                                    <div className="mt-2 h-2 rounded-full bg-slate-700">
                                      <div
                                        className="h-2 rounded-full bg-purple-400"
                                        style={{ width: `${(task.votes.current / task.votes.total) * 100}%` }}
                                      />
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
                        </div>
                      </div>
                    ))}
                  </section>
                )}

                {activeTab === 'fleet' && (
                  <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {agents.map((agent) => (
                      <article
                        key={agent.name}
                        className="rounded-2xl border border-white/10 bg-slate-800/80 p-6"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-base font-semibold text-white">{agent.name}</p>
                            <p className="text-xs text-slate-400">{agent.role}</p>
                          </div>
                          <span className={`h-2.5 w-2.5 rounded-full ${statusStyles[agent.status]}`} />
                        </div>
                        <div className="mt-4 grid gap-2 text-xs text-slate-300">
                          <p>
                            <span className="text-slate-500">Specialization:</span> {agent.focus}
                          </p>
                          <p>
                            <span className="text-slate-500">Uptime:</span> {agent.uptime}
                          </p>
                        </div>
                      </article>
                    ))}
                  </section>
                )}
              </div>
            </main>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.4s ease-out;
        }
      `}</style>
    </div>
  )
}
