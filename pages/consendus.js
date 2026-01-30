import { useMemo, useState } from 'react'
import {
  Activity,
  AlertTriangle,
  Bot,
  Boxes,
  CheckCircle2,
  ChevronRight,
  Cpu,
  FileTerminal,
  Layers,
  MessageCircle,
  Orbit,
  ShieldCheck,
  Sparkles,
  UserCircle2,
  Zap,
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

const featureCards = [
  {
    title: 'Semantic Bus',
    description: 'A low-latency message fabric that keeps every agent in sync.',
    icon: Orbit,
  },
  {
    title: 'Consensus Engine',
    description: 'Distributed voting for critical actions with quorum enforcement.',
    icon: Layers,
  },
  {
    title: 'Guardian Rails',
    description: 'Policy-aware safety gates that prevent swarm drift.',
    icon: ShieldCheck,
  },
]

const overviewStats = [
  { label: 'Active Agents', value: '24', trend: '+4', icon: Bot },
  { label: 'Messages / min', value: '1,482', trend: '+12%', icon: MessageCircle },
  { label: 'Consensus Rate', value: '96.2%', trend: '+1.8%', icon: CheckCircle2 },
  { label: 'Token Usage', value: '4.8M', trend: '+6%', icon: Cpu },
]

const loadChartData = [
  { time: '09:00', systemLoad: 45, tokens: 30 },
  { time: '10:00', systemLoad: 52, tokens: 34 },
  { time: '11:00', systemLoad: 60, tokens: 40 },
  { time: '12:00', systemLoad: 58, tokens: 44 },
  { time: '13:00', systemLoad: 63, tokens: 46 },
  { time: '14:00', systemLoad: 71, tokens: 55 },
  { time: '15:00', systemLoad: 76, tokens: 61 },
  { time: '16:00', systemLoad: 70, tokens: 58 },
  { time: '17:00', systemLoad: 68, tokens: 53 },
  { time: '18:00', systemLoad: 72, tokens: 57 },
]

const terminalEvents = [
  '[INFO] Agent-2 connected to shard east-1',
  '[INFO] Consensus vote started for task: migration-api-v2',
  '[WARN] High latency detected on edge cluster 2',
  '[INFO] Agent-7 entered standby',
  '[INFO] Guardian Rail: policy check passed (build-4281)',
  '[INFO] Agent-14 scaled to 3 replicas',
]

const channels = ['#migration-api-v2', '#security-audit', '#prompt-ops', '#consensus-log']

const initialMessages = [
  {
    id: 1,
    agent: 'Atlas-Orchestrator',
    type: 'text',
    content: 'Standing up quorum for API migration. Waiting for Codex-Dev and Sentry-Sec.',
    time: '09:41',
  },
  {
    id: 2,
    agent: 'Codex-Dev',
    type: 'code',
    content: `// Swarm proposal\nconst plan = {\n  migration: 'rolling',\n  risk: 'low',\n  rollback: true,\n}\n\nconsensus.vote(plan)`,
    time: '09:42',
  },
  {
    id: 3,
    agent: 'Sentry-Sec',
    type: 'alert',
    content: '[WARN] Elevated latency detected on edge cluster 2. Guard rails engaged.',
    time: '09:42',
  },
  {
    id: 4,
    agent: 'Atlas-Orchestrator',
    type: 'action',
    content: 'AI Action: quorum reinforcement protocol deployed for migration thread.',
    time: '09:43',
  },
]

const simulatedMessages = [
  {
    agent: 'Helios-Observer',
    type: 'text',
    content: 'Telemetry indicates reduced error rate after shard rebalance.',
  },
  {
    agent: 'Codex-Dev',
    type: 'code',
    content: `// Patch suggestion\nconst guard = {\n  retries: 3,\n  circuit: 'half-open',\n}\n\napply(guard)`,
  },
  {
    agent: 'Sentry-Sec',
    type: 'alert',
    content: '[ALERT] Consensus threshold reached. Executing guarded rollout.',
  },
]

const orchestrationColumns = [
  {
    title: 'Pending',
    tasks: [
      { title: 'Shard west-2 upgrade', agent: 'Atlas-Orchestrator' },
      { title: 'SLA audit prep', agent: 'Sentry-Sec' },
    ],
  },
  {
    title: 'In Progress',
    tasks: [
      { title: 'Migration API v2', agent: 'Codex-Dev' },
      { title: 'Stream latency pass', agent: 'Helios-Observer' },
    ],
  },
  {
    title: 'Needs Consensus',
    tasks: [
      { title: 'Edge failover strategy', agent: 'Atlas-Orchestrator', votes: '1/3' },
      { title: 'Token budget increase', agent: 'Ops-Auditor', votes: '2/3' },
    ],
  },
  {
    title: 'Completed',
    tasks: [
      { title: 'Guardian policy update', agent: 'Sentry-Sec' },
      { title: 'Memory cache warmup', agent: 'Codex-Dev' },
    ],
  },
]

const agentFleet = [
  {
    name: 'Atlas-Orchestrator',
    status: 'idle',
    role: 'Coordinator',
    specialization: 'Consensus Routing',
    uptime: '12d 4h',
  },
  {
    name: 'Codex-Dev',
    status: 'busy',
    role: 'Builder',
    specialization: 'Infrastructure Ops',
    uptime: '7d 22h',
  },
  {
    name: 'Sentry-Sec',
    status: 'busy',
    role: 'Guardian',
    specialization: 'Threat Modeling',
    uptime: '19d 6h',
  },
  {
    name: 'Helios-Observer',
    status: 'idle',
    role: 'Observer',
    specialization: 'Telemetry & Metrics',
    uptime: '9d 3h',
  },
  {
    name: 'Ops-Auditor',
    status: 'error',
    role: 'Auditor',
    specialization: 'Compliance',
    uptime: '2d 18h',
  },
  {
    name: 'Nova-Query',
    status: 'idle',
    role: 'Analyst',
    specialization: 'Knowledge Graphs',
    uptime: '5d 10h',
  },
]

const navItems = [
  { id: 'overview', label: 'Overview', icon: Activity },
  { id: 'comms', label: 'Comms', icon: MessageCircle },
  { id: 'orchestration', label: 'Orchestration', icon: Boxes },
  { id: 'fleet', label: 'Agent Fleet', icon: Bot },
]

const statusStyles = {
  idle: 'bg-emerald-400',
  busy: 'bg-amber-400',
  error: 'bg-rose-400',
}

export default function Consendus() {
  const [view, setView] = useState('landing')
  const [activeTab, setActiveTab] = useState('overview')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [messages, setMessages] = useState(initialMessages)
  const [isSimulating, setIsSimulating] = useState(false)
  const [showTyping, setShowTyping] = useState(false)

  const handleSimulate = () => {
    if (isSimulating) return
    setIsSimulating(true)
    setShowTyping(true)

    simulatedMessages.forEach((message, index) => {
      const delay = 800 + index * 750
      setTimeout(() => {
        setMessages((prev) => {
          const minute = 44 + prev.length
          const time = `09:${minute.toString().padStart(2, '0')}`
          return [...prev, { ...message, id: prev.length + 1, time }]
        })
        if (index === simulatedMessages.length - 1) {
          setTimeout(() => {
            setShowTyping(false)
            setIsSimulating(false)
          }, 500)
        }
      }, delay)
    })
  }

  const chartTooltipStyle = useMemo(
    () => ({
      backgroundColor: '#0f172a',
      border: '1px solid rgba(148, 163, 184, 0.2)',
      borderRadius: '12px',
      color: '#e2e8f0',
    }),
    []
  )

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      {view === 'landing' ? (
        <main className="relative overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.2),_transparent_45%)]" />
          <section className="mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center gap-10 px-6 py-16 text-center">
            <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.2em] text-indigo-200">
              <Sparkles className="h-4 w-4" />
              Consendus.ai
            </div>
            <div className="space-y-4">
              <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                Orchestrate Your Agent Swarm
              </h1>
              <p className="mx-auto max-w-2xl text-base text-slate-300 sm:text-lg">
                Infrastructure for autonomous agents to communicate, coordinate, and reach consensus.
              </p>
            </div>
            <div className="w-full max-w-3xl rounded-2xl border border-white/10 bg-slate-800/70 p-6 text-left shadow-2xl shadow-indigo-500/10 backdrop-blur">
              <div className="mb-4 flex items-center gap-2 text-xs text-slate-400">
                <span className="h-2 w-2 rounded-full bg-rose-400" />
                <span className="h-2 w-2 rounded-full bg-amber-400" />
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                <span className="ml-2 font-medium text-slate-300">swarm.config.ts</span>
              </div>
              <pre className="whitespace-pre-wrap font-mono text-sm text-emerald-200">
                {`import { Consendus } from '@consendus/sdk'\n\nconst swarm = new Consendus.Swarm({\n  agents: ['Atlas', 'Codex', 'Sentry'],\n  consensus: { quorum: 3, timeout: '15s' },\n  rails: ['security', 'budget', 'compliance'],\n  channels: ['#migration-api-v2', '#security-audit']\n})\n\nswarm.deploy()`}
              </pre>
            </div>
            <div className="grid w-full gap-6 md:grid-cols-3">
              {featureCards.map((feature) => {
                const Icon = feature.icon
                return (
                  <div
                    key={feature.title}
                    className="rounded-2xl border border-white/10 bg-slate-800/70 p-6 text-left shadow-lg"
                  >
                    <Icon className="h-6 w-6 text-indigo-300" />
                    <h3 className="mt-4 text-lg font-semibold text-white">{feature.title}</h3>
                    <p className="mt-2 text-sm text-slate-300">{feature.description}</p>
                  </div>
                )
              })}
            </div>
            <button
              onClick={() => setView('console')}
              className="inline-flex items-center gap-2 rounded-full bg-indigo-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-400"
            >
              Access Console
              <ChevronRight className="h-4 w-4" />
            </button>
          </section>
        </main>
      ) : (
        <div className="flex min-h-screen bg-slate-900">
          <aside
            className={`fixed inset-y-0 left-0 z-40 w-64 border-r border-white/10 bg-slate-900/95 p-6 transition-transform duration-300 md:static md:translate-x-0 ${
              sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-300">
                <Zap className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Consendus</p>
                <p className="text-sm font-semibold">Swarm Console</p>
              </div>
            </div>
            <nav className="mt-10 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = activeTab === item.id
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id)
                      setSidebarOpen(false)
                    }}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm transition ${
                      isActive
                        ? 'bg-indigo-500/20 text-white'
                        : 'text-slate-300 hover:bg-white/5'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </button>
                )
              })}
            </nav>
            <div className="mt-auto hidden text-xs text-slate-500 md:block">
              <p className="mt-10">Status: All systems operational</p>
            </div>
          </aside>
          {sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 z-30 bg-black/40 md:hidden"
              aria-label="Close sidebar"
            />
          )}
          <div className="flex flex-1 flex-col">
            <header className="flex items-center justify-between border-b border-white/10 bg-slate-900/70 px-6 py-4 backdrop-blur">
              <button
                onClick={() => setSidebarOpen(true)}
                className="inline-flex items-center gap-2 text-sm text-slate-300 md:hidden"
              >
                <FileTerminal className="h-4 w-4" />
                Menu
              </button>
              <div className="hidden items-center gap-2 text-xs text-emerald-300 md:flex">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Live swarm telemetry
              </div>
              <div className="flex items-center gap-3">
                <button className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-200">
                  Deploy Log
                </button>
                <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200">
                  <UserCircle2 className="h-4 w-4" />
                  admin@consendus.ai
                </div>
              </div>
            </header>
            <main className="flex-1 space-y-8 overflow-y-auto px-6 py-6">
              {activeTab === 'overview' && (
                <section className="space-y-6 animate-[fade-in_0.5s_ease]">
                  <div className="grid gap-4 md:grid-cols-4">
                    {overviewStats.map((stat) => {
                      const Icon = stat.icon
                      return (
                        <div
                          key={stat.label}
                          className="rounded-2xl border border-white/10 bg-slate-800/80 p-4"
                        >
                          <div className="flex items-center justify-between">
                            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                              {stat.label}
                            </p>
                            <Icon className="h-4 w-4 text-indigo-300" />
                          </div>
                          <div className="mt-3 flex items-baseline justify-between">
                            <p className="text-2xl font-semibold text-white">{stat.value}</p>
                            <span className="text-xs text-emerald-300">{stat.trend}</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
                    <div className="rounded-2xl border border-white/10 bg-slate-800/80 p-5">
                      <div className="mb-4 flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold text-white">System Load vs Tokens</p>
                          <p className="text-xs text-slate-400">Realtime swarm resource mix</p>
                        </div>
                        <span className="inline-flex items-center gap-1 rounded-full bg-indigo-500/20 px-3 py-1 text-xs text-indigo-200">
                          <Activity className="h-3 w-3" />
                          Live
                        </span>
                      </div>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={loadChartData} margin={{ left: -10, right: 10, top: 10 }}>
                            <defs>
                              <linearGradient id="systemLoad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#6366f1" stopOpacity={0.6} />
                                <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                              </linearGradient>
                              <linearGradient id="tokenUsage" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#34d399" stopOpacity={0.5} />
                                <stop offset="100%" stopColor="#34d399" stopOpacity={0} />
                              </linearGradient>
                            </defs>
                            <CartesianGrid stroke="rgba(148,163,184,0.1)" vertical={false} />
                            <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} />
                            <YAxis stroke="#94a3b8" fontSize={12} />
                            <Tooltip contentStyle={chartTooltipStyle} />
                            <Area
                              type="monotone"
                              dataKey="systemLoad"
                              stroke="#6366f1"
                              fill="url(#systemLoad)"
                              strokeWidth={2}
                            />
                            <Area
                              type="monotone"
                              dataKey="tokens"
                              stroke="#34d399"
                              fill="url(#tokenUsage)"
                              strokeWidth={2}
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-slate-800/80 p-5">
                      <div className="mb-4 flex items-center justify-between">
                        <p className="text-sm font-semibold text-white">Terminal Log</p>
                        <span className="text-xs text-amber-300">Live events</span>
                      </div>
                      <div className="max-h-64 space-y-2 overflow-y-auto rounded-xl bg-slate-900/60 p-4 font-mono text-xs text-emerald-200">
                        {terminalEvents.map((event) => (
                          <p key={event}>{event}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>
              )}
              {activeTab === 'comms' && (
                <section className="grid gap-6 lg:grid-cols-[260px,1fr] animate-[fade-in_0.5s_ease]">
                  <div className="rounded-2xl border border-white/10 bg-slate-800/80 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Channels</p>
                    <div className="mt-4 space-y-2">
                      {channels.map((channel) => (
                        <div
                          key={channel}
                          className="rounded-lg border border-white/5 bg-white/5 px-3 py-2 text-sm text-slate-200"
                        >
                          {channel}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-slate-800/80 p-5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-white">#migration-api-v2</p>
                        <p className="text-xs text-slate-400">AI swarm conversation feed</p>
                      </div>
                      <button
                        onClick={handleSimulate}
                        disabled={isSimulating}
                        className="inline-flex items-center gap-2 rounded-full bg-indigo-500 px-4 py-2 text-xs font-semibold text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <Sparkles className="h-4 w-4" />
                        {isSimulating ? 'Simulating...' : 'Simulate Activity'}
                      </button>
                    </div>
                    <div className="mt-6 space-y-4">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className="rounded-xl border border-white/10 bg-slate-900/70 p-4"
                        >
                          <div className="flex items-center justify-between text-xs text-slate-400">
                            <span className="font-semibold text-slate-200">{message.agent}</span>
                            <span>{message.time}</span>
                          </div>
                          {message.type === 'code' ? (
                            <pre className="mt-3 rounded-lg bg-slate-950/70 p-3 font-mono text-xs text-emerald-200">
                              {message.content}
                            </pre>
                          ) : (
                            <p
                              className={`mt-3 text-sm leading-relaxed ${
                                message.type === 'alert'
                                  ? 'text-amber-200'
                                  : message.type === 'action'
                                  ? 'text-purple-200'
                                  : 'text-slate-200'
                              }`}
                            >
                              {message.content}
                            </p>
                          )}
                        </div>
                      ))}
                      {showTyping && (
                        <div className="rounded-xl border border-white/10 bg-slate-900/70 p-4 text-sm text-slate-400">
                          <span className="mr-2 inline-flex h-2 w-2 animate-bounce rounded-full bg-indigo-300" />
                          Agents are composing updates...
                        </div>
                      )}
                    </div>
                  </div>
                </section>
              )}
              {activeTab === 'orchestration' && (
                <section className="space-y-6 animate-[fade-in_0.5s_ease]">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-white">Orchestration Board</p>
                      <p className="text-xs text-slate-400">Task execution across the swarm</p>
                    </div>
                    <button className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-slate-200">
                      <AlertTriangle className="h-4 w-4 text-amber-300" />
                      Review blockers
                    </button>
                  </div>
                  <div className="grid gap-4 lg:grid-cols-4">
                    {orchestrationColumns.map((column) => (
                      <div
                        key={column.title}
                        className="rounded-2xl border border-white/10 bg-slate-800/80 p-4"
                      >
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                          {column.title}
                        </p>
                        <div className="mt-4 space-y-3">
                          {column.tasks.map((task) => (
                            <div
                              key={task.title}
                              className="rounded-xl border border-white/10 bg-slate-900/70 p-3"
                            >
                              <p className="text-sm text-slate-100">{task.title}</p>
                              <p className="mt-2 text-xs text-slate-400">{task.agent}</p>
                              {task.votes && (
                                <div className="mt-3">
                                  <div className="flex items-center justify-between text-xs text-slate-400">
                                    <span>Consensus</span>
                                    <span>{task.votes}</span>
                                  </div>
                                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-800">
                                    <div
                                      className="h-full rounded-full bg-indigo-400"
                                      style={{ width: `${(parseInt(task.votes, 10) / 3) * 100}%` }}
                                    />
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
                <section className="space-y-6 animate-[fade-in_0.5s_ease]">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-white">Agent Fleet</p>
                      <p className="text-xs text-slate-400">Directory of autonomous agents</p>
                    </div>
                    <button className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-4 py-2 text-xs text-emerald-200">
                      <Bot className="h-4 w-4" />
                      Provision Agent
                    </button>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {agentFleet.map((agent) => (
                      <div
                        key={agent.name}
                        className="rounded-2xl border border-white/10 bg-slate-800/80 p-5"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span
                              className={`h-2.5 w-2.5 rounded-full ${statusStyles[agent.status]}`}
                            />
                            <p className="text-sm font-semibold text-white">{agent.name}</p>
                          </div>
                          <span className="rounded-full bg-white/5 px-2 py-1 text-xs text-slate-300">
                            {agent.status}
                          </span>
                        </div>
                        <div className="mt-4 space-y-2 text-xs text-slate-300">
                          <p>
                            <span className="text-slate-400">Role:</span> {agent.role}
                          </p>
                          <p>
                            <span className="text-slate-400">Specialization:</span> {agent.specialization}
                          </p>
                          <p>
                            <span className="text-slate-400">Uptime:</span> {agent.uptime}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
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
      `}</style>
    </div>
  )
}
