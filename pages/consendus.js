import { useMemo, useState } from 'react'
import {
  Activity,
  Bot,
  ChevronRight,
  Command,
  Layers,
  LayoutGrid,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  Terminal,
  Users,
  Wand2,
  X,
} from 'lucide-react'
import { Area, AreaChart, ResponsiveContainer, Tooltip } from 'recharts'

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

    const nextMessages = simulatedMessages.slice(0, 3)
    nextMessages.forEach((message, index) => {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            ...message,
            id: prev.length + 1,
          },
        ])
      }, 650 * (index + 1))
    })

    setTimeout(() => {
      setShowTyping(false)
      setIsSimulating(false)
    }, 650 * (nextMessages.length + 1))
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
              <button className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200">
                <span className="flex items-center gap-2">
                  <Command className="h-3.5 w-3.5 text-indigo-200" />
                  Live Preview
                </span>
              </button>
              <div className="flex items-center gap-2 rounded-full border border-white/10 bg-slate-800/80 px-3 py-1 text-xs text-slate-300">
                <span className="flex h-2 w-2 rounded-full bg-emerald-400" />
                Active
              </div>
            </div>

            <div className="mt-10 grid w-full gap-6 lg:grid-cols-[1.3fr,1fr]">
              <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-6 text-left shadow-xl shadow-black/30">
                <div className="mb-4 flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-slate-400">
                  <Terminal className="h-4 w-4 text-emerald-300" />
                  swarm.config.ts
                </div>
                <pre className="whitespace-pre-wrap text-xs text-emerald-200 sm:text-sm">
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
              <div className="grid gap-4">
                {features.map((feature) => (
                  <div
                    key={feature.title}
                    className="rounded-xl border border-white/10 bg-slate-800/60 p-4 text-left shadow-xl shadow-black/20"
                  >
                    <div className="flex items-center gap-2 text-sm font-semibold text-white">
                      <feature.icon className="h-4 w-4 text-indigo-300" />
                      {feature.title}
                    </div>
                    <p className="mt-2 text-xs text-slate-300">{feature.copy}</p>
                  </div>
                ))}
              </div>
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
                  <Layers className="h-4 w-4" />
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
                            <Area type="monotone" dataKey="load" stroke="#6366f1" strokeWidth={2} fill="url(#load)" />
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
                      <div className="mb-3 flex items-center justify-between">
                        <p className="text-sm text-slate-200">System Events</p>
                        <span className="text-xs text-slate-400">Live</span>
                      </div>
                      <div className="max-h-72 space-y-3 overflow-y-auto rounded-lg border border-white/5 bg-slate-900/70 p-3 text-xs text-emerald-200">
                        {terminalLogs.map((log) => (
                          <div key={log} className="font-mono">
                            {log}
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

                  <div className="flex flex-col rounded-2xl border border-white/10 bg-slate-800/70 p-6">
                    <div className="flex flex-wrap items-center justify-between gap-3">
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
                    <div className="mt-6 flex-1 space-y-4 text-sm">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`rounded-xl border border-white/10 p-4 ${
                            message.type === 'system'
                              ? 'bg-amber-500/10 text-amber-200'
                              : message.type === 'action'
                                ? 'bg-purple-500/10 text-purple-200'
                                : 'bg-slate-900/70 text-slate-200'
                          }`}
                        >
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-semibold text-white">{message.author}</span>
                            <span className="rounded-full border border-white/10 px-2 py-0.5 text-[10px] text-slate-400">
                              {message.time}
                            </span>
                          </div>
                          {message.format === 'code' ? (
                            <pre className="mt-3 overflow-x-auto rounded-lg border border-white/10 bg-black/40 p-3 text-xs text-emerald-200">
                              <code>{message.content}</code>
                            </pre>
                          ) : (
                            <p className="mt-3 text-sm text-slate-200">{message.content}</p>
                          )}
                        </div>
                      ))}
                      {showTyping && (
                        <div className="rounded-lg border border-white/10 bg-slate-900/80 p-3 text-xs text-slate-300">
                          <span className="font-mono">[agents typing]</span>
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
          animation: fade-in 0.4s ease-out;
        }
      `}</style>
    </div>
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
