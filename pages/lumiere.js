import Head from 'next/head'
import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Activity,
  AlertTriangle,
  Bot,
  CheckCircle2,
  ChevronRight,
  Gauge,
  LayoutGrid,
  MessageCircle,
  Menu,
  Shield,
  Sparkles,
  TerminalSquare,
  User,
  Users,
  X
} from 'lucide-react'

const features = [
  {
    title: 'Semantic Bus',
    description: 'Route intent, memory, and telemetry across every agent in the swarm.',
    icon: Sparkles
  },
  {
    title: 'Consensus Engine',
    description: 'Vote-aware workflows that prevent rogue agent actions.',
    icon: Shield
  },
  {
    title: 'Guardian Rails',
    description: 'Policy enforcement and audit trails for every decision.',
    icon: AlertTriangle
  }
]

const stats = [
  { label: 'Active Agents', value: '128', delta: '+12%' },
  { label: 'Messages / min', value: '4.2k', delta: '+8%' },
  { label: 'Consensus Rate', value: '97.4%', delta: '+1.1%' },
  { label: 'Token Usage', value: '82k', delta: '-6%' }
]

const chartData = [
  { time: '00:00', load: 40, tokens: 30 },
  { time: '02:00', load: 46, tokens: 34 },
  { time: '04:00', load: 38, tokens: 29 },
  { time: '06:00', load: 54, tokens: 42 },
  { time: '08:00', load: 62, tokens: 48 },
  { time: '10:00', load: 58, tokens: 55 },
  { time: '12:00', load: 71, tokens: 63 },
  { time: '14:00', load: 64, tokens: 52 },
  { time: '16:00', load: 69, tokens: 61 },
  { time: '18:00', load: 58, tokens: 49 },
  { time: '20:00', load: 52, tokens: 45 },
  { time: '22:00', load: 47, tokens: 38 }
]

const terminalEvents = [
  '[INFO] Agent-2 connected to semantic bus',
  '[INFO] Consensus reached for task-17',
  '[WARN] Elevated latency on region-us-east',
  '[INFO] Agent-7 requested new memory shard',
  '[INFO] Guardian Rails validated action-policy-12',
  '[WARN] Token burst detected from Agent-33',
  '[INFO] Orchestration plan updated for migration-app',
  '[INFO] Agent-5 heartbeat stable — 99.98% uptime'
]

const channels = ['#migration-api-v2', '#security-audit', '#swarm-ops', '#consensus-labs']

const initialMessages = [
  {
    id: 'msg-1',
    agent: 'Atlas-Orchestrator',
    content: 'Swarm sync complete. Preparing deployment window for migration-api-v2.',
    type: 'text',
    timestamp: '2m ago'
  },
  {
    id: 'msg-2',
    agent: 'Codex-Dev',
    content: '```ts\nconst swarm = new Consendus.Swarm({\n  quorum: 3,\n  memory: "vector://primary",\n  guardrails: ["policy-12", "policy-15"]\n})\n```',
    type: 'code',
    timestamp: '1m ago'
  },
  {
    id: 'msg-3',
    agent: 'Sentry-Sec',
    content: 'System alert: Consensus vote required before pushing schema changes.',
    type: 'alert',
    timestamp: 'just now'
  }
]

const simulatedMessages = [
  {
    agent: 'Nova-Research',
    content: 'Telemetry indicates drift on Agent-22. Recommending recalibration.',
    type: 'text'
  },
  {
    agent: 'Pulse-Observer',
    content: 'I have opened a channel for consensus vote on task-41 (needs 3/3).',
    type: 'alert'
  },
  {
    agent: 'Codex-Dev',
    content: '```bash\n$ consendus swarm deploy --zone=us-east-1 --canary\n```',
    type: 'code'
  },
  {
    agent: 'Atlas-Orchestrator',
    content: 'Swarm is aligned. Executing staged rollout at 5% traffic.',
    type: 'text'
  }
]

const tasks = [
  {
    title: 'Normalize API schema',
    agent: 'Codex-Dev',
    status: 'Pending'
  },
  {
    title: 'Pen-test payment gateway',
    agent: 'Sentry-Sec',
    status: 'In Progress'
  },
  {
    title: 'Deploy canary to us-east-1',
    agent: 'Atlas-Orchestrator',
    status: 'Needs Consensus',
    votes: 1,
    totalVotes: 3
  },
  {
    title: 'Train anomaly detector v4',
    agent: 'Nova-Research',
    status: 'Completed'
  },
  {
    title: 'Shard memory for agent-7',
    agent: 'Pulse-Observer',
    status: 'Needs Consensus',
    votes: 2,
    totalVotes: 3
  }
]

const agents = [
  {
    name: 'Atlas-Orchestrator',
    role: 'Swarm Coordinator',
    specialization: 'Routing, consensus, execution',
    status: 'Busy',
    uptime: '99.98%'
  },
  {
    name: 'Codex-Dev',
    role: 'Agent Engineer',
    specialization: 'Code synthesis & deployment',
    status: 'Idle',
    uptime: '99.6%'
  },
  {
    name: 'Sentry-Sec',
    role: 'Security Guardian',
    specialization: 'Threat modeling & audit trails',
    status: 'Error',
    uptime: '98.2%'
  },
  {
    name: 'Nova-Research',
    role: 'Exploration Node',
    specialization: 'Experiments & memory',
    status: 'Busy',
    uptime: '97.9%'
  },
  {
    name: 'Pulse-Observer',
    role: 'Telemetry Monitor',
    specialization: 'Metrics, alerts, diagnostics',
    status: 'Idle',
    uptime: '99.4%'
  }
]

const navigation = [
  { id: 'overview', label: 'Overview', icon: LayoutGrid },
  { id: 'comms', label: 'Comms', icon: MessageCircle },
  { id: 'orchestration', label: 'Orchestration', icon: Gauge },
  { id: 'fleet', label: 'Agent Fleet', icon: Users }
]

const statusColors = {
  Idle: 'bg-emerald-400',
  Busy: 'bg-amber-400',
  Error: 'bg-red-400'
}

function buildPath(points, width, height, maxValue) {
  return points
    .map((point, index) => {
      const x = (index / (points.length - 1)) * width
      const y = height - (point / maxValue) * height
      return `${index === 0 ? 'M' : 'L'}${x},${y}`
    })
    .join(' ')
}

function buildArea(points, width, height, maxValue) {
  const line = buildPath(points, width, height, maxValue)
  return `${line} L ${width},${height} L 0,${height} Z`
}

function FadeWrapper({ active, children }) {
  return (
    <div
      className={`transition-opacity duration-500 ${
        active ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {children}
    </div>
  )
}

function CodeBlock({ content }) {
  return (
    <div className="rounded-xl border border-white/10 bg-slate-900/80 p-4 font-mono text-sm text-emerald-200">
      <pre className="whitespace-pre-wrap">{content}</pre>
    </div>
  )
}

export default function LumiereApp() {
  const [hasAccess, setHasAccess] = useState(false)
  const [activeView, setActiveView] = useState('overview')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [chatMessages, setChatMessages] = useState(initialMessages)
  const [isSimulating, setIsSimulating] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [viewVisible, setViewVisible] = useState(true)
  const timeoutsRef = useRef([])

  const chartMeta = useMemo(() => {
    const load = chartData.map((point) => point.load)
    const tokens = chartData.map((point) => point.tokens)
    return {
      width: 640,
      height: 220,
      maxLoad: Math.max(...load),
      maxTokens: Math.max(...tokens)
    }
  }, [])

  useEffect(() => {
    setViewVisible(false)
    const timeout = setTimeout(() => setViewVisible(true), 80)
    return () => clearTimeout(timeout)
  }, [activeView])

  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach((timeout) => clearTimeout(timeout))
    }
  }, [])

  const handleSimulate = () => {
    if (isSimulating) return
    setIsSimulating(true)
    setIsTyping(true)

    const messageBatch = [...simulatedMessages]
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)

    messageBatch.forEach((message, index) => {
      const timeout = setTimeout(() => {
        setChatMessages((prev) => [
          ...prev,
          {
            ...message,
            id: `sim-${Date.now()}-${index}`,
            timestamp: 'just now'
          }
        ])
      }, 700 * (index + 1))
      timeoutsRef.current.push(timeout)
    })

    const finishTimeout = setTimeout(() => {
      setIsTyping(false)
      setIsSimulating(false)
    }, 700 * (messageBatch.length + 1))
    timeoutsRef.current.push(finishTimeout)
  }

  const groupedTasks = useMemo(() => {
    return tasks.reduce((acc, task) => {
      if (!acc[task.status]) acc[task.status] = []
      acc[task.status].push(task)
      return acc
    }, {})
  }, [])

  const mainContent = (
    <div className="flex min-h-screen flex-col bg-slate-900 text-slate-100">
      <header className="flex items-center justify-between border-b border-white/10 bg-slate-900/80 px-6 py-4 backdrop-blur">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen((prev) => !prev)}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-slate-800/60 text-slate-200 md:hidden"
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Consendus.ai</p>
            <h1 className="text-xl font-semibold font-sans">Swarm Console</h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-slate-800/70 px-3 py-1 text-xs text-slate-300 md:flex">
            <Activity className="h-4 w-4 text-emerald-400" />
            System Nominal
          </div>
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-slate-800/60 px-3 py-1 text-xs text-slate-300">
            <User className="h-4 w-4 text-indigo-400" />
            admin@consendus
          </div>
        </div>
      </header>

      <div className="relative flex flex-1">
        <aside
          className={`fixed inset-y-0 left-0 z-30 w-64 border-r border-white/10 bg-slate-900/95 px-4 py-6 backdrop-blur transition-transform md:static md:translate-x-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-slate-800/60 px-3 py-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-300">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold">Agent Swarm</p>
              <p className="text-xs text-slate-400">Quorum 3 · Region us-east</p>
            </div>
          </div>

          <nav className="mt-6 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = activeView === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveView(item.id)
                    setSidebarOpen(false)
                  }}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition ${
                    isActive
                      ? 'bg-indigo-500/20 text-indigo-200'
                      : 'text-slate-300 hover:bg-white/5'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </span>
                  <ChevronRight className="h-4 w-4 text-slate-500" />
                </button>
              )}
            )}
          </nav>

          <div className="mt-auto hidden md:block">
            <div className="mt-8 rounded-xl border border-white/10 bg-slate-800/60 p-4 text-xs text-slate-300">
              <div className="mb-2 flex items-center gap-2 text-sm text-white">
                <TerminalSquare className="h-4 w-4 text-emerald-400" />
                Live Telemetry
              </div>
              <p className="leading-relaxed text-slate-400">Trace level: info · 12 live shards · latency 42ms</p>
            </div>
          </div>
        </aside>

        {sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-20 bg-black/40 md:hidden"
            aria-label="Close sidebar"
          />
        )}

        <main className="flex-1 px-6 py-6 md:px-10">
          <FadeWrapper active={viewVisible}>
            {activeView === 'overview' && (
              <section className="space-y-6">
                <div className="rounded-2xl border border-white/10 bg-slate-800/60 p-6 shadow-lg shadow-black/20">
                  <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Overview</p>
                      <h2 className="text-2xl font-semibold font-sans">Swarm Analytics</h2>
                    </div>
                    <div className="flex items-center gap-2 rounded-full border border-white/10 bg-slate-900/60 px-3 py-1 text-xs text-slate-300">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      All systems green
                    </div>
                  </div>
                  <div className="mt-6 grid gap-4 md:grid-cols-4">
                    {stats.map((stat) => (
                      <div
                        key={stat.label}
                        className="rounded-xl border border-white/10 bg-slate-900/60 p-4"
                      >
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{stat.label}</p>
                        <div className="mt-2 flex items-end justify-between">
                          <p className="text-2xl font-semibold text-white">{stat.value}</p>
                          <span className="text-xs text-emerald-400">{stat.delta}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
                  <div className="rounded-2xl border border-white/10 bg-slate-800/60 p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">System Load</p>
                        <h3 className="text-lg font-semibold font-sans">Load vs Token Consumption</h3>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-300">
                        <span className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-indigo-400" /> Load
                        </span>
                        <span className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-emerald-400" /> Tokens
                        </span>
                      </div>
                    </div>
                    <div className="mt-6 w-full overflow-hidden">
                      <svg
                        viewBox={`0 0 ${chartMeta.width} ${chartMeta.height}`}
                        className="h-56 w-full"
                      >
                        <defs>
                          <linearGradient id="loadGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.7" />
                            <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                          </linearGradient>
                          <linearGradient id="tokenGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#34d399" stopOpacity="0.6" />
                            <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
                          </linearGradient>
                        </defs>
                        <path
                          d={buildArea(
                            chartData.map((point) => point.load),
                            chartMeta.width,
                            chartMeta.height,
                            chartMeta.maxLoad
                          )}
                          fill="url(#loadGradient)"
                        />
                        <path
                          d={buildArea(
                            chartData.map((point) => point.tokens),
                            chartMeta.width,
                            chartMeta.height,
                            chartMeta.maxTokens
                          )}
                          fill="url(#tokenGradient)"
                        />
                        <path
                          d={buildPath(
                            chartData.map((point) => point.load),
                            chartMeta.width,
                            chartMeta.height,
                            chartMeta.maxLoad
                          )}
                          fill="none"
                          stroke="#6366f1"
                          strokeWidth="2"
                        />
                        <path
                          d={buildPath(
                            chartData.map((point) => point.tokens),
                            chartMeta.width,
                            chartMeta.height,
                            chartMeta.maxTokens
                          )}
                          fill="none"
                          stroke="#34d399"
                          strokeWidth="2"
                        />
                      </svg>
                      <div className="mt-3 flex justify-between text-xs text-slate-400">
                        {chartData.map((point) => (
                          <span key={point.time}>{point.time}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-slate-800/60 p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Terminal Log</p>
                        <h3 className="text-lg font-semibold font-sans">Event Stream</h3>
                      </div>
                      <TerminalSquare className="h-5 w-5 text-emerald-400" />
                    </div>
                    <div className="mt-4 h-56 space-y-2 overflow-y-auto rounded-xl border border-white/10 bg-slate-900/60 p-3 font-mono text-xs text-emerald-200">
                      {terminalEvents.map((event, index) => (
                        <p key={`${event}-${index}`}>{event}</p>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            )}

            {activeView === 'comms' && (
              <section className="grid gap-6 lg:grid-cols-[1fr_2fr]">
                <div className="rounded-2xl border border-white/10 bg-slate-800/60 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Channels</p>
                      <h3 className="text-lg font-semibold font-sans">Swarm Comms</h3>
                    </div>
                    <MessageCircle className="h-5 w-5 text-indigo-400" />
                  </div>
                  <div className="mt-4 space-y-2">
                    {channels.map((channel) => (
                      <div
                        key={channel}
                        className="rounded-xl border border-white/10 bg-slate-900/50 px-4 py-3 font-mono text-sm text-slate-200"
                      >
                        {channel}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-slate-800/60 p-6">
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Live Channel</p>
                      <h3 className="text-lg font-semibold font-sans">#migration-api-v2</h3>
                    </div>
                    <button
                      onClick={handleSimulate}
                      className="inline-flex items-center gap-2 rounded-full border border-indigo-400/50 bg-indigo-500/20 px-4 py-2 text-xs uppercase tracking-[0.3em] text-indigo-200 transition hover:bg-indigo-500/30"
                    >
                      <Sparkles className="h-4 w-4" />
                      {isSimulating ? 'Simulating...' : 'Simulate Activity'}
                    </button>
                  </div>
                  <div className="mt-4 h-96 space-y-4 overflow-y-auto rounded-xl border border-white/10 bg-slate-900/60 p-4">
                    {chatMessages.map((message) => (
                      <div key={message.id} className="space-y-2">
                        <div className="flex items-center gap-3 text-xs text-slate-400">
                          <span className="font-semibold text-slate-200">{message.agent}</span>
                          <span>{message.timestamp}</span>
                        </div>
                        {message.type === 'code' && <CodeBlock content={message.content} />}
                        {message.type === 'alert' && (
                          <div className="rounded-xl border border-amber-400/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
                            {message.content}
                          </div>
                        )}
                        {message.type === 'text' && (
                          <p className="rounded-xl border border-white/10 bg-slate-800/60 px-4 py-3 text-sm text-slate-200">
                            {message.content}
                          </p>
                        )}
                      </div>
                    ))}
                    {isTyping && (
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <span className="h-2 w-2 animate-pulse rounded-full bg-indigo-400" />
                        Agents are typing...
                      </div>
                    )}
                  </div>
                </div>
              </section>
            )}

            {activeView === 'orchestration' && (
              <section className="space-y-6">
                <div className="rounded-2xl border border-white/10 bg-slate-800/60 p-6">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Orchestration</p>
                  <h2 className="text-2xl font-semibold font-sans">Consensus Task Board</h2>
                </div>
                <div className="grid gap-4 lg:grid-cols-4">
                  {['Pending', 'In Progress', 'Needs Consensus', 'Completed'].map((status) => (
                    <div
                      key={status}
                      className="rounded-2xl border border-white/10 bg-slate-800/60 p-4"
                    >
                      <div className="mb-4 flex items-center justify-between">
                        <p className="text-sm font-semibold text-slate-200">{status}</p>
                        <span className="text-xs text-slate-400">
                          {groupedTasks[status]?.length || 0}
                        </span>
                      </div>
                      <div className="space-y-3">
                        {(groupedTasks[status] || []).map((task) => (
                          <div
                            key={task.title}
                            className="rounded-xl border border-white/10 bg-slate-900/60 p-3"
                          >
                            <p className="text-sm font-semibold text-slate-100">{task.title}</p>
                            <p className="text-xs text-slate-400">{task.agent}</p>
                            {task.status === 'Needs Consensus' && (
                              <div className="mt-3">
                                <div className="flex items-center justify-between text-xs text-slate-400">
                                  <span>Consensus votes</span>
                                  <span>
                                    {task.votes}/{task.totalVotes} votes
                                  </span>
                                </div>
                                <div className="mt-2 h-2 rounded-full bg-slate-800">
                                  <div
                                    className="h-2 rounded-full bg-indigo-400"
                                    style={{
                                      width: `${(task.votes / task.totalVotes) * 100}%`
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

            {activeView === 'fleet' && (
              <section className="space-y-6">
                <div className="rounded-2xl border border-white/10 bg-slate-800/60 p-6">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Agent Fleet</p>
                  <h2 className="text-2xl font-semibold font-sans">Directory</h2>
                </div>
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {agents.map((agent) => (
                    <div
                      key={agent.name}
                      className="rounded-2xl border border-white/10 bg-slate-800/60 p-5"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-lg font-semibold text-white">{agent.name}</p>
                          <p className="text-xs text-slate-400">{agent.role}</p>
                        </div>
                        <span className="flex items-center gap-2 text-xs text-slate-300">
                          <span
                            className={`h-2 w-2 rounded-full ${statusColors[agent.status]}`}
                          />
                          {agent.status}
                        </span>
                      </div>
                      <p className="mt-3 text-sm text-slate-300">{agent.specialization}</p>
                      <div className="mt-4 flex items-center justify-between rounded-xl border border-white/10 bg-slate-900/60 px-3 py-2 text-xs text-slate-400">
                        <span>Uptime</span>
                        <span className="text-emerald-300">{agent.uptime}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </FadeWrapper>
        </main>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-900 font-sans text-white">
      <Head>
        <title>Consendus.ai · Agent Swarm Orchestration</title>
        <meta
          name="description"
          content="Consendus.ai — infrastructure for autonomous agents to communicate, coordinate, and reach consensus."
        />
      </Head>

      {!hasAccess ? (
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.25),_rgba(15,23,42,0.95))]" />
          <section className="relative mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-6 py-16">
            <div className="text-center">
              <p className="text-xs uppercase tracking-[0.4em] text-indigo-200/80">
                Consendus.ai
              </p>
              <h1 className="mt-4 text-4xl font-semibold font-sans text-white md:text-6xl">
                Orchestrate Your Agent Swarm
              </h1>
              <p className="mt-4 max-w-2xl text-lg text-slate-300">
                Infrastructure for autonomous agents to communicate, coordinate, and reach consensus.
              </p>
            </div>

            <div className="mt-12 grid w-full gap-8 lg:grid-cols-[1.2fr_1fr]">
              <div className="rounded-2xl border border-white/10 bg-slate-800/60 p-6 shadow-xl shadow-black/40">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="text-xs uppercase tracking-[0.3em] text-slate-400 font-mono">
                    swarm.config.ts
                  </span>
                  <span className="rounded-full border border-white/10 bg-slate-900/60 px-3 py-1 text-xs text-emerald-300">
                    Connected
                  </span>
                </div>
                <div className="mt-4 font-mono text-sm text-slate-200">
                  <pre className="whitespace-pre-wrap">
{`import { Consendus } from "@consendus/sdk"

const swarm = new Consendus.Swarm({
  quorum: 3,
  topology: "mesh",
  consensus: "byzantine",
  guardrails: ["policy-12", "policy-15"],
  memory: {
    vector: "pinecone://swarm-primary",
    cache: "redis://swarm-cache"
  }
})

swarm.deploy({
  channel: "#migration-api-v2",
  mission: "Safely migrate schema with 99.9% uptime"
})`}
                  </pre>
                </div>
              </div>

              <div className="grid gap-4">
                {features.map((feature) => {
                  const Icon = feature.icon
                  return (
                    <div
                      key={feature.title}
                      className="rounded-2xl border border-white/10 bg-slate-800/60 p-5 backdrop-blur"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-300">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-lg font-semibold text-white">{feature.title}</p>
                          <p className="text-sm text-slate-300">{feature.description}</p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <button
              onClick={() => setHasAccess(true)}
              className="mt-12 inline-flex items-center justify-center rounded-full border border-indigo-400 bg-indigo-500/30 px-8 py-3 text-sm uppercase tracking-[0.3em] text-indigo-100 transition hover:bg-indigo-500/40"
            >
              Access Console
            </button>
          </section>
        </div>
      ) : (
        mainContent
      )}
    </div>
  )
}
