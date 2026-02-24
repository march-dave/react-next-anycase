import Head from 'next/head'
import { useMemo, useState } from 'react'
import {
  Activity,
  Bot,
  Cable,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  Command,
  Cpu,
  Gauge,
  GitMerge,
  LayoutDashboard,
  Menu,
  MessageSquare,
  Play,
  Rocket,
  Settings,
  Shield,
  Users,
  Vote,
} from 'lucide-react'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

const navItems = [
  { key: 'overview', label: 'Overview', icon: LayoutDashboard },
  { key: 'comms', label: 'Comms', icon: MessageSquare },
  { key: 'orchestration', label: 'Orchestration', icon: GitMerge },
  { key: 'fleet', label: 'Agent Fleet', icon: Users },
]

const analytics = [
  { time: '09:00', load: 42, tokens: 28 },
  { time: '10:00', load: 58, tokens: 35 },
  { time: '11:00', load: 51, tokens: 44 },
  { time: '12:00', load: 76, tokens: 61 },
  { time: '13:00', load: 69, tokens: 58 },
  { time: '14:00', load: 84, tokens: 73 },
  { time: '15:00', load: 79, tokens: 67 },
]

const channels = ['#migration-api-v2', '#security-audit', '#release-war-room', '#agent-onboarding']

const initialMessages = [
  {
    id: 1,
    author: 'Atlas-Orchestrator',
    kind: 'agent',
    time: '14:02',
    text: 'Routing task graph for service split. Codex-Dev and Sentry-Sec, please confirm dependencies.',
  },
  {
    id: 2,
    author: 'Sentry-Sec',
    kind: 'agent',
    time: '14:03',
    text: '```ts\nconst policy = guardian.verify("migration-api-v2", {\n  secrets: "vault://prod/main",\n  riskBudget: "low"\n})\n```',
  },
  {
    id: 3,
    author: 'System Alert',
    kind: 'system',
    time: '14:03',
    text: 'Consensus drift detected in #migration-api-v2. Triggering tie-break protocol.',
  },
]

const mockQueue = [
  {
    id: 'task-1',
    title: 'Refactor token metering middleware',
    agent: 'Codex-Dev',
    state: 'In Progress',
  },
  {
    id: 'task-2',
    title: 'Validate schema migration rollbacks',
    agent: 'Atlas-Orchestrator',
    state: 'Pending',
  },
  {
    id: 'task-3',
    title: 'Approve cross-agent write access policy',
    agent: 'Sentry-Sec',
    state: 'Needs Consensus',
    votes: 1,
    totalVotes: 3,
  },
  {
    id: 'task-4',
    title: 'Deploy semantic bus shard to eu-west-1',
    agent: 'Nova-Deploy',
    state: 'Completed',
  },
]

const fleet = [
  { name: 'Atlas-Orchestrator', role: 'Coordinator', specialization: 'Task routing', uptime: '99.99%', status: 'Idle' },
  { name: 'Codex-Dev', role: 'Builder', specialization: 'Code generation', uptime: '99.80%', status: 'Busy' },
  { name: 'Sentry-Sec', role: 'Guardian', specialization: 'Security policy', uptime: '99.95%', status: 'Error' },
  { name: 'Nova-Deploy', role: 'Operator', specialization: 'Rollouts', uptime: '99.91%', status: 'Idle' },
]

const statusStyles = {
  Idle: 'bg-emerald-400',
  Busy: 'bg-amber-400',
  Error: 'bg-red-500',
}

function ViewContainer({ children }) {
  return (
    <div key={typeof children?.type === 'string' ? children.type : 'view'} style={{ animation: 'fadeIn 260ms ease-out' }}>
      {children}
    </div>
  )
}

function renderMessageText(text) {
  const codeMatch = text.match(/```([\s\S]*?)```/)
  if (codeMatch) {
    return (
      <pre className="mt-2 overflow-x-auto rounded-lg border border-emerald-500/30 bg-slate-950 p-3 text-xs text-emerald-300">
        <code style={{ fontFamily: '"JetBrains Mono", monospace' }}>{codeMatch[1].trim()}</code>
      </pre>
    )
  }

  return <p className="text-sm text-slate-200">{text}</p>
}

export default function Consendus() {
  const [inConsole, setInConsole] = useState(false)
  const [activeView, setActiveView] = useState('overview')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeChannel, setActiveChannel] = useState(channels[0])
  const [messages, setMessages] = useState(initialMessages)
  const [simulating, setSimulating] = useState(false)

  const statCards = useMemo(
    () => [
      { label: 'Active Agents', value: '24', icon: Bot, tone: 'text-indigo-300' },
      { label: 'Messages/min', value: '186', icon: Cable, tone: 'text-purple-300' },
      { label: 'Consensus Rate', value: '96.8%', icon: Vote, tone: 'text-emerald-300' },
      { label: 'Token Usage', value: '1.24M', icon: Cpu, tone: 'text-amber-300' },
    ],
    []
  )

  const appendSimulatedMessages = () => {
    if (simulating) return
    setSimulating(true)

    const queued = [
      {
        id: Date.now() + 1,
        author: 'Codex-Dev',
        kind: 'agent',
        time: '14:06',
        text: 'Patch complete. Running verification hooks before merging migration-api-v2.',
      },
      {
        id: Date.now() + 2,
        author: 'Atlas-Orchestrator',
        kind: 'agent',
        time: '14:06',
        text: 'Received. Rebalancing workload to reduce token spikes on shard-c.',
      },
      {
        id: Date.now() + 3,
        author: 'System Alert',
        kind: 'system',
        time: '14:07',
        text: 'Consensus threshold reached (3/3). Promotion gate unlocked.',
      },
    ]

    queued.forEach((entry, index) => {
      setTimeout(() => {
        setMessages((previous) => [...previous, entry])
        if (index === queued.length - 1) {
          setSimulating(false)
        }
      }, 450 * (index + 1))
    })
  }

  const view = () => {
    if (activeView === 'overview') {
      return (
        <ViewContainer key={activeView}>
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {statCards.map((card) => {
              const Icon = card.icon
              return (
                <div key={card.label} className="rounded-xl border border-white/10 bg-slate-800/80 p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-slate-400">{card.label}</p>
                    <Icon className={`h-4 w-4 ${card.tone}`} />
                  </div>
                  <p className="mt-3 text-2xl font-semibold text-slate-100">{card.value}</p>
                </div>
              )
            })}
          </section>

          <section className="mt-6 grid gap-6 xl:grid-cols-[2fr_1fr]">
            <div className="h-[340px] rounded-xl border border-white/10 bg-slate-800/80 p-4">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-sm font-medium text-slate-200">System Load vs Token Consumption</h2>
                <Gauge className="h-4 w-4 text-indigo-300" />
              </div>
              <ResponsiveContainer width="100%" height="92%">
                <AreaChart data={analytics}>
                  <defs>
                    <linearGradient id="load" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0.02} />
                    </linearGradient>
                    <linearGradient id="tokens" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.03} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
                  <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      border: '1px solid rgba(148, 163, 184, 0.3)',
                      borderRadius: '10px',
                      color: '#e2e8f0',
                    }}
                  />
                  <Area type="monotone" dataKey="load" stroke="#6366f1" fill="url(#load)" strokeWidth={2} />
                  <Area type="monotone" dataKey="tokens" stroke="#10b981" fill="url(#tokens)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="rounded-xl border border-white/10 bg-slate-900 p-4">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-medium text-slate-200">Terminal Log</h2>
                <Activity className="h-4 w-4 text-amber-300" />
              </div>
              <div className="h-[280px] overflow-auto rounded-lg border border-white/10 bg-slate-950 p-3 text-xs leading-6 text-slate-300 no-scrollbar" style={{ fontFamily: '"JetBrains Mono", monospace' }}>
                <p>[INFO] Agent-2 connected to semantic bus (latency 18ms)</p>
                <p>[INFO] Consensus quorum initialized for task-3</p>
                <p>[WARN] High latency detected on shard eu-west-1</p>
                <p>[INFO] Guardian Rails policy patch applied by Sentry-Sec</p>
                <p>[INFO] Token limiter adjusted (window=10s burst=128)</p>
                <p>[SUCCESS] Deployment approved after 3/3 votes</p>
                <p>[INFO] Heartbeat stream stable (24 active agents)</p>
              </div>
            </div>
          </section>
        </ViewContainer>
      )
    }

    if (activeView === 'comms') {
      return (
        <ViewContainer key={activeView}>
          <section className="grid gap-5 lg:grid-cols-[260px_1fr]">
            <div className="rounded-xl border border-white/10 bg-slate-800/70 p-4">
              <h2 className="text-sm font-medium text-slate-200">Channels</h2>
              <div className="mt-3 space-y-2 text-sm text-slate-300">
                {channels.map((channel) => (
                  <button
                    key={channel}
                    onClick={() => setActiveChannel(channel)}
                    className={`w-full rounded-lg px-3 py-2 text-left transition ${activeChannel === channel ? 'bg-indigo-500/20 text-indigo-200' : 'hover:bg-slate-700/50'}`}
                  >
                    {channel}
                  </button>
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-white/10 bg-slate-800/70 p-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-medium text-slate-200">{activeChannel}</h2>
                <button
                  onClick={appendSimulatedMessages}
                  disabled={simulating}
                  className="inline-flex items-center gap-2 rounded-lg bg-purple-500/20 px-3 py-2 text-xs font-semibold text-purple-200 transition hover:bg-purple-500/30 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Play className="h-3.5 w-3.5" />
                  {simulating ? 'Simulating...' : 'Simulate Activity'}
                </button>
              </div>
              {simulating && (
                <div className="mt-3 inline-flex items-center gap-2 rounded-md border border-purple-400/30 bg-purple-500/10 px-2.5 py-1 text-xs text-purple-200">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-purple-300" />
                  Agents are drafting responses...
                </div>
              )}
              <div className="mt-4 h-[360px] space-y-3 overflow-auto pr-1 no-scrollbar">
                {messages.map((message) => (
                  <article
                    key={message.id}
                    className={`rounded-lg border p-3 ${message.kind === 'system' ? 'border-amber-400/40 bg-amber-500/10' : 'border-white/10 bg-slate-900/70'}`}
                    style={{ animation: 'fadeIn 240ms ease-out' }}
                  >
                    <div className="mb-1 flex items-center justify-between text-xs">
                      <p className={message.kind === 'system' ? 'font-semibold text-amber-300' : 'font-semibold text-indigo-200'}>{message.author}</p>
                      <span className="text-slate-400" style={{ fontFamily: '"JetBrains Mono", monospace' }}>{message.time}</span>
                    </div>
                    {renderMessageText(message.text)}
                  </article>
                ))}
              </div>
            </div>
          </section>
        </ViewContainer>
      )
    }

    if (activeView === 'orchestration') {
      const columns = ['Pending', 'In Progress', 'Needs Consensus', 'Completed']
      return (
        <ViewContainer key={activeView}>
          <section className="grid gap-4 xl:grid-cols-4">
            {columns.map((column) => (
              <div key={column} className="rounded-xl border border-white/10 bg-slate-800/70 p-4">
                <h2 className="text-sm font-medium text-slate-200">{column}</h2>
                <div className="mt-3 space-y-3">
                  {mockQueue
                    .filter((task) => task.state === column)
                    .map((task) => (
                      <article key={task.id} className="rounded-lg border border-white/10 bg-slate-900/80 p-3">
                        <p className="text-sm font-semibold text-slate-100">{task.title}</p>
                        <p className="mt-2 text-xs text-slate-400">Assigned: {task.agent}</p>
                        {task.state === 'Needs Consensus' && (
                          <div className="mt-3">
                            <p className="mb-1 text-xs text-purple-200">
                              {task.votes}/{task.totalVotes} Votes
                            </p>
                            <div className="h-2 rounded-full bg-slate-700">
                              <div
                                className="h-2 rounded-full bg-purple-400"
                                style={{ width: `${(task.votes / task.totalVotes) * 100}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </article>
                    ))}
                </div>
              </div>
            ))}
          </section>
        </ViewContainer>
      )
    }

    return (
      <ViewContainer key={activeView}>
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {fleet.map((agent) => (
            <article key={agent.name} className="rounded-xl border border-white/10 bg-slate-800/80 p-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-100">{agent.name}</h2>
                <span className={`h-2.5 w-2.5 rounded-full ${statusStyles[agent.status]}`} />
              </div>
              <p className="mt-3 text-xs text-slate-400">Role</p>
              <p className="text-sm text-slate-200">{agent.role}</p>
              <p className="mt-2 text-xs text-slate-400">Specialization</p>
              <p className="text-sm text-slate-200">{agent.specialization}</p>
              <p className="mt-2 text-xs text-slate-400">Uptime</p>
              <p className="text-sm text-emerald-300" style={{ fontFamily: '"JetBrains Mono", monospace' }}>{agent.uptime}</p>
            </article>
          ))}
        </section>
      </ViewContainer>
    )
  }

  return (
    <>
      <Head>
        <title>Consendus.ai | Autonomous Agent Infrastructure</title>
      </Head>

      <div className="min-h-screen bg-slate-900 text-slate-100" style={{ fontFamily: '"Inter", system-ui, sans-serif' }}>
        {!inConsole ? (
          <main className="mx-auto max-w-6xl px-6 py-10 md:px-10 md:py-14">
            <header className="flex items-center justify-between rounded-xl border border-white/10 bg-slate-800/50 px-4 py-3 backdrop-blur">
              <div className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-200">
                <Command className="h-4 w-4" /> Consendus.ai
              </div>
              <div className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300">Infra for agent swarms</div>
            </header>

            <section className="mt-10 grid items-center gap-8 lg:grid-cols-2">
              <div>
                <p className="inline-flex items-center gap-2 rounded-full border border-purple-400/30 bg-purple-500/10 px-3 py-1 text-xs text-purple-200">
                  <Rocket className="h-3.5 w-3.5" /> Distributed Agent Runtime
                </p>
                <h1 className="mt-4 text-4xl font-semibold leading-tight md:text-6xl">Orchestrate Your Agent Swarm</h1>
                <p className="mt-4 max-w-xl text-slate-300 md:text-lg">
                  Infrastructure for autonomous agents to communicate, coordinate, and reach consensus.
                </p>
                <button
                  onClick={() => setInConsole(true)}
                  className="mt-7 inline-flex items-center gap-2 rounded-lg bg-indigo-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-400"
                >
                  Access Console
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              <div className="rounded-xl border border-white/10 bg-slate-800/80 p-4 shadow-2xl shadow-indigo-900/20 backdrop-blur">
                <div className="mb-3 flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                </div>
                <pre className="overflow-x-auto rounded-lg border border-white/10 bg-slate-950 p-4 text-xs text-emerald-300" style={{ fontFamily: '"JetBrains Mono", monospace' }}>
{`const swarm = new Consendus.Swarm({
  name: "migration-api-v2",
  consensus: { algorithm: "raft", quorum: 3 },
  agents: [
    { id: "atlas", role: "orchestrator" },
    { id: "codex", role: "developer" },
    { id: "sentry", role: "security" },
  ],
  rails: ["policy-guard", "latency-failover"]
})`}
                </pre>
              </div>
            </section>

            <section className="mt-12 grid gap-4 md:grid-cols-3">
              {[
                {
                  title: 'Semantic Bus',
                  desc: 'Pub/sub transport for intent-aware inter-agent messaging.',
                  icon: Cable,
                  tone: 'text-indigo-200',
                },
                {
                  title: 'Consensus Engine',
                  desc: 'Deterministic voting to finalize plans and unblock execution.',
                  icon: ClipboardCheck,
                  tone: 'text-emerald-200',
                },
                {
                  title: 'Guardian Rails',
                  desc: 'Safety constraints, policy hooks, and rollback controls.',
                  icon: Shield,
                  tone: 'text-amber-200',
                },
              ].map((item) => {
                const Icon = item.icon
                return (
                  <article key={item.title} className="rounded-xl border border-white/10 bg-slate-800/70 p-5">
                    <div className={`inline-flex rounded-lg bg-slate-900 p-2 ${item.tone}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <h2 className="mt-4 text-lg font-semibold">{item.title}</h2>
                    <p className="mt-2 text-sm text-slate-300">{item.desc}</p>
                  </article>
                )
              })}
            </section>
          </main>
        ) : (
          <div className="flex min-h-screen">
            <aside
              className={`fixed inset-y-0 left-0 z-30 w-64 border-r border-white/10 bg-slate-900/95 p-4 backdrop-blur transition-transform md:static md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
            >
              <div className="mb-6 flex items-center justify-between">
                <div className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-200">
                  <Command className="h-4 w-4" /> Consendus
                </div>
                <button className="rounded-md border border-white/10 p-1.5 md:hidden" onClick={() => setSidebarOpen(false)}>
                  <ChevronLeft className="h-4 w-4" />
                </button>
              </div>

              <nav className="space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <button
                      key={item.key}
                      onClick={() => {
                        setActiveView(item.key)
                        setSidebarOpen(false)
                      }}
                      className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition ${activeView === item.key ? 'bg-indigo-500/20 text-indigo-200' : 'text-slate-300 hover:bg-slate-800'}`}
                    >
                      <Icon className="h-4 w-4" /> {item.label}
                    </button>
                  )
                })}
              </nav>
            </aside>

            <div className="flex-1 px-4 py-4 md:px-8">
              <header className="mb-5 flex items-center justify-between rounded-xl border border-white/10 bg-slate-800/70 px-4 py-3">
                <button className="rounded-md border border-white/10 p-2 md:hidden" onClick={() => setSidebarOpen(true)}>
                  <Menu className="h-4 w-4" />
                </button>
                <div className="hidden text-sm text-slate-300 md:block">Environment: Production Swarm</div>
                <div className="ml-auto inline-flex items-center gap-2 rounded-lg bg-slate-900 px-3 py-1.5 text-xs text-slate-300">
                  <Settings className="h-3.5 w-3.5" /> ops@consendus.ai
                </div>
              </header>

              {view()}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
