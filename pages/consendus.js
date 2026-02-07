import { useMemo, useState } from 'react'
import {
  Activity,
  Bot,
  ChevronRight,
  Command,
  LayoutGrid,
  Menu,
  MessageCircle,
  ShieldAlert,
  Sparkles,
  Terminal,
  Users,
  X,
} from 'lucide-react'
import { Area, AreaChart, ResponsiveContainer, Tooltip } from 'recharts'

const navigation = [
  { id: 'overview', label: 'Overview', icon: Activity },
  { id: 'comms', label: 'Comms', icon: MessageCircle },
  { id: 'orchestration', label: 'Orchestration', icon: LayoutGrid },
  { id: 'fleet', label: 'Agent Fleet', icon: Users },
]

const stats = [
  { label: 'Active Agents', value: '28', trend: '+3' },
  { label: 'Messages/min', value: '1,482', trend: '+12%' },
  { label: 'Consensus Rate', value: '94.2%', trend: '+1.4%' },
  { label: 'Token Usage', value: '18.6M', trend: '-2.1%' },
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
    role: 'Lead Orchestrator',
    specialization: 'Swarm routing',
    uptime: '18h 42m',
    status: 'busy',
  },
  {
    name: 'Codex-Dev',
    role: 'Automation Engineer',
    specialization: 'Deploy scripts',
    uptime: '12h 10m',
    status: 'idle',
  },
  {
    name: 'Sentry-Sec',
    role: 'Security Sentinel',
    specialization: 'Threat analysis',
    uptime: '22h 55m',
    status: 'error',
  },
  {
    name: 'Pulse-Analyst',
    role: 'Signal Analyst',
    specialization: 'Telemetry insights',
    uptime: '9h 03m',
    status: 'idle',
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
        <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-16">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#6366f133,transparent_60%)]" />
          <div className="relative z-10 flex w-full max-w-5xl flex-col items-center text-center">
            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-slate-800/60 px-4 py-2 text-xs uppercase tracking-[0.3em] text-slate-300">
              <Sparkles className="h-4 w-4 text-indigo-300" />
              Consendus.ai
            </div>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl">
              Orchestrate Your Agent Swarm
            </h1>
            <p className="mt-4 max-w-2xl text-base text-slate-300 sm:text-lg">
              Infrastructure for autonomous agents to communicate, coordinate, and reach consensus.
            </p>
            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row">
              <button
                onClick={() => setView('console')}
                className="inline-flex items-center gap-2 rounded-full bg-indigo-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-400"
              >
                Access Console
                <ChevronRight className="h-4 w-4" />
              </button>
              <button className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-800/60 px-6 py-3 text-sm text-slate-200">
                <Command className="h-4 w-4" />
                View Docs
              </button>
            </div>

            <div className="mt-12 w-full max-w-3xl rounded-2xl border border-white/10 bg-slate-800/80 p-6 shadow-2xl shadow-black/40">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                <span className="h-2 w-2 rounded-full bg-amber-400" />
                <span className="h-2 w-2 rounded-full bg-rose-400" />
                <span className="ml-3 font-mono">swarm.config.ts</span>
              </div>
              <pre className="mt-4 whitespace-pre-wrap rounded-xl border border-white/10 bg-slate-900/80 p-4 text-left text-xs text-emerald-200 sm:text-sm">
{`import { Consendus } from 'consendus'

const swarm = new Consendus.Swarm({
  quorum: 3,
  agents: ['Atlas', 'Codex', 'Sentry'],
  consensus: 'weighted',
  guardRails: true,
})

swarm.deploy('migration-api-v2')`}
              </pre>
            </div>

            <div className="mt-10 grid w-full gap-4 sm:grid-cols-3">
              {[
                {
                  title: 'Semantic Bus',
                  copy: 'Real-time routing layer for agent-to-agent messaging.',
                },
                {
                  title: 'Consensus Engine',
                  copy: 'Multi-agent voting with quorum enforcement and audit trails.',
                },
                {
                  title: 'Guardian Rails',
                  copy: 'Policy guardrails that intercept unsafe actions automatically.',
                },
              ].map((feature) => (
                <div
                  key={feature.title}
                  className="rounded-xl border border-white/10 bg-slate-800/60 p-4 text-left shadow-xl shadow-black/30"
                >
                  <h3 className="text-sm font-semibold text-white">{feature.title}</h3>
                  <p className="mt-2 text-xs text-slate-300">{feature.copy}</p>
                </div>
              ))}
            </div>
          </div>
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
            className={`fixed left-0 top-0 z-40 h-full w-64 border-r border-white/10 bg-slate-900/95 p-6 transition-transform sm:static sm:translate-x-0 ${
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

            <div className="mt-10 space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id)
                      setSidebarOpen(false)
                    }}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm transition ${
                      activeTab === item.id
                        ? 'bg-indigo-500/20 text-indigo-200'
                        : 'text-slate-300 hover:bg-white/5'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </button>
                )
              })}
            </div>

            <div className="mt-10 rounded-xl border border-white/10 bg-slate-800/70 p-4 text-xs text-slate-300">
              <p className="text-slate-400">Swarm Health</p>
              <p className="mt-2 text-sm text-white">98.7% uptime</p>
              <div className="mt-3 h-2 rounded-full bg-white/10">
                <div className="h-full w-4/5 rounded-full bg-emerald-400" />
              </div>
            </div>
          </aside>

          <div className="flex flex-1 flex-col">
            <header className="flex items-center justify-between border-b border-white/10 px-6 py-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="rounded-lg border border-white/10 p-2 text-slate-300 sm:hidden"
                >
                  <Menu className="h-4 w-4" />
                </button>
                <div>
                  <p className="text-sm font-semibold text-white">
                    {navigation.find((nav) => nav.id === activeTab)?.label}
                  </p>
                  <p className="text-xs text-slate-400">Autonomous swarm orchestration</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="rounded-full border border-white/10 bg-slate-800/70 px-3 py-1 text-xs text-slate-300">
                  <Bot className="mr-2 inline-block h-3 w-3 text-indigo-300" />
                  Atlas-Orchestrator
                </span>
                <button className="rounded-full border border-white/10 bg-slate-800/70 px-3 py-1 text-xs text-slate-300">
                  Settings
                </button>
              </div>
            </header>

            <main className="flex-1 space-y-6 overflow-y-auto px-6 py-6">
              {activeTab === 'overview' && (
                <section className="space-y-6 animate-fade-in">
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    {stats.map((stat) => (
                      <div
                        key={stat.label}
                        className="rounded-xl border border-white/10 bg-slate-800/70 p-4"
                      >
                        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{stat.label}</p>
                        <div className="mt-3 flex items-center justify-between">
                          <p className="text-2xl font-semibold text-white">{stat.value}</p>
                          <span className="rounded-full bg-emerald-400/10 px-2 py-1 text-xs text-emerald-300">
                            {stat.trend}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
                    <div className="rounded-xl border border-white/10 bg-slate-800/70 p-4">
                      <div className="mb-4 flex items-center justify-between">
                        <p className="text-sm text-slate-200">System Load vs Token Consumption</p>
                        <span className="text-xs text-slate-400">Last 24h</span>
                      </div>
                      <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={chartData} margin={{ left: 0, right: 0, top: 10, bottom: 0 }}>
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
                <section className="grid gap-6 lg:grid-cols-[240px,1fr] animate-fade-in">
                  <div className="rounded-xl border border-white/10 bg-slate-800/70 p-4">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Channels</p>
                    <div className="mt-4 space-y-2 text-sm text-slate-300">
                      {channels.map((channel) => (
                        <div
                          key={channel}
                          className="rounded-lg border border-white/5 bg-slate-900/60 px-3 py-2"
                        >
                          {channel}
                        </div>
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
                  <div className="grid gap-4 lg:grid-cols-4">
                    {taskStates.map((state) => (
                      <div
                        key={state}
                        className="rounded-xl border border-white/10 bg-slate-800/70 p-4"
                      >
                        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{state}</p>
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
                <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 animate-fade-in">
                  {agents.map((agent) => (
                    <div
                      key={agent.name}
                      className="rounded-xl border border-white/10 bg-slate-800/70 p-4"
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-white">{agent.name}</p>
                        <span
                          className={`h-2 w-2 rounded-full ${
                            agent.status === 'idle'
                              ? 'bg-emerald-400'
                              : agent.status === 'busy'
                                ? 'bg-amber-400'
                                : 'bg-rose-400'
                          }`}
                        />
                      </div>
                      <p className="mt-2 text-xs text-slate-400">{agent.role}</p>
                      <div className="mt-4 grid gap-2 text-xs text-slate-300">
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
