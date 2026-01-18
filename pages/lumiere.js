import Head from 'next/head'
import { useMemo, useState } from 'react'
import {
  Activity,
  AlertTriangle,
  Bot,
  ChevronRight,
  Cpu,
  Gauge,
  GitBranch,
  LayoutGrid,
  MessageCircle,
  PanelLeft,
  Shield,
  TerminalSquare,
  Users
} from 'lucide-react'

const featureCards = [
  {
    title: 'Semantic Bus',
    description: 'Unified event mesh that routes intent, context, and policy across every agent.',
    icon: GitBranch
  },
  {
    title: 'Consensus Engine',
    description: 'Weighted quorum logic ensures every plan is validated before execution.',
    icon: Users
  },
  {
    title: 'Guardian Rails',
    description: 'Policy-bound safeguards stop unsafe or non-compliant actions in real time.',
    icon: Shield
  }
]

const stats = [
  { label: 'Active Agents', value: '42', delta: '+6.4%' },
  { label: 'Messages / min', value: '1,284', delta: '+12%' },
  { label: 'Consensus Rate', value: '98.2%', delta: '+0.4%' },
  { label: 'Token Usage', value: '3.4M', delta: '+9.1%' }
]

const chartData = [
  { time: '00:00', load: 32, tokens: 20 },
  { time: '02:00', load: 40, tokens: 28 },
  { time: '04:00', load: 38, tokens: 26 },
  { time: '06:00', load: 55, tokens: 42 },
  { time: '08:00', load: 62, tokens: 48 },
  { time: '10:00', load: 58, tokens: 44 },
  { time: '12:00', load: 70, tokens: 56 },
  { time: '14:00', load: 74, tokens: 63 },
  { time: '16:00', load: 66, tokens: 52 },
  { time: '18:00', load: 78, tokens: 67 },
  { time: '20:00', load: 72, tokens: 61 }
]

const terminalEvents = [
  '[INFO] Agent-2 connected to semantic bus.',
  '[INFO] Consensus quorum reached for task 14.',
  '[WARN] High latency detected in region ap-south-1.',
  '[INFO] Guardian rail patched for policy drift.',
  '[INFO] Agent-7 completed mission: migrate-api-v2.'
]

const channels = ['#migration-api-v2', '#security-audit', '#agent-ops', '#edge-routing']

const initialMessages = [
  {
    id: 'msg-1',
    sender: 'Atlas-Orchestrator',
    role: 'System',
    content: 'Consensus round initiated for migration-api-v2 rollout.'
  },
  {
    id: 'msg-2',
    sender: 'Codex-Dev',
    role: 'Agent',
    content:
      'I can handle schema migrations. Proposed plan:\n```ts\nconst swarm = new Consendus.Swarm({\n  protocol: "consensus-v2",\n  quorum: 3,\n  guardrails: ["pii-redaction", "rollback"]\n});\n```'
  },
  {
    id: 'msg-3',
    sender: 'Sentry-Sec',
    role: 'Alert',
    content: '⚠️ Alert: Policy threshold exceeded for external tokens.'
  }
]

const agentTasks = [
  {
    status: 'Pending',
    title: 'Bootstrap vector memory shard',
    assignee: 'Atlas-Orchestrator'
  },
  {
    status: 'In Progress',
    title: 'Spin up migration-api-v2 blue/green',
    assignee: 'Codex-Dev'
  },
  {
    status: 'Needs Consensus',
    title: 'Authorize new guardian policy',
    assignee: 'Sentry-Sec',
    votes: '1/3'
  },
  {
    status: 'Completed',
    title: 'Encrypt agent telemetry pipeline',
    assignee: 'Nova-Infra'
  }
]

const agents = [
  {
    name: 'Atlas-Orchestrator',
    role: 'Coordinator',
    specialization: 'Swarm routing',
    uptime: '18d 4h',
    status: 'Idle'
  },
  {
    name: 'Codex-Dev',
    role: 'Builder',
    specialization: 'API migrations',
    uptime: '11d 2h',
    status: 'Busy'
  },
  {
    name: 'Sentry-Sec',
    role: 'Guardian',
    specialization: 'Policy enforcement',
    uptime: '32d 9h',
    status: 'Idle'
  },
  {
    name: 'Nova-Infra',
    role: 'Scaler',
    specialization: 'Edge infrastructure',
    uptime: '6d 8h',
    status: 'Error'
  }
]

const navItems = [
  { id: 'overview', label: 'Overview', icon: LayoutGrid },
  { id: 'comms', label: 'Comms', icon: MessageCircle },
  { id: 'orchestration', label: 'Orchestration', icon: Cpu },
  { id: 'fleet', label: 'Agent Fleet', icon: Bot }
]

const statusColor = {
  Idle: 'bg-emerald-400',
  Busy: 'bg-amber-400',
  Error: 'bg-red-500'
}

const taskColumns = ['Pending', 'In Progress', 'Needs Consensus', 'Completed']

const buildPath = (points, key) =>
  points
    .map((point, index) =>
      `${index === 0 ? 'M' : 'L'} ${index * 72} ${120 - point[key]}`
    )
    .join(' ')

function CodeWindow() {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-800/70 shadow-xl backdrop-blur">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 text-xs text-slate-400">
        <span className="flex items-center gap-2">
          <TerminalSquare className="h-4 w-4" />
          swarm.config.ts
        </span>
        <span className="rounded-full bg-white/10 px-2 py-1">secured</span>
      </div>
      <pre className="overflow-x-auto px-6 py-5 text-sm text-emerald-200">
        <code className="font-mono">
          {`const swarm = new Consendus.Swarm({
  id: 'consensus-core',
  protocol: 'helios',
  quorum: 3,
  channels: ['comms', 'orchestration'],
  guardrails: ['pii-redaction', 'escalation'],
  observers: ['atlas', 'sentry']
})

swarm.deploy({
  latencyBudget: '180ms',
  consensusTimeout: '12s',
  fallbacks: ['human-review']
})`}
        </code>
      </pre>
    </div>
  )
}

function ChatMessage({ message }) {
  const isAlert = message.role === 'Alert'
  const isSystem = message.role === 'System'
  const containerClass = isAlert
    ? 'border-amber-500/40 bg-amber-500/10 text-amber-100'
    : isSystem
    ? 'border-purple-500/30 bg-purple-500/10 text-purple-100'
    : 'border-white/10 bg-slate-800/70 text-slate-100'

  return (
    <div className={`rounded-xl border px-4 py-3 text-sm ${containerClass}`}>
      <div className="mb-2 flex items-center justify-between text-xs text-slate-400">
        <span className="font-semibold text-slate-200">{message.sender}</span>
        <span>{message.role}</span>
      </div>
      {message.content.includes('```') ? (
        <pre className="mt-2 overflow-x-auto rounded-lg bg-slate-900/80 p-3 text-xs text-emerald-200">
          <code className="font-mono">{message.content.replace(/```(ts)?/g, '')}</code>
        </pre>
      ) : (
        <p className="whitespace-pre-line text-sm leading-relaxed">{message.content}</p>
      )}
    </div>
  )
}

export default function LumiereApp() {
  const [view, setView] = useState('landing')
  const [activeTab, setActiveTab] = useState('overview')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [chatMessages, setChatMessages] = useState(initialMessages)
  const [isSimulating, setIsSimulating] = useState(false)
  const [showTyping, setShowTyping] = useState(false)

  const chartPaths = useMemo(() => {
    return {
      load: buildPath(chartData, 'load'),
      tokens: buildPath(chartData, 'tokens')
    }
  }, [])

  const simulateActivity = () => {
    if (isSimulating) return
    setIsSimulating(true)
    setShowTyping(true)

    const newMessages = [
      {
        id: `msg-${Date.now()}-1`,
        sender: 'Nova-Infra',
        role: 'Agent',
        content: 'Edge cluster warmed. Ready to reroute 25% of traffic.'
      },
      {
        id: `msg-${Date.now()}-2`,
        sender: 'Atlas-Orchestrator',
        role: 'System',
        content: 'Consensus quorum reached. Proceeding with staged deployment.'
      },
      {
        id: `msg-${Date.now()}-3`,
        sender: 'Sentry-Sec',
        role: 'Alert',
        content: '✅ Guardian rails validated. No anomalies detected.'
      }
    ]

    newMessages.forEach((message, index) => {
      setTimeout(() => {
        setChatMessages((prev) => [...prev, message])
      }, 700 * (index + 1))
    })

    setTimeout(() => {
      setShowTyping(false)
      setIsSimulating(false)
    }, 700 * (newMessages.length + 1))
  }

  const mainContent = (
    <main className="flex-1 space-y-6">
      {activeTab === 'overview' && (
        <section className="space-y-6 animate-[fadeIn_0.6s_ease-out]">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-white/10 bg-slate-800/80 p-4 shadow-lg"
              >
                <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
                  {stat.label}
                </p>
                <div className="mt-3 flex items-baseline justify-between">
                  <span className="text-2xl font-semibold text-white">{stat.value}</span>
                  <span className="text-xs text-emerald-300">{stat.delta}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
            <div className="rounded-2xl border border-white/10 bg-slate-800/80 p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">System Load</p>
                  <h3 className="text-xl font-semibold text-white">Token Consumption</h3>
                </div>
                <span className="flex items-center gap-2 text-xs text-emerald-300">
                  <Activity className="h-4 w-4" />
                  live
                </span>
              </div>
              <div className="mt-6">
                <svg viewBox="0 0 720 140" className="h-40 w-full">
                  <defs>
                    <linearGradient id="load" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#6366f1" stopOpacity="0.6" />
                      <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="tokens" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity="0.5" />
                      <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path
                    d={`${chartPaths.load} L 720 140 L 0 140 Z`}
                    fill="url(#load)"
                    stroke="#6366f1"
                    strokeWidth="2"
                  />
                  <path
                    d={`${chartPaths.tokens} L 720 140 L 0 140 Z`}
                    fill="url(#tokens)"
                    stroke="#10b981"
                    strokeWidth="2"
                  />
                </svg>
                <div className="mt-4 flex justify-between text-xs text-slate-500">
                  {chartData.map((point) => (
                    <span key={point.time}>{point.time}</span>
                  ))}
                </div>
              </div>
              <p className="leading-relaxed text-slate-400">Trace level: info · 12 live shards · latency 42ms</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-6 shadow-lg">
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <TerminalSquare className="h-4 w-4" />
                Terminal Log
              </div>
              <div className="no-scrollbar mt-4 max-h-56 space-y-3 overflow-y-auto pr-2 text-xs text-emerald-200">
                {terminalEvents.map((event) => (
                  <p key={event} className="font-mono">
                    {event}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {activeTab === 'comms' && (
        <section className="grid gap-6 lg:grid-cols-[1fr,3fr] animate-[fadeIn_0.6s_ease-out]">
          <div className="rounded-2xl border border-white/10 bg-slate-800/80 p-5 shadow-lg">
            <h3 className="text-sm font-semibold text-white">Channels</h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-300">
              {channels.map((channel) => (
                <li key={channel} className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-indigo-400" />
                  {channel}
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={simulateActivity}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-400"
            >
              <Gauge className="h-4 w-4" />
              {isSimulating ? 'Simulating...' : 'Simulate Activity'}
            </button>
            <p className="mt-3 text-xs text-slate-400">
              Adds new agent messages with a typing delay.
            </p>
          </div>
          <div className="space-y-4">
            {chatMessages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {showTyping && (
              <div className="rounded-xl border border-white/10 bg-slate-800/60 px-4 py-3 text-xs text-slate-400">
                <span className="inline-flex items-center gap-2">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-indigo-400" />
                  Agents are typing...
                </span>
              </div>
            )}
          </div>
        </section>
      )}

      {activeTab === 'orchestration' && (
        <section className="space-y-6 animate-[fadeIn_0.6s_ease-out]">
          <div className="flex items-center gap-3">
            <Cpu className="h-5 w-5 text-indigo-400" />
            <h2 className="text-lg font-semibold text-white">Mission Orchestration</h2>
          </div>
          <div className="grid gap-4 lg:grid-cols-4">
            {taskColumns.map((column) => (
              <div
                key={column}
                className="rounded-2xl border border-white/10 bg-slate-800/70 p-4"
              >
                <h3 className="text-sm font-semibold text-slate-100">{column}</h3>
                <div className="mt-4 space-y-3">
                  {agentTasks
                    .filter((task) => task.status === column)
                    .map((task) => (
                      <div
                        key={task.title}
                        className="rounded-xl border border-white/10 bg-slate-900/70 p-3 text-sm"
                      >
                        <p className="font-semibold text-white">{task.title}</p>
                        <p className="mt-2 text-xs text-slate-400">{task.assignee}</p>
                        {task.votes && (
                          <div className="mt-3">
                            <div className="flex items-center justify-between text-xs text-slate-400">
                              <span>Consensus</span>
                              <span>{task.votes} votes</span>
                            </div>
                            <div className="mt-2 h-2 rounded-full bg-white/10">
                              <div className="h-2 w-1/3 rounded-full bg-amber-400" />
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
        <section className="space-y-6 animate-[fadeIn_0.6s_ease-out]">
          <div className="flex items-center gap-3">
            <Bot className="h-5 w-5 text-indigo-400" />
            <h2 className="text-lg font-semibold text-white">Agent Fleet</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {agents.map((agent) => (
              <div
                key={agent.name}
                className="rounded-2xl border border-white/10 bg-slate-800/70 p-5"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-semibold text-white">{agent.name}</h3>
                  <span className={`h-2 w-2 rounded-full ${statusColor[agent.status]}`} />
                </div>
                <div className="mt-4 space-y-2 text-sm text-slate-300">
                  <p>
                    <span className="text-slate-500">Role:</span> {agent.role}
                  </p>
                  <p>
                    <span className="text-slate-500">Specialization:</span> {agent.specialization}
                  </p>
                  <p>
                    <span className="text-slate-500">Uptime:</span> {agent.uptime}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  )

  return (
    <>
      <Head>
        <title>Consendus.ai</title>
      </Head>
      <div className="min-h-screen bg-slate-900 text-slate-100">
        {view === 'landing' ? (
          <div className="relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.35),_transparent_55%)]" />
            <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col px-6 pb-24 pt-16">
              <header className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-lg font-semibold">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/20">
                    <Bot className="h-5 w-5 text-indigo-300" />
                  </span>
                  Consendus.ai
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setView('console')
                    setActiveTab('overview')
                  }}
                  className="hidden items-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 py-2 text-sm font-semibold text-white transition hover:bg-white/10 md:flex"
                >
                  Access Console
                  <ChevronRight className="h-4 w-4" />
                </button>
              </header>

              <div className="mt-16 grid gap-12 lg:grid-cols-[1.1fr,0.9fr]">
                <div className="space-y-6">
                  <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.3em] text-slate-400">
                    <AlertTriangle className="h-3 w-3 text-amber-300" />
                    Autonomous infrastructure
                  </p>
                  <h1 className="text-4xl font-semibold text-white md:text-5xl">
                    Orchestrate Your Agent Swarm
                  </h1>
                  <p className="text-lg text-slate-300">
                    Infrastructure for autonomous agents to communicate, coordinate, and reach
                    consensus.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <button
                      type="button"
                      onClick={() => {
                        setView('console')
                        setActiveTab('overview')
                      }}
                      className="rounded-xl bg-indigo-500 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-indigo-400"
                    >
                      Access Console
                    </button>
                    <button
                      type="button"
                      className="rounded-xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-slate-200"
                    >
                      View Architecture
                    </button>
                  </div>
                </div>
                <CodeWindow />
              </div>

              <div className="mt-20 grid gap-6 md:grid-cols-3">
                {featureCards.map((feature) => {
                  const Icon = feature.icon
                  return (
                    <div
                      key={feature.title}
                      className="rounded-2xl border border-white/10 bg-slate-800/70 p-6 shadow-lg"
                    >
                      <Icon className="h-6 w-6 text-indigo-400" />
                      <h3 className="mt-4 text-lg font-semibold text-white">{feature.title}</h3>
                      <p className="mt-2 text-sm text-slate-300">{feature.description}</p>
                    </div>
                  )}
                )}
              </div>

              <button
                type="button"
                onClick={() => {
                  setView('console')
                  setActiveTab('overview')
                }}
                className="mt-16 inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10 md:hidden"
              >
                Access Console
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex min-h-screen">
            <aside
              className={`fixed inset-y-0 left-0 z-20 w-64 flex-col border-r border-white/10 bg-slate-900/95 px-6 py-6 backdrop-blur transition-transform lg:static lg:translate-x-0 ${
                sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-base font-semibold">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500/20">
                    <Bot className="h-4 w-4 text-indigo-300" />
                  </span>
                  Consendus.ai
                </div>
                <button
                  type="button"
                  onClick={() => setSidebarOpen(false)}
                  className="text-slate-400 lg:hidden"
                >
                  <PanelLeft className="h-5 w-5" />
                </button>
              </div>
              <nav className="mt-10 space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon
                  const active = activeTab === item.id
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setActiveTab(item.id)
                        setSidebarOpen(false)
                      }}
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition ${
                        active
                          ? 'bg-indigo-500/20 text-white'
                          : 'text-slate-400 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </button>
                  )
                })}
              </nav>
              <div className="mt-auto hidden pt-10 text-xs text-slate-500 lg:block">
                Status: <span className="text-emerald-300">Operational</span>
              </div>
            </aside>
            <div className="flex flex-1 flex-col">
              <header className="flex items-center justify-between border-b border-white/10 px-6 py-4">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setSidebarOpen((prev) => !prev)}
                    className="text-slate-400 lg:hidden"
                  >
                    <PanelLeft className="h-5 w-5" />
                  </button>
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                      Console
                    </p>
                    <h2 className="text-lg font-semibold text-white">{navItems.find((item) => item.id === activeTab)?.label}</h2>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300 md:flex">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    Operator: admin@consendus.ai
                  </div>
                  <button
                    type="button"
                    className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-200"
                  >
                    <Users className="h-4 w-4" />
                    Settings
                  </button>
                </div>
              </header>
              <div className="flex-1 bg-slate-900 px-6 py-8">
                {mainContent}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
