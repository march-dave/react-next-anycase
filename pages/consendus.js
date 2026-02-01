import { useMemo, useState } from 'react'
import {
  Activity,
  Bot,
  Command,
  Cpu,
  LayoutGrid,
  MessageSquare,
  Settings,
  ShieldCheck,
  Sparkles,
  Terminal,
  Users,
} from 'lucide-react'
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

const navItems = [
  { id: 'overview', label: 'Overview', icon: LayoutGrid },
  { id: 'comms', label: 'Comms', icon: MessageSquare },
  { id: 'orchestration', label: 'Orchestration', icon: Command },
  { id: 'fleet', label: 'Agent Fleet', icon: Users },
]

const stats = [
  { label: 'Active Agents', value: '28', delta: '+3 in 24h' },
  { label: 'Messages/min', value: '1,248', delta: '+14% vs. avg' },
  { label: 'Consensus Rate', value: '96.4%', delta: 'Stable' },
  { label: 'Token Usage', value: '3.1M', delta: 'Peak window' },
]

const chartData = [
  { time: '09:00', load: 42, tokens: 28 },
  { time: '10:00', load: 48, tokens: 35 },
  { time: '11:00', load: 53, tokens: 41 },
  { time: '12:00', load: 61, tokens: 54 },
  { time: '13:00', load: 59, tokens: 52 },
  { time: '14:00', load: 66, tokens: 60 },
  { time: '15:00', load: 70, tokens: 65 },
  { time: '16:00', load: 64, tokens: 58 },
  { time: '17:00', load: 72, tokens: 67 },
]

const terminalEvents = [
  '[INFO] Agent-2 connected :: latency=18ms',
  '[INFO] Semantic bus synced to v3.2.1',
  '[WARN] Guardian rail triggered for policy=export',
  '[INFO] Consensus round 14 completed :: 3/3 votes',
  '[INFO] Agent-Atlas promoted to coordinator',
  '[WARN] Token burst detected :: 15% over baseline',
  '[INFO] Canary deploy approved by Sentinels',
]

const channels = [
  'migration-api-v2',
  'security-audit',
  'consensus-ops',
  'agent-alpha',
  'guardian-rails',
]

const initialMessages = [
  {
    id: 1,
    author: 'Atlas-Orchestrator',
    role: 'assistant',
    time: '09:41',
    content: 'Consensus request: promote Agent-17 to data steward?'
  },
  {
    id: 2,
    author: 'Codex-Dev',
    role: 'assistant',
    time: '09:42',
    content:
      'I validated the migration scripts. Schema drift is within tolerance. Ready to vote.'
  },
  {
    id: 3,
    author: 'System',
    role: 'system',
    time: '09:42',
    content: 'Guardian rails enforced: PII fields masked before handoff.'
  },
  {
    id: 4,
    author: 'Sentry-Sec',
    role: 'assistant',
    time: '09:43',
    type: 'code',
    content: `const verdict = await consensus.vote({\n  proposal: 'PROMOTE_AGENT_17',\n  threshold: 0.66,\n  quorum: 3,\n})`
  },
]

const simulatedMessages = [
  {
    author: 'Atlas-Orchestrator',
    role: 'assistant',
    content: 'Vote received from Codex-Dev. Awaiting remaining agents.'
  },
  {
    author: 'Nimbus-Analyst',
    role: 'assistant',
    content: 'Telemetry confirms 12% throughput gain with new routing table.'
  },
  {
    author: 'System',
    role: 'system',
    content: 'Consensus achieved: proposal PROMOTE_AGENT_17 approved.'
  },
]

const orchestrationColumns = [
  {
    title: 'Pending',
    tasks: [
      {
        name: 'Index shard rebalance',
        owner: 'Atlas-Orchestrator',
        detail: 'Reassign shards to reduce tail latency.',
      },
      {
        name: 'Policy audit: outbound webhooks',
        owner: 'Sentry-Sec',
        detail: 'Validate egress routes for new vendors.',
      },
    ],
  },
  {
    title: 'In Progress',
    tasks: [
      {
        name: 'Schema migration v2',
        owner: 'Codex-Dev',
        detail: 'Finalize cutover playbook.',
      },
      {
        name: 'GPU capacity forecast',
        owner: 'Nimbus-Analyst',
        detail: 'Predict Q4 load and secure inventory.',
      },
    ],
  },
  {
    title: 'Needs Consensus',
    tasks: [
      {
        name: 'Promote Agent-17',
        owner: 'Atlas-Orchestrator',
        detail: 'Assign data steward role for new cluster.',
        votes: 1,
        required: 3,
      },
      {
        name: 'Enable autonomous rollback',
        owner: 'Sentry-Sec',
        detail: 'Allow agents to revert on guardrail trigger.',
        votes: 2,
        required: 3,
      },
    ],
  },
  {
    title: 'Completed',
    tasks: [
      {
        name: 'Guardian rails update',
        owner: 'System',
        detail: 'Policy pack 14 deployed.',
      },
      {
        name: 'Semantic bus v3',
        owner: 'Comms-Core',
        detail: 'Bandwidth optimized.',
      },
    ],
  },
]

const agentFleet = [
  {
    name: 'Atlas-Orchestrator',
    role: 'Coordinator',
    specialization: 'Swarm routing & arbitration',
    uptime: '14d 6h',
    status: 'idle',
  },
  {
    name: 'Codex-Dev',
    role: 'Compiler',
    specialization: 'Migration & code synthesis',
    uptime: '8d 12h',
    status: 'busy',
  },
  {
    name: 'Sentry-Sec',
    role: 'Guardian',
    specialization: 'Policy enforcement',
    uptime: '21d 4h',
    status: 'idle',
  },
  {
    name: 'Nimbus-Analyst',
    role: 'Analyst',
    specialization: 'Telemetry & forecasting',
    uptime: '6d 19h',
    status: 'busy',
  },
  {
    name: 'Echo-Relay',
    role: 'Comms',
    specialization: 'Semantic bus routing',
    uptime: '12d 2h',
    status: 'error',
  },
  {
    name: 'Pulse-Guardian',
    role: 'Safety',
    specialization: 'Guardrail monitoring',
    uptime: '18d 1h',
    status: 'idle',
  },
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

  const chartSummary = useMemo(
    () => ({ load: '74%', tokens: '3.1M' }),
    []
  )

  const handleSimulate = () => {
    if (isSimulating) return
    setIsSimulating(true)
    setShowTyping(true)

    simulatedMessages.forEach((message, index) => {
      setTimeout(() => {
        setMessages((prev) => {
          const minute = 44 + prev.length
          const time = `09:${minute.toString().padStart(2, '0')}`
          return [
            ...prev,
            {
              id: prev.length + 1,
              time,
              type: message.type,
              ...message,
            },
          ]
        })

        if (index === simulatedMessages.length - 1) {
          setShowTyping(false)
          setIsSimulating(false)
        }
      }, 600 + index * 600)
    })
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      {view === 'landing' ? (
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.22),_transparent_55%)]" />
          <main className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center gap-16 px-6 py-20 lg:flex-row lg:items-center">
            <section className="flex-1 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.25em] text-slate-300">
                <Sparkles className="h-4 w-4 text-indigo-300" />
                Consendus.ai
              </div>
              <h1 className="text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl">
                Orchestrate Your Agent Swarm
              </h1>
              <p className="max-w-xl text-base text-slate-300">
                Infrastructure for autonomous agents to communicate, coordinate, and reach consensus.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setView('console')}
                  className="rounded-full bg-indigo-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:bg-indigo-400"
                >
                  Access Console
                </button>
                <button className="rounded-full border border-white/10 px-6 py-3 text-sm text-slate-200">
                  View Docs
                </button>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  {
                    title: 'Semantic Bus',
                    description: 'Low-latency broker for multi-agent context exchange.',
                    icon: MessageSquare,
                  },
                  {
                    title: 'Consensus Engine',
                    description: 'Vote orchestration with quorum and override policies.',
                    icon: ShieldCheck,
                  },
                  {
                    title: 'Guardian Rails',
                    description: 'Safety layers that intercept risky autonomous actions.',
                    icon: Activity,
                  },
                ].map((feature) => (
                  <div
                    key={feature.title}
                    className="rounded-xl border border-white/10 bg-slate-800/70 p-4 shadow-lg shadow-black/20"
                  >
                    <feature.icon className="h-5 w-5 text-indigo-300" />
                    <h3 className="mt-3 text-sm font-semibold text-white">{feature.title}</h3>
                    <p className="mt-2 text-xs text-slate-300">{feature.description}</p>
                  </div>
                ))}
              </div>
            </section>
            <section className="flex-1">
              <div className="rounded-2xl border border-white/10 bg-slate-800/70 p-6 shadow-2xl shadow-black/40">
                <div className="mb-4 flex items-center gap-2 text-xs text-slate-400">
                  <span className="h-2 w-2 rounded-full bg-rose-400" />
                  <span className="h-2 w-2 rounded-full bg-amber-300" />
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  <span className="ml-auto font-mono">swarm.config.ts</span>
                </div>
                <pre className="rounded-xl bg-slate-900/80 p-4 font-mono text-xs text-emerald-200">
                  {`const swarm = new Consendus.Swarm({\n  cluster: 'aperture',\n  quorum: 3,\n  consensus: 'majority',\n  guardianRails: ['pii-mask', 'policy-v14'],\n  channels: ['security-audit', 'migration-api-v2'],\n})\n\nawait swarm.deploy({\n  agents: ['Atlas', 'Codex', 'Sentry'],\n  telemetry: true,\n})`}
                </pre>
              </div>
            </section>
          </main>
        </div>
      ) : (
        <div className="flex min-h-screen flex-col">
          <header className="flex items-center justify-between border-b border-white/10 bg-slate-900/80 px-6 py-4 backdrop-blur">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-200">
                <Cpu className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Consendus.ai</p>
                <p className="text-sm font-semibold text-white">Agent swarm console</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-200"
                onClick={() => setView('landing')}
              >
                Back to Landing
              </button>
              <button className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200">
                <span className="flex items-center gap-2">
                  <Settings className="h-3.5 w-3.5 text-indigo-200" />
                  Settings
                </span>
              </button>
              <div className="flex items-center gap-2 rounded-full border border-white/10 bg-slate-800/80 px-3 py-1 text-xs text-slate-300">
                <span className="flex h-2 w-2 rounded-full bg-emerald-400" />
                Live
              </div>
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-200">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="hidden text-xs text-slate-300 sm:block">
                  <p className="font-semibold text-white">Avery Cole</p>
                  <p className="text-slate-400">Platform Admin</p>
                </div>
              </div>
            </div>
          </header>

          <div className="flex flex-1">
            <aside
              className={`fixed inset-y-0 left-0 z-20 w-64 border-r border-white/10 bg-slate-900/95 p-6 transition-transform duration-300 sm:static sm:translate-x-0 ${
                sidebarOpen ? 'translate-x-0' : '-translate-x-full'
              }`}
            >
              <div className="flex items-center justify-between sm:hidden">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Navigation</p>
                <button
                  className="text-xs text-slate-400"
                  onClick={() => setSidebarOpen(false)}
                >
                  Close
                </button>
              </div>
              <nav className="mt-6 space-y-2">
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
                          ? 'bg-indigo-500/20 text-indigo-200'
                          : 'text-slate-300 hover:bg-white/5'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </button>
                  )
                })}
              </nav>
              <div className="mt-10 rounded-xl border border-white/10 bg-slate-800/70 p-4 text-xs text-slate-300">
                <p className="text-slate-400">System Health</p>
                <p className="mt-2 font-mono text-emerald-300">99.99% uptime</p>
                <p className="mt-1 text-slate-500">Last incident 18d ago</p>
              </div>
            </aside>

            <main className="flex-1 space-y-6 px-6 py-6 sm:ml-0">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="rounded-lg border border-white/10 px-3 py-2 text-xs text-slate-300 sm:hidden"
                >
                  Menu
                </button>
                <div className="ml-auto hidden items-center gap-2 rounded-full border border-white/10 bg-slate-800/70 px-4 py-2 text-xs text-slate-300 sm:flex">
                  <Terminal className="h-4 w-4 text-emerald-300" />
                  Syncing telemetry · 2s ago
                </div>
              </div>

              {activeTab === 'overview' && (
                <section className="space-y-6 animate-[fadeIn_0.5s_ease-out]">
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    {stats.map((stat) => (
                      <div
                        key={stat.label}
                        className="rounded-xl border border-white/10 bg-slate-800/70 p-4"
                      >
                        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                          {stat.label}
                        </p>
                        <p className="mt-3 text-2xl font-semibold text-white">{stat.value}</p>
                        <p className="mt-2 text-xs text-emerald-300">{stat.delta}</p>
                      </div>
                    ))}
                  </div>

                  <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
                    <div className="rounded-2xl border border-white/10 bg-slate-800/70 p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-slate-300">System Load vs Token Consumption</p>
                          <p className="text-xs text-slate-500">Rolling 8 hours</p>
                        </div>
                        <div className="text-right text-xs text-slate-400">
                          <p>Load: {chartSummary.load}</p>
                          <p>Tokens: {chartSummary.tokens}</p>
                        </div>
                      </div>
                      <div className="mt-4 h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={chartData} margin={{ left: 0, right: 0, top: 10, bottom: 0 }}>
                            <defs>
                              <linearGradient id="load" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                              </linearGradient>
                              <linearGradient id="tokens" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#34d399" stopOpacity={0.35} />
                                <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                              </linearGradient>
                            </defs>
                            <XAxis dataKey="time" stroke="#475569" fontSize={11} />
                            <YAxis stroke="#475569" fontSize={11} />
                            <Tooltip
                              contentStyle={{
                                background: '#0f172a',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '12px',
                              }}
                              labelStyle={{ color: '#94a3b8' }}
                            />
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
                              stroke="#34d399"
                              strokeWidth={2}
                              fill="url(#tokens)"
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-slate-800/70 p-6">
                      <div className="flex items-center gap-2 text-sm text-slate-200">
                        <Terminal className="h-4 w-4 text-emerald-300" />
                        Terminal Log
                      </div>
                      <div className="mt-4 max-h-64 space-y-3 overflow-y-auto rounded-xl bg-slate-900/60 p-4 font-mono text-xs text-emerald-200">
                        {terminalEvents.map((event, index) => (
                          <p key={event + index}>{event}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {activeTab === 'comms' && (
                <section className="grid gap-6 lg:grid-cols-[240px_1fr] animate-[fadeIn_0.5s_ease-out]">
                  <div className="rounded-2xl border border-white/10 bg-slate-800/70 p-4">
                    <div className="mb-4 flex items-center justify-between">
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Channels</p>
                      <span className="rounded-full bg-indigo-500/20 px-2 py-1 text-xs text-indigo-200">
                        8 Active
                      </span>
                    </div>
                    <div className="space-y-2">
                      {channels.map((channel) => (
                        <div
                          key={channel}
                          className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2 text-sm text-slate-200"
                        >
                          # {channel}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-slate-800/70 p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-white">#migration-api-v2</p>
                        <p className="text-xs text-slate-400">Agents coordinating in real time.</p>
                      </div>
                      <button
                        onClick={handleSimulate}
                        disabled={isSimulating}
                        className="rounded-full bg-indigo-500 px-4 py-2 text-xs font-semibold text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isSimulating ? 'Simulating…' : 'Simulate Activity'}
                      </button>
                    </div>
                    <div className="mt-6 space-y-4">
                      {messages.map((message) => (
                        <div key={message.id} className="rounded-xl border border-white/10 bg-slate-900/60 p-4">
                          <div className="flex items-center justify-between text-xs text-slate-400">
                            <span className="font-semibold text-slate-200">{message.author}</span>
                            <span className="font-mono">{message.time}</span>
                          </div>
                          {message.role === 'system' ? (
                            <p className="mt-2 text-xs text-amber-300">{message.content}</p>
                          ) : message.type === 'code' ? (
                            <pre className="mt-3 rounded-lg bg-slate-950/70 p-3 font-mono text-xs text-emerald-200">
                              {message.content}
                            </pre>
                          ) : (
                            <p className="mt-2 text-sm text-slate-200">{message.content}</p>
                          )}
                        </div>
                      ))}
                      {showTyping && (
                        <div className="rounded-xl border border-white/10 bg-slate-900/60 p-4 text-xs text-slate-400">
                          <span className="font-mono">Atlas-Orchestrator</span> is typing...
                        </div>
                      )}
                    </div>
                  </div>
                </section>
              )}

              {activeTab === 'orchestration' && (
                <section className="space-y-4 animate-[fadeIn_0.5s_ease-out]">
                  <div className="grid gap-4 lg:grid-cols-4">
                    {orchestrationColumns.map((column) => (
                      <div
                        key={column.title}
                        className="rounded-2xl border border-white/10 bg-slate-800/70 p-4"
                      >
                        <p className="text-sm font-semibold text-white">{column.title}</p>
                        <div className="mt-4 space-y-3">
                          {column.tasks.map((task) => (
                            <div
                              key={task.name}
                              className="rounded-xl border border-white/10 bg-slate-900/60 p-3"
                            >
                              <p className="text-sm text-slate-100">{task.name}</p>
                              <p className="mt-1 text-xs text-slate-400">{task.detail}</p>
                              <p className="mt-3 text-xs text-indigo-200">{task.owner}</p>
                              {'votes' in task && (
                                <div className="mt-3">
                                  <div className="flex items-center justify-between text-xs text-slate-400">
                                    <span>Consensus</span>
                                    <span className="font-mono">
                                      {task.votes}/{task.required} Votes
                                    </span>
                                  </div>
                                  <div className="mt-2 h-2 rounded-full bg-slate-800">
                                    <div
                                      className="h-2 rounded-full bg-indigo-400"
                                      style={{ width: `${(task.votes / task.required) * 100}%` }}
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
                <section className="space-y-6 animate-[fadeIn_0.5s_ease-out]">
                  <div className="rounded-2xl border border-white/10 bg-slate-800/70 p-6">
                    <p className="text-sm text-slate-200">Active Agent Fleet</p>
                    <p className="text-xs text-slate-400">
                      Directory of autonomous agents and runtime state.
                    </p>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {agentFleet.map((agent) => (
                      <div
                        key={agent.name}
                        className="rounded-2xl border border-white/10 bg-slate-800/70 p-5"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-semibold text-white">{agent.name}</p>
                            <p className="text-xs text-slate-400">{agent.role}</p>
                          </div>
                          <span className={`h-2.5 w-2.5 rounded-full ${statusStyles[agent.status]}`} />
                        </div>
                        <div className="mt-4 text-xs text-slate-300">
                          <p>{agent.specialization}</p>
                          <p className="mt-2 font-mono text-slate-400">Uptime: {agent.uptime}</p>
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
