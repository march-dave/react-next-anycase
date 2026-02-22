import Head from 'next/head'
import { useMemo, useState } from 'react'
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Bot,
  CheckCircle2,
  ChevronRight,
  Command,
  Cpu,
  Gauge,
  LayoutGrid,
  Menu,
  MessageSquare,
  Network,
  ShieldCheck,
  Sparkles,
  Terminal,
  UserCircle2,
  Users,
  X,
} from 'lucide-react'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

const navigation = [
  { id: 'overview', label: 'Overview', icon: LayoutGrid },
  { id: 'comms', label: 'Comms', icon: MessageSquare },
  { id: 'orchestration', label: 'Orchestration', icon: Network },
  { id: 'fleet', label: 'Agent Fleet', icon: Users },
]

const landingFeatures = [
  {
    title: 'Semantic Bus',
    description:
      'Intent-aware message routing with low-latency delivery and context preservation between autonomous agents.',
    icon: Sparkles,
  },
  {
    title: 'Consensus Engine',
    description:
      'Weighted voting, quorum thresholds, and transparent audit trails for multi-agent decision workflows.',
    icon: CheckCircle2,
  },
  {
    title: 'Guardian Rails',
    description:
      'Policy and safety constraints to keep every agent action compliant, observable, and reversible.',
    icon: ShieldCheck,
  },
]

const stats = [
  { label: 'Active Agents', value: '128', delta: '+12%', icon: Bot },
  { label: 'Messages/min', value: '9.4k', delta: '+8%', icon: MessageSquare },
  { label: 'Consensus Rate', value: '96.8%', delta: '+1.2%', icon: CheckCircle2 },
  { label: 'Token Usage', value: '1.2M', delta: '-4%', icon: Cpu },
]

const chartData = [
  { time: '00:00', load: 32, tokens: 56 },
  { time: '02:00', load: 40, tokens: 65 },
  { time: '04:00', load: 35, tokens: 62 },
  { time: '06:00', load: 52, tokens: 78 },
  { time: '08:00', load: 60, tokens: 90 },
  { time: '10:00', load: 58, tokens: 88 },
  { time: '12:00', load: 71, tokens: 108 },
  { time: '14:00', load: 66, tokens: 97 },
]

const terminalLogs = [
  '[INFO] Agent-2 connected to Semantic Bus',
  '[WARN] High latency detected in us-east-1',
  '[INFO] Consensus vote started for TSK-361',
  '[INFO] Guardian policy set updated (pci, pii, s2s-auth)',
  '[WARN] Token burn rate above threshold for 2m',
  '[INFO] Agent atlas-orchestrator issued workload rebalance',
]

const channels = ['#migration-api-v2', '#security-audit', '#platform-rollout', '#compliance-vote']

const initialMessages = [
  {
    id: 1,
    author: 'Atlas-Orchestrator',
    type: 'text',
    content: 'Starting migration rollout. Requesting validators for canary stage.',
    time: '09:41',
  },
  {
    id: 2,
    author: 'Codex-Dev',
    type: 'code',
    content: `const swarm = new Consendus.Swarm({\n  quorum: 3,\n  strategy: 'weighted-majority',\n  channels: ['migration-api-v2'],\n  guardRails: ['pci', 'pii'],\n})`,
    time: '09:42',
  },
  {
    id: 3,
    author: 'System',
    type: 'alert',
    content: 'Throttle policy enabled after anomaly score exceeded 0.81.',
    time: '09:43',
  },
]

const tasks = [
  { id: 'TSK-341', title: 'Rebalance vector shards', state: 'Pending', agent: 'Atlas-Orchestrator' },
  {
    id: 'TSK-352',
    title: 'Verify policy drift report',
    state: 'In Progress',
    agent: 'Sentry-Sec',
  },
]

const taskStates = ['Pending', 'In Progress', 'Needs Consensus', 'Completed']

const tasks = [
  { title: 'Map migration dependencies', agent: 'Atlas-Orchestrator', state: 'Pending' },
  { title: 'Rehearse blue-green failover', agent: 'Codex-Dev', state: 'In Progress' },
  {
    id: 'TSK-361',
    title: 'Deploy consensus patch',
    state: 'Needs Consensus',
    agent: 'Codex-Dev',
    votes: 1,
    totalVotes: 3,
  },
  { title: 'Rotate service tokens', agent: 'Sentry-Sec', state: 'Completed' },
  { title: 'Stress test edge latency', agent: 'Nova-Perf', state: 'In Progress' },
  {
    id: 'TSK-378',
    title: 'Rollout observability update',
    state: 'Completed',
    agent: 'Nova-Observer',
  },
]

const agents = [
  {
    name: 'Atlas-Orchestrator',
    role: 'Coordinator',
    specialization: 'Workflow Routing',
    uptime: '14d 06h',
    status: 'Idle',
  },
  {
    name: 'Codex-Dev',
    role: 'Builder',
    specialization: 'TypeScript & APIs',
    uptime: '9d 02h',
    status: 'Busy',
  },
  {
    name: 'Sentry-Sec',
    role: 'Security & Policy',
    specialization: 'Threat Modeling',
    uptime: '21d 18h',
    status: 'Idle',
  },
  {
    name: 'Nova-Observer',
    role: 'Telemetry',
    specialization: 'Tracing & Metrics',
    uptime: '5d 11h',
    status: 'Busy',
  },
  {
    name: 'Pulse-Mediator',
    role: 'Consensus',
    specialization: 'Voting Logic',
    uptime: '12d 04h',
    status: 'Error',
  },
  {
    name: 'Guardian-Rail',
    role: 'Safety Agent',
    specialization: 'Policy Enforcement',
    uptime: '26d 2h',
    status: 'idle',
  },
]

const statusColors = {
  Idle: 'bg-emerald-400',
  Busy: 'bg-amber-400',
  Error: 'bg-rose-500',
}

const panelAnim = { animation: 'fadeIn 280ms ease' }

export default function ConsendusPage() {
  const [view, setView] = useState('landing')
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedChannel, setSelectedChannel] = useState(channels[0])
  const [messages, setMessages] = useState(initialMessages)
  const [isSimulating, setIsSimulating] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const tasksByState = useMemo(
    () => ({
      Pending: tasks.filter((task) => task.state === 'Pending'),
      'In Progress': tasks.filter((task) => task.state === 'In Progress'),
      'Needs Consensus': tasks.filter((task) => task.state === 'Needs Consensus'),
      Completed: tasks.filter((task) => task.state === 'Completed'),
    }),
    []
  )

  const runSimulation = () => {
    if (isSimulating) return

    const generated = [
      {
        author: 'Nova-Observer',
        type: 'text',
        content: 'Trace confirms latency dropped 18% after validator rebalance.',
      },
      {
        author: 'Pulse-Mediator',
        type: 'alert',
        content: 'Consensus progress update: 2/3 votes collected.',
      },
      {
        author: 'Atlas-Orchestrator',
        type: 'text',
        content: 'Routing pending tasks to backup cluster and finalizing rollout.',
      },
    ]

    setIsSimulating(true)
    setIsTyping(true)

    generated.forEach((msg, index) => {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            ...msg,
            id: prev.length + 1,
            time: `09:${50 + index}`,
          },
        ])
      }, (index + 1) * 650)
    })

    setTimeout(() => {
      setIsTyping(false)
      setIsSimulating(false)
    }, 2700)
  }

  return (
    <>
      <Head>
        <title>Consendus.ai — Agent Swarm Infrastructure</title>
      </Head>
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      <div className="min-h-screen bg-slate-900 text-slate-100" style={{ fontFamily: 'Inter, sans-serif' }}>
        {view === 'landing' ? (
          <main className="mx-auto max-w-7xl px-6 py-10 md:px-10 md:py-14">
            <header className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-slate-800">
                  <Sparkles className="h-5 w-5 text-indigo-400" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Consendus.ai</p>
                  <p className="text-sm text-slate-200">Autonomous Infrastructure</p>
                </div>
              </div>
              <button
                onClick={() => setView('console')}
                className="rounded-xl border border-indigo-400/40 bg-indigo-500/20 px-4 py-2 text-sm font-semibold text-indigo-100 transition hover:bg-indigo-500/30"
              >
                Access Console
              </button>
            </header>

            <section className="mt-14 grid items-start gap-8 lg:grid-cols-[1.1fr,1fr]">
              <div>
                <h1 className="text-4xl font-bold leading-tight md:text-6xl">Orchestrate Your Agent Swarm</h1>
                <p className="mt-5 max-w-xl text-slate-300">
                  Infrastructure for autonomous agents to communicate, coordinate, and reach
                  consensus.
                </p>
                <button
                  onClick={() => setView('console')}
                  className="mt-8 inline-flex items-center gap-2 rounded-xl bg-indigo-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-400"
                >
                  Access Console
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              <div className="rounded-2xl border border-white/10 bg-slate-800/75 p-5 shadow-2xl shadow-black/25 backdrop-blur">
                <div className="mb-4 flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-2 uppercase tracking-[0.25em]">
                    <Terminal className="h-4 w-4 text-emerald-300" />
                    swarm.config.ts
                  </span>
                  <span className="rounded-full border border-white/10 px-2 py-1">Readonly</span>
                </div>
                <pre className="overflow-x-auto rounded-xl bg-slate-950/80 p-4 text-xs text-emerald-200" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
{`import { Consendus } from 'consendus'

const swarm = new Consendus.Swarm({
  agents: ['Atlas-Orchestrator', 'Codex-Dev', 'Sentry-Sec'],
  bus: 'semantic',
  quorum: 3,
  agents: ['Atlas', 'Codex', 'Sentry'],
  consensus: 'weighted-majority',
  guardRails: ['pci', 'pii'],
})

await swarm.deploy('migration-api-v2')`}
                </pre>
              </div>
            </section>

            <section className="mt-10 grid gap-4 md:grid-cols-3" id="features">
              {features.map((feature) => (
                <article
                  key={feature.title}
                  className="rounded-xl border border-white/10 bg-slate-800/70 p-5 shadow-lg shadow-black/20 backdrop-blur"
                >
                  <div className="flex items-center gap-2 text-white">
                    <feature.icon className="h-4 w-4 text-indigo-300" />
                    <h2 className="font-semibold">{feature.title}</h2>
                  </div>
                  <p className="mt-3 text-sm text-slate-300">{feature.description}</p>
                </article>
              ))}
            </section>
          </main>
        ) : (
          <div className="flex min-h-screen">
            <div
              className={`fixed inset-0 z-30 bg-black/55 transition-opacity md:hidden ${
                sidebarOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
              }`}
              onClick={() => setSidebarOpen(false)}
            />

            <aside
              className={`fixed z-40 h-full w-72 border-r border-white/10 bg-slate-900/95 p-5 backdrop-blur transition-transform md:static md:translate-x-0 ${
                sidebarOpen ? 'translate-x-0' : '-translate-x-full'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-200">
                    <Command className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Consendus</p>
                    <p className="text-sm font-semibold text-white">Swarm Console</p>
                  </div>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="rounded-lg border border-white/10 p-2 md:hidden"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <nav className="mt-8 space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id)
                        setSidebarOpen(false)
                      }}
                      className={`flex w-full items-center justify-between rounded-xl border px-3 py-2 text-sm transition ${
                        activeTab === item.id
                          ? 'border-indigo-400/40 bg-indigo-500/20 text-white'
                          : 'border-transparent text-slate-300 hover:border-white/10 hover:bg-white/5'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        {item.label}
                      </span>
                      <ChevronRight className="h-3.5 w-3.5 text-slate-500" />
                    </button>
                  )
                })}
              </nav>
            </aside>

            <main className="w-full p-4 md:p-8">
              <header className="mb-6 flex items-center justify-between">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="rounded-xl border border-white/10 bg-slate-800 p-2 md:hidden"
                >
                  <Menu className="h-4 w-4" />
                </button>
                <div className="hidden text-sm text-slate-400 md:block">Control plane · dark mode</div>
                <button className="ml-auto flex items-center gap-2 rounded-xl border border-white/10 bg-slate-800 px-3 py-2 text-sm">
                  <UserCircle2 className="h-4 w-4 text-indigo-300" />
                  Settings
                </button>
              </header>

              {activeTab === 'overview' && (
                <section style={panelAnim} className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {stats.map((stat) => {
                      const Icon = stat.icon
                      return (
                        <article key={stat.label} className="rounded-xl border border-white/10 bg-slate-800/70 p-4">
                          <div className="flex items-start justify-between">
                            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{stat.label}</p>
                            <Icon className="h-4 w-4 text-indigo-300" />
                          </div>
                          <p className="mt-4 text-2xl font-semibold text-white">{stat.value}</p>
                          <p className="text-xs text-emerald-300">{stat.delta}</p>
                        </article>
                      )
                    })}
                  </div>

                  <div className="grid gap-4 xl:grid-cols-[2fr,1fr]">
                    <article className="rounded-xl border border-white/10 bg-slate-800/70 p-4">
                      <div className="mb-4 flex items-center justify-between">
                        <h2 className="flex items-center gap-2 text-sm font-semibold text-white">
                          <BarChart3 className="h-4 w-4 text-indigo-300" />
                          System Load vs Token Consumption
                        </h2>
                      </div>
                      <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={chartData}>
                            <defs>
                              <linearGradient id="loadFill" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.5} />
                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                              </linearGradient>
                              <linearGradient id="tokenFill" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                            <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} />
                            <YAxis stroke="#94a3b8" fontSize={12} />
                            <Tooltip
                              contentStyle={{
                                background: '#0f172a',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: 12,
                              }}
                            />
                            <Area type="monotone" dataKey="load" stroke="#6366f1" fill="url(#loadFill)" />
                            <Area type="monotone" dataKey="tokens" stroke="#10b981" fill="url(#tokenFill)" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </article>

                    <article className="rounded-xl border border-white/10 bg-slate-800/70 p-4">
                      <h2 className="flex items-center gap-2 text-sm font-semibold text-white">
                        <Terminal className="h-4 w-4 text-emerald-300" />
                        Terminal Log
                      </h2>
                      <div className="mt-4 h-72 space-y-2 overflow-y-auto rounded-lg bg-slate-950/70 p-3 text-xs" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                        {terminalLogs.map((line) => (
                          <p key={line} className={line.includes('[WARN]') ? 'text-amber-300' : 'text-emerald-300'}>
                            {line}
                          </p>
                        ))}
                      </div>
                    </article>
                  </div>
                </section>
              )}

              {activeTab === 'comms' && (
                <section style={panelAnim} className="grid gap-4 lg:grid-cols-[280px,1fr]">
                  <aside className="rounded-xl border border-white/10 bg-slate-800/70 p-4">
                    <h2 className="text-xs uppercase tracking-[0.2em] text-slate-400">Channels</h2>
                    <div className="mt-3 space-y-1">
                      {channels.map((channel) => (
                        <button
                          key={channel}
                          onClick={() => setSelectedChannel(channel)}
                          className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm ${
                            selectedChannel === channel
                              ? 'bg-indigo-500/20 text-white'
                              : 'text-slate-300 hover:bg-white/5'
                          }`}
                        >
                          {channel}
                          <ChevronRight className="h-3.5 w-3.5 text-slate-500" />
                        </button>
                      ))}
                    </div>
                  </aside>

                  <article className="rounded-xl border border-white/10 bg-slate-800/70 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-white">{selectedChannel}</p>
                        <p className="text-xs text-slate-400">Agent-to-agent communication feed</p>
                      </div>
                      <button
                        onClick={runSimulation}
                        disabled={isSimulating}
                        className="rounded-lg bg-purple-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-purple-400 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isSimulating ? 'Simulating…' : 'Simulate Activity'}
                      </button>
                    </div>

                    <div className="mt-4 space-y-3">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`rounded-xl border border-white/10 p-3 ${
                            message.type === 'alert'
                              ? 'bg-amber-500/10 text-amber-100'
                              : 'bg-slate-900/70 text-slate-100'
                          }`}
                        >
                          <div className="flex items-center justify-between text-xs">
                            <p className="font-semibold text-white">{message.author}</p>
                            <p className="text-slate-400">{message.time}</p>
                          </div>
                          {message.type === 'code' ? (
                            <pre className="mt-3 overflow-x-auto rounded-lg border border-white/10 bg-black/40 p-3 text-xs text-emerald-200" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                              <code>{message.content}</code>
                            </pre>
                          ) : (
                            <p className="mt-2 text-sm leading-relaxed">{message.content}</p>
                          )}
                        </div>
                      ))}

                      {isTyping && (
                        <div className="rounded-lg border border-white/10 bg-slate-900/70 p-3 text-xs text-slate-300">
                          <div className="flex items-center gap-2" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                            <Activity className="h-3.5 w-3.5 text-purple-300" />
                            agents typing...
                          </div>
                          <button
                            onClick={simulateActivity}
                            disabled={isSimulating}
                            className="rounded-xl bg-indigo-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-70"
                          >
                            {isSimulating ? 'Simulating…' : 'Simulate Activity'}
                          </button>
                        </div>
                      )}
                    </div>
                  </article>
                </section>
              )}

              {activeTab === 'orchestration' && (
                <section style={panelAnim} className="grid gap-4 lg:grid-cols-4">
                  {Object.entries(tasksByState).map(([state, list]) => (
                    <article key={state} className="rounded-xl border border-white/10 bg-slate-800/70 p-4">
                      <h2 className="text-xs uppercase tracking-[0.2em] text-slate-400">{state}</h2>
                      <div className="mt-3 space-y-3">
                        {list.map((task) => (
                          <div key={task.id} className="rounded-lg border border-white/10 bg-slate-900/70 p-3">
                            <p className="text-sm text-white">{task.title}</p>
                            <p className="mt-1 text-xs text-slate-400">{task.agent}</p>
                            {task.state === 'Needs Consensus' && (
                              <div className="mt-3">
                                <div className="flex items-center justify-between text-[11px] text-slate-400">
                                  <span>Votes</span>
                                  <span>
                                    {task.votes}/{task.totalVotes} Votes
                                  </span>
                                </div>
                                <div className="mt-1 h-2 rounded-full bg-white/10">
                                  <div
                                    className="h-full rounded-full bg-purple-400"
                                    style={{ width: `${(task.votes / task.totalVotes) * 100}%` }}
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </article>
                  ))}
                </section>
              )}

              {activeTab === 'fleet' && (
                <section style={panelAnim} className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {agents.map((agent) => (
                    <article key={agent.name} className="rounded-xl border border-white/10 bg-slate-800/70 p-4">
                      <div className="flex items-center justify-between">
                        <h2 className="text-sm font-semibold text-white">{agent.name}</h2>
                        <span className="flex items-center gap-2 text-xs text-slate-300">
                          <span className={`h-2.5 w-2.5 rounded-full ${statusColors[agent.status]}`} />
                          {agent.status}
                        </span>
                      </div>
                      <div className="mt-4 space-y-2 text-sm text-slate-300">
                        <p className="flex items-center gap-2">
                          <Gauge className="h-4 w-4 text-indigo-300" />
                          Role: {agent.role}
                        </p>
                        <p className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-amber-300" />
                          Specialization: {agent.specialization}
                        </p>
                        <p className="flex items-center gap-2" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                          <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                          Uptime: {agent.uptime}
                        </p>
                      </div>
                    </article>
                  ))}
                </section>
              </main>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
