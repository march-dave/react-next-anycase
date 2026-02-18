import Head from 'next/head'
import { useMemo, useState } from 'react'
import {
  Activity,
  Bot,
  CheckCircle2,
  Command,
  Cpu,
  Gauge,
  LayoutGrid,
  Menu,
  MessageSquare,
  MoonStar,
  ShieldCheck,
  Sparkles,
  Terminal,
  Users,
  X,
} from 'lucide-react'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

const navigation = [
  { id: 'overview', label: 'Overview', icon: LayoutGrid },
  { id: 'comms', label: 'Comms', icon: MessageSquare },
  { id: 'orchestration', label: 'Orchestration', icon: Command },
  { id: 'fleet', label: 'Agent Fleet', icon: Users },
]

const landingFeatures = [
  {
    title: 'Semantic Bus',
    copy: 'Route messages between specialized agents with low-latency, policy-aware channels.',
    icon: Activity,
  },
  {
    title: 'Consensus Engine',
    copy: 'Coordinate multi-agent voting and quorum policies for critical actions and deployments.',
    icon: ShieldCheck,
  },
  {
    title: 'Guardian Rails',
    copy: 'Continuously enforce safety constraints and block high-risk operations automatically.',
    icon: Sparkles,
  },
]

const stats = [
  { label: 'Active Agents', value: '128', trend: '+12%', icon: Bot },
  { label: 'Messages/min', value: '4.2k', trend: '+8%', icon: MessageSquare },
  { label: 'Consensus Rate', value: '96.4%', trend: '+2.1%', icon: CheckCircle2 },
  { label: 'Token Usage', value: '1.8M', trend: '+4.5%', icon: Cpu },
]

const chartData = [
  { time: '00:00', load: 24, tokens: 34 },
  { time: '03:00', load: 37, tokens: 46 },
  { time: '06:00', load: 49, tokens: 58 },
  { time: '09:00', load: 62, tokens: 74 },
  { time: '12:00', load: 79, tokens: 95 },
  { time: '15:00', load: 67, tokens: 88 },
  { time: '18:00', load: 83, tokens: 112 },
  { time: '21:00', load: 74, tokens: 103 },
]

const terminalLogs = [
  '[INFO] Atlas-Orchestrator connected to semantic bus.',
  '[INFO] Consensus engine opened vote for migration-api-v2.',
  '[WARN] High latency detected on eu-west gateway.',
  '[INFO] Guardian rail blocked unsafe write on secrets namespace.',
  '[INFO] Codex-Dev started rollback simulation for shard-3.',
  '[SUCCESS] Quorum achieved: rollout phase approved.',
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
    content:
      "const migrationPlan = await swarm.compose({\\n  strategy: 'zero-downtime',\\n  fallback: 'blue-green',\\n})",
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
    author: 'Nova-Perf',
    time: '09:44',
    content:
      "```ts\\nswarm.vote({\\n  proposal: 'phase-2 rollout',\\n  verdict: 'approve',\\n  confidence: 0.92\\n})\\n```",
    type: 'default',
    format: 'markdown',
  },
  {
    author: 'Sentry-Sec',
    time: '09:45',
    content: 'Approved. Monitoring anomaly score across edge gateways.',
    type: 'default',
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
  { title: 'Stress test edge latency', agent: 'Nova-Perf', state: 'In Progress' },
  {
    title: 'Authorize cross-region data sync',
    agent: 'Quorum Council',
    state: 'Needs Consensus',
    votes: 2,
    totalVotes: 3,
  },
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

const panelClass =
  'rounded-xl border border-white/10 bg-slate-800/70 backdrop-blur-md shadow-[0_10px_30px_rgba(2,6,23,0.45)]'

function MessageBody({ message }) {
  if (message.format === 'code') {
    return (
      <pre className="mt-3 overflow-x-auto rounded-lg border border-white/10 bg-black/40 p-3 font-mono text-xs text-emerald-200">
        {message.content}
      </pre>
    )
  }

  if (message.format === 'markdown') {
    const codeMatch = message.content.match(/```[a-z]*\n([\s\S]*?)```/i)
    return codeMatch ? (
      <pre className="mt-3 overflow-x-auto rounded-lg border border-white/10 bg-black/40 p-3 font-mono text-xs text-emerald-200">
        {codeMatch[1]}
      </pre>
    ) : (
      <p className="mt-2 leading-relaxed">{message.content}</p>
    )
  }

  return <p className="mt-2 leading-relaxed">{message.content}</p>
}

export default function ConsendusPage() {
  const [view, setView] = useState('landing')
  const [activeTab, setActiveTab] = useState('overview')
  const [messages, setMessages] = useState(initialMessages)
  const [isSimulating, setIsSimulating] = useState(false)
  const [showTyping, setShowTyping] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const tasksByState = useMemo(
    () =>
      taskStates.reduce((acc, state) => {
        acc[state] = tasks.filter((task) => task.state === state)
        return acc
      }, {}),
    []
  )

  const simulateActivity = () => {
    if (isSimulating) return

    setIsSimulating(true)
    setShowTyping(true)

    simulatedMessages.forEach((message, index) => {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            ...message,
            id: prev.length + 1,
          },
        ])
      }, 700 * (index + 1))
    })

    setTimeout(() => {
      setShowTyping(false)
      setIsSimulating(false)
    }, 700 * (simulatedMessages.length + 1))
  }

  return (
    <>
      <Head>
        <title>Consendus.ai — Swarm Orchestration Console</title>
      </Head>

      <div className="min-h-screen bg-slate-900 text-slate-100">
        {view === 'landing' ? (
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-10">
            <div className="mb-14 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-indigo-500/20">
                  <Sparkles className="h-5 w-5 text-indigo-300" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Consendus.ai</p>
                  <p className="text-sm font-semibold text-white">Agent Infrastructure</p>
                </div>
              </div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
                <MoonStar className="h-3.5 w-3.5 text-indigo-200" />
                Dark Mode Prototype
              </span>
            </div>

            <section className="grid items-center gap-8 lg:grid-cols-[1.1fr,1fr]">
              <div>
                <h1 className="text-4xl font-semibold tracking-tight text-white md:text-6xl">
                  Orchestrate Your Agent Swarm
                </h1>
                <p className="mt-4 max-w-2xl text-base text-slate-300 md:text-lg">
                  Infrastructure for autonomous agents to communicate, coordinate, and reach
                  consensus.
                </p>
                <button
                  onClick={() => setView('dashboard')}
                  className="mt-8 inline-flex items-center gap-2 rounded-xl border border-indigo-300/30 bg-indigo-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-400"
                >
                  Access Console
                </button>
              </div>

              <div className={`${panelClass} p-5`}>
                <div className="mb-3 flex items-center justify-between text-xs text-slate-400">
                  <span className="font-mono">swarm.config.ts</span>
                  <span>TypeScript</span>
                </div>
                <pre className="overflow-x-auto rounded-lg border border-white/10 bg-black/40 p-4 font-mono text-xs leading-relaxed text-emerald-200 sm:text-sm">
{`import { Consendus } from 'consendus'

const swarm = new Consendus.Swarm({
  agents: ['Atlas-Orchestrator', 'Codex-Dev', 'Sentry-Sec'],
  bus: 'semantic',
  quorum: 3,
  guardRails: { policyMode: 'strict' },
})

await swarm.deploy('migration-api-v2')`}
                </pre>
              </div>
            </section>

            <section className="mt-10 grid gap-4 md:grid-cols-3">
              {landingFeatures.map((feature) => {
                const Icon = feature.icon
                return (
                  <div key={feature.title} className={`${panelClass} p-5`}>
                    <div className="flex items-center gap-2 text-sm font-semibold text-white">
                      <Icon className="h-4 w-4 text-indigo-300" />
                      {feature.title}
                    </div>
                    <p className="mt-2 text-sm text-slate-300">{feature.copy}</p>
                  </div>
                )
              })}
            </section>
          </div>
        ) : (
          <div className="flex min-h-screen">
            <div
              className={`fixed inset-0 z-30 bg-black/60 transition-opacity sm:hidden ${
                sidebarOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
              }`}
              onClick={() => setSidebarOpen(false)}
            />

            <aside
              className={`fixed left-0 top-0 z-40 h-full w-72 border-r border-white/10 bg-slate-900/95 p-5 backdrop-blur-md transition-transform sm:static sm:translate-x-0 ${
                sidebarOpen ? 'translate-x-0' : '-translate-x-full'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-300">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Consendus</p>
                    <p className="text-sm font-semibold text-white">Swarm Console</p>
                  </div>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="rounded-lg border border-white/10 p-2 text-slate-300 sm:hidden"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-8 space-y-2">
                {navigation.map((item) => {
                  const Icon = item.icon
                  const active = item.id === activeTab

                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id)
                        setSidebarOpen(false)
                      }}
                      className={`flex w-full items-center gap-3 rounded-xl border px-3 py-2 text-sm transition ${
                        active
                          ? 'border-indigo-300/40 bg-indigo-500/20 text-white'
                          : 'border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/[0.06]'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </button>
                  )
                })}
              </div>

              <div className="mt-8 rounded-xl border border-white/10 bg-slate-800/60 p-4 text-xs text-slate-300">
                <p className="text-slate-400">Swarm Health</p>
                <p className="mt-1 text-sm font-semibold text-white">98.7% uptime</p>
                <div className="mt-3 h-2 rounded-full bg-white/10">
                  <div className="h-full w-4/5 rounded-full bg-emerald-400" />
                </div>
              </div>
            </aside>

            <div className="flex min-w-0 flex-1 flex-col">
              <header className="flex items-center justify-between border-b border-white/10 px-4 py-4 sm:px-6">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSidebarOpen(true)}
                    className="rounded-lg border border-white/10 p-2 text-slate-300 sm:hidden"
                  >
                    <Menu className="h-4 w-4" />
                  </button>
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {navigation.find((item) => item.id === activeTab)?.label}
                    </p>
                    <p className="text-xs text-slate-400">Autonomous swarm orchestration</p>
                  </div>
                </div>
                <button className="inline-flex items-center gap-2 rounded-full border border-purple-400/30 bg-purple-500/10 px-3 py-1.5 text-xs text-purple-100 transition hover:bg-purple-500/20">
                  <Sparkles className="h-3.5 w-3.5" />
                  AI Actions
                </button>
              </header>

              <main className="flex-1 overflow-y-auto px-4 py-5 sm:px-6">
                <section key={activeTab} className="animate-fade-in space-y-6">
                  {activeTab === 'overview' && (
                    <>
                      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                        {stats.map((stat) => {
                          const Icon = stat.icon
                          return (
                            <div key={stat.label} className={`${panelClass} p-4`}>
                              <div className="flex items-center justify-between">
                                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                                  {stat.label}
                                </p>
                                <Icon className="h-4 w-4 text-indigo-300" />
                              </div>
                              <p className="mt-3 text-2xl font-semibold text-white">{stat.value}</p>
                              <span className="mt-2 inline-flex rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs text-emerald-300">
                                {stat.trend}
                              </span>
                            </div>
                          )
                        })}
                      </div>

                      <div className="grid gap-4 xl:grid-cols-[1.8fr,1fr]">
                        <div className={`${panelClass} p-4`}>
                          <div className="mb-4 flex items-center justify-between">
                            <p className="text-sm text-white">System Load vs Token Consumption</p>
                            <div className="inline-flex items-center gap-2 text-xs text-slate-400">
                              <Gauge className="h-3.5 w-3.5" />
                              Last 24h
                            </div>
                          </div>
                          <div className="h-72">
                            <ResponsiveContainer width="100%" height="100%">
                              <AreaChart data={chartData}>
                                <defs>
                                  <linearGradient id="load" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                  </linearGradient>
                                  <linearGradient id="tokens" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                  </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.2)" />
                                <XAxis dataKey="time" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                                <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} />
                                <Tooltip
                                  contentStyle={{
                                    backgroundColor: '#0f172a',
                                    border: '1px solid rgba(148, 163, 184, 0.2)',
                                    borderRadius: '12px',
                                    color: '#e2e8f0',
                                  }}
                                />
                                <Area type="monotone" dataKey="load" stroke="#6366f1" fill="url(#load)" />
                                <Area
                                  type="monotone"
                                  dataKey="tokens"
                                  stroke="#10b981"
                                  fill="url(#tokens)"
                                />
                              </AreaChart>
                            </ResponsiveContainer>
                          </div>
                        </div>

                        <div className={`${panelClass} p-4`}>
                          <div className="mb-3 flex items-center justify-between">
                            <p className="text-sm text-white">System Events</p>
                            <Terminal className="h-4 w-4 text-emerald-300" />
                          </div>
                          <div className="max-h-72 space-y-2 overflow-y-auto rounded-lg border border-white/10 bg-slate-900/70 p-3 font-mono text-xs text-emerald-200 no-scrollbar">
                            {terminalLogs.map((log) => (
                              <p key={log}>{log}</p>
                            ))}
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {activeTab === 'comms' && (
                    <div className="grid gap-4 xl:grid-cols-[240px,1fr]">
                      <div className={`${panelClass} p-4`}>
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Channels</p>
                        <div className="mt-3 space-y-2 text-sm text-slate-200">
                          {channels.map((channel) => (
                            <button
                              key={channel}
                              className="w-full rounded-lg border border-white/10 bg-slate-900/50 px-3 py-2 text-left transition hover:bg-slate-900/80"
                            >
                              {channel}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className={`${panelClass} flex min-h-[60vh] flex-col p-4`}>
                        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
                          <div>
                            <p className="text-sm font-semibold text-white">#migration-api-v2</p>
                            <p className="text-xs text-slate-400">Agents coordinating in real time.</p>
                          </div>
                          <button
                            onClick={simulateActivity}
                            disabled={isSimulating}
                            className="rounded-xl bg-indigo-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-70"
                          >
                            {isSimulating ? 'Simulating…' : 'Simulate Activity'}
                          </button>
                        </div>

                        <div className="mt-4 flex-1 space-y-3 overflow-y-auto pr-1 no-scrollbar">
                          {messages.map((message) => (
                            <div
                              key={message.id}
                              className={`rounded-xl border p-3 ${
                                message.type === 'system'
                                  ? 'border-amber-400/20 bg-amber-500/10 text-amber-100'
                                  : message.type === 'action'
                                    ? 'border-purple-400/20 bg-purple-500/10 text-purple-100'
                                    : 'border-white/10 bg-slate-900/70 text-slate-200'
                              }`}
                            >
                              <div className="flex items-center justify-between text-xs">
                                <span className="font-semibold text-white">{message.author}</span>
                                <span className="font-mono text-slate-400">{message.time}</span>
                              </div>
                              <MessageBody message={message} />
                            </div>
                          ))}

                          {showTyping && (
                            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-800/80 px-3 py-2 text-xs text-slate-300">
                              <span>Agents typing</span>
                              <span className="h-2 w-2 animate-pulse rounded-full bg-indigo-400" />
                              <span className="h-2 w-2 animate-pulse rounded-full bg-indigo-400 [animation-delay:150ms]" />
                              <span className="h-2 w-2 animate-pulse rounded-full bg-indigo-400 [animation-delay:300ms]" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'orchestration' && (
                    <div className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-4">
                      {taskStates.map((state) => (
                        <div key={state} className={`${panelClass} p-4`}>
                          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{state}</p>
                          <div className="mt-3 space-y-3">
                            {tasksByState[state].map((task) => (
                              <div key={task.title} className="rounded-lg border border-white/10 bg-slate-900/70 p-3">
                                <p className="text-sm text-white">{task.title}</p>
                                <p className="mt-1 text-xs text-slate-400">{task.agent}</p>
                                {state === 'Needs Consensus' && (
                                  <div className="mt-3">
                                    <div className="flex items-center justify-between text-xs text-slate-400">
                                      <span>Consensus</span>
                                      <span>
                                        {task.votes}/{task.totalVotes} Votes
                                      </span>
                                    </div>
                                    <div className="mt-2 h-2 rounded-full bg-white/10">
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
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTab === 'fleet' && (
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                      {agents.map((agent) => (
                        <div key={agent.name} className={`${panelClass} p-4`}>
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-sm font-semibold text-white">{agent.name}</p>
                              <p className="mt-1 text-xs text-slate-400">{agent.role}</p>
                            </div>
                            <span
                              className={`mt-1 h-2.5 w-2.5 rounded-full ${
                                agent.status === 'idle'
                                  ? 'bg-emerald-400'
                                  : agent.status === 'busy'
                                    ? 'bg-amber-400'
                                    : 'bg-rose-400'
                              }`}
                            />
                          </div>
                          <div className="mt-4 space-y-2 text-xs text-slate-300">
                            <div className="flex items-center justify-between">
                              <span>Specialization</span>
                              <span className="text-white">{agent.specialization}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span>Uptime</span>
                              <span className="font-mono text-white">{agent.uptime}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              </main>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        .animate-fade-in {
          animation: fadeIn 0.35s ease-out;
        }
      `}</style>
    </>
  )
}
