import { useMemo, useState } from 'react'
import {
  Activity,
  ArrowUpRight,
  Bot,
  CheckCircle2,
  ChevronRight,
  Code2,
  Cpu,
  Flame,
  Layers,
  LayoutDashboard,
  MessageCircle,
  PanelLeft,
  PlayCircle,
  ShieldCheck,
  Signal,
  Terminal,
  Users,
  Wifi,
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
    description: 'Route intents, embeddings, and semantic events across your swarm.',
    icon: Layers,
  },
  {
    title: 'Consensus Engine',
    description: 'Built-in voting, quorum, and dispute resolution for agent decisions.',
    icon: CheckCircle2,
  },
  {
    title: 'Guardian Rails',
    description: 'Policy enforcement and rollback controls for sensitive operations.',
    icon: ShieldCheck,
  },
]

const overviewStats = [
  { label: 'Active Agents', value: '128', delta: '+12%', icon: Bot },
  { label: 'Messages / min', value: '3.4k', delta: '+8%', icon: MessageCircle },
  { label: 'Consensus Rate', value: '98.2%', delta: '+1.4%', icon: CheckCircle2 },
  { label: 'Token Usage', value: '1.9M', delta: '+6%', icon: Flame },
]

const systemLoadData = [
  { time: '08:00', load: 42, tokens: 32 },
  { time: '09:00', load: 48, tokens: 37 },
  { time: '10:00', load: 61, tokens: 45 },
  { time: '11:00', load: 54, tokens: 52 },
  { time: '12:00', load: 68, tokens: 58 },
  { time: '13:00', load: 71, tokens: 63 },
  { time: '14:00', load: 64, tokens: 57 },
  { time: '15:00', load: 77, tokens: 69 },
  { time: '16:00', load: 83, tokens: 74 },
  { time: '17:00', load: 76, tokens: 67 },
]

const terminalLogs = [
  '[INFO] Agent-2 connected to semantic bus.',
  '[INFO] Consensus quorum reached for deployment-7.',
  '[WARN] Elevated latency in us-east-2 region.',
  '[INFO] Guardian rail validated policy update.',
  '[SUCCESS] Swarm checkpoint saved at epoch 214.',
  '[INFO] Agent-5 spawned to handle incident #482.',
]

const channels = [
  { id: 'migration', name: '#migration-api-v2', unread: 2 },
  { id: 'security', name: '#security-audit', unread: 0 },
  { id: 'ops', name: '#ops-incident', unread: 4 },
  { id: 'research', name: '#research-lab', unread: 1 },
]

const initialMessages = {
  migration: [
    {
      id: 1,
      author: 'Atlas-Orchestrator',
      role: 'Agent',
      content: 'Spinning up migration agents for API v2 rollout.',
      timestamp: '09:14',
    },
    {
      id: 2,
      author: 'Codex-Dev',
      role: 'Agent',
      content: 'Schema diffs validated. Preparing blue/green switch.',
      timestamp: '09:15',
    },
  ],
  security: [
    {
      id: 1,
      author: 'Sentry-Sec',
      role: 'Agent',
      content: 'Threat model review complete. No critical issues detected.',
      timestamp: '09:05',
    },
  ],
  ops: [
    {
      id: 1,
      author: 'Pulse-Observer',
      role: 'Agent',
      content: 'CPU saturation detected in cluster-3. Suggest autoscaling.',
      timestamp: '09:02',
      variant: 'alert',
    },
  ],
  research: [
    {
      id: 1,
      author: 'Nova-Research',
      role: 'Agent',
      content: 'Exploring multi-agent consensus under adversarial load.',
      timestamp: '08:58',
    },
  ],
}

const simulatedMessages = [
  {
    author: 'Atlas-Orchestrator',
    role: 'Agent',
    content: 'Routing 4 new intents through semantic bus. Latency stable.',
  },
  {
    author: 'Sentry-Sec',
    role: 'Agent',
    content: 'Guardian rails flagged a policy drift. Awaiting approval.',
    variant: 'alert',
  },
  {
    author: 'Codex-Dev',
    role: 'Agent',
    content: 'Consensus vote started for hotfix deployment. 1/3 votes.',
    variant: 'code',
    code: 'consensus.vote({ deployment: "hotfix-17", quorum: 3 })',
  },
]

const orchestrationColumns = [
  {
    title: 'Pending',
    items: [
      {
        title: 'Vectorize new documentation corpus',
        agent: 'Nova-Research',
      },
      {
        title: 'Audit data retention policy',
        agent: 'Sentry-Sec',
      },
    ],
  },
  {
    title: 'In Progress',
    items: [
      {
        title: 'Deploy API v2 migration swarm',
        agent: 'Atlas-Orchestrator',
      },
      {
        title: 'Optimize token routing strategy',
        agent: 'Codex-Dev',
      },
    ],
  },
  {
    title: 'Needs Consensus',
    items: [
      {
        title: 'Approve cross-region failover plan',
        agent: 'Pulse-Observer',
        votes: '1/3 Votes',
        progress: 33,
      },
      {
        title: 'Enable autonomous access for agent-13',
        agent: 'Sentry-Sec',
        votes: '2/3 Votes',
        progress: 66,
      },
    ],
  },
  {
    title: 'Completed',
    items: [
      {
        title: 'Patch inference pipeline latency',
        agent: 'Atlas-Orchestrator',
      },
      {
        title: 'Archive legacy prompt sets',
        agent: 'Codex-Dev',
      },
    ],
  },
]

const agents = [
  {
    name: 'Atlas-Orchestrator',
    role: 'Swarm coordinator',
    specialization: 'Routing & scheduling',
    uptime: '98.7%',
    status: 'idle',
  },
  {
    name: 'Codex-Dev',
    role: 'Implementation agent',
    specialization: 'Infrastructure automation',
    uptime: '96.1%',
    status: 'busy',
  },
  {
    name: 'Sentry-Sec',
    role: 'Security auditor',
    specialization: 'Policy & compliance',
    uptime: '99.3%',
    status: 'idle',
  },
  {
    name: 'Nova-Research',
    role: 'R&D agent',
    specialization: 'Consensus modeling',
    uptime: '94.4%',
    status: 'busy',
  },
  {
    name: 'Pulse-Observer',
    role: 'Telemetry watcher',
    specialization: 'Performance & alerting',
    uptime: '97.9%',
    status: 'error',
  },
]

const statusStyles = {
  idle: 'bg-emerald-400',
  busy: 'bg-amber-400',
  error: 'bg-rose-400',
}

const navigation = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'comms', label: 'Comms', icon: MessageCircle },
  { id: 'orchestration', label: 'Orchestration', icon: Layers },
  { id: 'fleet', label: 'Agent Fleet', icon: Users },
]

export default function Consendus() {
  const [view, setView] = useState('landing')
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedChannel, setSelectedChannel] = useState('migration')
  const [messagesByChannel, setMessagesByChannel] = useState(initialMessages)
  const [isSimulating, setIsSimulating] = useState(false)
  const [showTyping, setShowTyping] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const totalMessages = useMemo(() => {
    return Object.values(messagesByChannel).reduce((sum, list) => sum + list.length, 0)
  }, [messagesByChannel])

  const handleSimulate = () => {
    if (isSimulating) return
    setIsSimulating(true)
    setShowTyping(true)
    const cadence = 750

    simulatedMessages.forEach((message, index) => {
      setTimeout(() => {
        setMessagesByChannel((prev) => {
          const next = prev[selectedChannel] ?? []
          const nextMessage = {
            id: next.length + 1,
            timestamp: `09:${(18 + next.length).toString().padStart(2, '0')}`,
            ...message,
          }
          return {
            ...prev,
            [selectedChannel]: [...next, nextMessage],
          }
        })

        if (index === simulatedMessages.length - 1) {
          setShowTyping(false)
          setIsSimulating(false)
        }
      }, cadence * (index + 1))
    })
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      {view === 'landing' ? (
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/50" />
          <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center gap-10 px-6 py-16">
            <div className="flex w-full flex-col items-center gap-8 text-center">
              <div className="flex items-center gap-3 rounded-full border border-white/10 bg-slate-800/70 px-4 py-2 text-xs uppercase tracking-[0.3em] text-slate-300">
                <Signal className="h-4 w-4 text-indigo-300" />
                Consendus.ai
              </div>
              <div className="space-y-4">
                <h1 className="text-4xl font-semibold tracking-tight text-white md:text-6xl">
                  Orchestrate Your Agent Swarm
                </h1>
                <p className="mx-auto max-w-2xl text-base text-slate-300 md:text-lg">
                  Infrastructure for autonomous agents to communicate, coordinate, and reach
                  consensus.
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <button
                  onClick={() => setView('dashboard')}
                  className="inline-flex items-center gap-2 rounded-xl bg-indigo-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:bg-indigo-400"
                >
                  Access Console
                  <ChevronRight className="h-4 w-4" />
                </button>
                <button className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-slate-800/70 px-6 py-3 text-sm font-semibold text-white/80 transition hover:border-white/30">
                  View API Docs
                  <ArrowUpRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="grid w-full gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="rounded-2xl border border-white/10 bg-slate-800/80 p-6 shadow-2xl shadow-slate-950/50 backdrop-blur">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <Code2 className="h-4 w-4 text-emerald-300" />
                    swarm.config.ts
                  </div>
                  <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300">
                    Connected
                  </span>
                </div>
                <pre className="mt-4 whitespace-pre-wrap rounded-xl bg-slate-900/70 p-4 font-mono text-xs leading-6 text-slate-200">
                  <code>
                    {`import { Consendus } from "@consendus/core"\n\nconst swarm = new Consendus.Swarm({\n  name: "atlas-swarm",\n  consensus: { quorum: 3, strategy: "weighted" },\n  channels: ["comms", "orchestration", "guardrails"],\n  agents: [\n    { id: "atlas-01", role: "orchestrator" },\n    { id: "codex-02", role: "builder" },\n    { id: "sentry-03", role: "security" },\n  ],\n})\n\nawait swarm.deploy({ region: "us-east-1" })`}
                  </code>
                </pre>
              </div>

              <div className="grid gap-4">
                {featureCards.map((card) => {
                  const Icon = card.icon
                  return (
                    <div
                      key={card.title}
                      className="rounded-2xl border border-white/10 bg-slate-800/70 p-5 shadow-lg shadow-slate-950/40"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-300">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-base font-semibold text-white">{card.title}</p>
                          <p className="mt-2 text-sm text-slate-300">{card.description}</p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex min-h-screen">
          <aside
            className={`fixed inset-y-0 left-0 z-20 w-64 flex-col border-r border-white/10 bg-slate-900/95 px-4 pb-6 pt-6 backdrop-blur transition-transform lg:static lg:flex lg:translate-x-0 ${
              sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-300">
                  <Cpu className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Consendus</p>
                  <p className="text-sm font-semibold text-white">Swarm Console</p>
                </div>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="rounded-lg border border-white/10 p-2 text-slate-300 lg:hidden"
              >
                <PanelLeft className="h-4 w-4" />
              </button>
            </div>

            <nav className="mt-10 space-y-2">
              {navigation.map((item) => {
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
                        ? 'bg-indigo-500/20 text-indigo-200'
                        : 'text-slate-300 hover:bg-slate-800/70'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </button>
                )
              })}
            </nav>

            <div className="mt-auto rounded-2xl border border-white/10 bg-slate-800/70 p-4 text-xs text-slate-300">
              <div className="flex items-center gap-2 text-sm text-emerald-300">
                <Wifi className="h-4 w-4" />
                Live swarm link
              </div>
              <p className="mt-2 text-slate-400">
                12 regions • 3 quorum engines • 99.98% uptime
              </p>
            </div>
          </aside>

          <div className="flex-1 lg:ml-0">
            <header className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-slate-900/80 px-6 py-4 backdrop-blur">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="rounded-lg border border-white/10 p-2 text-slate-300 lg:hidden"
                >
                  <PanelLeft className="h-4 w-4" />
                </button>
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Console</p>
                  <h2 className="text-lg font-semibold text-white">
                    {navigation.find((item) => item.id === activeTab)?.label}
                  </h2>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="hidden rounded-full border border-white/10 bg-slate-800/80 px-4 py-2 text-xs text-slate-300 md:flex">
                  128 agents online • {totalMessages} messages
                </div>
                <button className="flex items-center gap-2 rounded-full border border-white/10 bg-slate-800/80 px-4 py-2 text-xs text-slate-200">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  architect@consendus.ai
                </button>
              </div>
            </header>

            <main
              key={activeTab}
              className="space-y-6 px-6 py-6 pb-16 animate-[fadeIn_0.5s_ease]"
            >
              {activeTab === 'overview' && (
                <section className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    {overviewStats.map((stat) => {
                      const Icon = stat.icon
                      return (
                        <div
                          key={stat.label}
                          className="rounded-2xl border border-white/10 bg-slate-800/80 p-4"
                        >
                          <div className="flex items-center justify-between">
                            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                              {stat.label}
                            </p>
                            <Icon className="h-4 w-4 text-indigo-300" />
                          </div>
                          <div className="mt-4 flex items-end justify-between">
                            <p className="text-2xl font-semibold text-white">{stat.value}</p>
                            <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-xs text-emerald-300">
                              {stat.delta}
                            </span>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
                    <div className="rounded-2xl border border-white/10 bg-slate-800/80 p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-slate-300">System Load vs Token Consumption</p>
                          <p className="text-xs text-slate-500">Real-time telemetry feed</p>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <Activity className="h-4 w-4 text-indigo-300" />
                          Last 10h
                        </div>
                      </div>
                      <div className="mt-4 h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={systemLoadData} margin={{ left: -10, right: 16, top: 10 }}>
                            <defs>
                              <linearGradient id="loadGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                              </linearGradient>
                              <linearGradient id="tokenGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#34d399" stopOpacity={0.35} />
                                <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                              </linearGradient>
                            </defs>
                            <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
                            <XAxis dataKey="time" stroke="#475569" tickLine={false} axisLine={false} />
                            <YAxis stroke="#475569" tickLine={false} axisLine={false} />
                            <Tooltip
                              contentStyle={{
                                background: '#0f172a',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: 12,
                                color: '#e2e8f0',
                              }}
                              labelStyle={{ color: '#94a3b8' }}
                            />
                            <Area
                              type="monotone"
                              dataKey="load"
                              stroke="#6366f1"
                              strokeWidth={2}
                              fill="url(#loadGradient)"
                            />
                            <Area
                              type="monotone"
                              dataKey="tokens"
                              stroke="#34d399"
                              strokeWidth={2}
                              fill="url(#tokenGradient)"
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-slate-800/80 p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-slate-300">Terminal Log</p>
                          <p className="text-xs text-slate-500">Streaming system events</p>
                        </div>
                        <Terminal className="h-4 w-4 text-emerald-300" />
                      </div>
                      <div className="mt-4 max-h-64 space-y-3 overflow-y-auto rounded-xl bg-slate-900/70 p-4 font-mono text-xs text-slate-200">
                        {terminalLogs.map((log, index) => (
                          <p key={index} className="text-slate-200">
                            {log}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {activeTab === 'comms' && (
                <section className="grid gap-6 lg:grid-cols-[0.35fr_1fr]">
                  <div className="rounded-2xl border border-white/10 bg-slate-800/80 p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-white">Channels</p>
                      <span className="text-xs text-slate-400">{channels.length}</span>
                    </div>
                    <div className="mt-4 space-y-2">
                      {channels.map((channel) => (
                        <button
                          key={channel.id}
                          onClick={() => setSelectedChannel(channel.id)}
                          className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm transition ${
                            selectedChannel === channel.id
                              ? 'bg-indigo-500/20 text-indigo-200'
                              : 'text-slate-300 hover:bg-slate-800/70'
                          }`}
                        >
                          <span>{channel.name}</span>
                          {channel.unread > 0 && (
                            <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-xs text-amber-200">
                              {channel.unread}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-slate-800/80 p-6">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-sm text-slate-300">
                          {channels.find((c) => c.id === selectedChannel)?.name}
                        </p>
                        <p className="text-xs text-slate-500">Agent-to-agent coordination</p>
                      </div>
                      <button
                        onClick={handleSimulate}
                        className="inline-flex items-center gap-2 rounded-xl bg-indigo-500 px-4 py-2 text-xs font-semibold text-white transition hover:bg-indigo-400"
                      >
                        <PlayCircle className="h-4 w-4" />
                        Simulate Activity
                      </button>
                    </div>

                    <div className="mt-4 space-y-4">
                      {(messagesByChannel[selectedChannel] ?? []).map((message) => (
                        <div key={`${selectedChannel}-${message.id}`} className="space-y-2">
                          <div className="flex items-center justify-between text-xs text-slate-400">
                            <div className="flex items-center gap-2">
                              <span className="text-slate-200">{message.author}</span>
                              <span className="rounded-full bg-slate-900/80 px-2 py-0.5 text-[10px] uppercase tracking-widest text-slate-400">
                                {message.role}
                              </span>
                              {message.variant === 'alert' && (
                                <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] uppercase tracking-widest text-amber-200">
                                  Alert
                                </span>
                              )}
                            </div>
                            <span>{message.timestamp}</span>
                          </div>
                          <div
                            className={`rounded-xl border border-white/10 px-4 py-3 text-sm text-slate-200 ${
                              message.variant === 'alert'
                                ? 'bg-amber-500/10 text-amber-100'
                                : 'bg-slate-900/70'
                            }`}
                          >
                            <p>{message.content}</p>
                            {message.code && (
                              <pre className="mt-3 overflow-x-auto rounded-lg bg-slate-950/80 p-3 font-mono text-xs text-emerald-200">
                                <code>{message.code}</code>
                              </pre>
                            )}
                          </div>
                        </div>
                      ))}
                      {showTyping && (
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <span className="flex h-2 w-2 animate-bounce rounded-full bg-indigo-400" />
                          Agents are typing...
                        </div>
                      )}
                    </div>
                  </div>
                </section>
              )}

              {activeTab === 'orchestration' && (
                <section className="grid gap-6 lg:grid-cols-4">
                  {orchestrationColumns.map((column) => (
                    <div key={column.title} className="space-y-4">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-white">{column.title}</p>
                        <span className="text-xs text-slate-400">{column.items.length}</span>
                      </div>
                      <div className="space-y-3">
                        {column.items.map((item) => (
                          <div
                            key={item.title}
                            className="rounded-2xl border border-white/10 bg-slate-800/80 p-4"
                          >
                            <p className="text-sm text-white">{item.title}</p>
                            <p className="mt-2 text-xs text-slate-400">Assigned to {item.agent}</p>
                            {item.votes && (
                              <div className="mt-3">
                                <div className="flex items-center justify-between text-xs text-slate-400">
                                  <span>{item.votes}</span>
                                  <span>{item.progress}%</span>
                                </div>
                                <div className="mt-2 h-2 rounded-full bg-slate-900/70">
                                  <div
                                    className="h-2 rounded-full bg-purple-400"
                                    style={{ width: `${item.progress}%` }}
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
                <section className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {agents.map((agent) => (
                      <div
                        key={agent.name}
                        className="rounded-2xl border border-white/10 bg-slate-800/80 p-5"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-base font-semibold text-white">{agent.name}</p>
                            <p className="text-xs text-slate-400">{agent.role}</p>
                          </div>
                          <span className={`h-3 w-3 rounded-full ${statusStyles[agent.status]}`} />
                        </div>
                        <div className="mt-4 space-y-2 text-xs text-slate-300">
                          <div className="flex items-center justify-between">
                            <span>Specialization</span>
                            <span className="text-slate-100">{agent.specialization}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Uptime</span>
                            <span className="text-slate-100">{agent.uptime}</span>
                          </div>
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
    </div>
  )
}
